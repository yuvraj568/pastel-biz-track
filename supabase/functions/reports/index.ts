import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Mock report generators
function generateProfitLossReport(transactions: any[]) {
  const income = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  const expenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  return {
    totalIncome: income,
    totalExpenses: expenses,
    netProfit: income - expenses,
    profitMargin: income > 0 ? ((income - expenses) / income * 100).toFixed(2) : 0
  }
}

function generateCashFlowReport(transactions: any[]) {
  const monthlyData: Record<string, { inflow: number; outflow: number }> = {}
  
  transactions.forEach(transaction => {
    const month = new Date(transaction.date).toISOString().slice(0, 7)
    if (!monthlyData[month]) {
      monthlyData[month] = { inflow: 0, outflow: 0 }
    }
    
    if (transaction.type === 'Income') {
      monthlyData[month].inflow += parseFloat(transaction.amount)
    } else if (transaction.type === 'Expense') {
      monthlyData[month].outflow += parseFloat(transaction.amount)
    }
  })

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
    netFlow: data.inflow - data.outflow
  }))
}

function generateExpenseByCategoryReport(transactions: any[]) {
  const categoryTotals: Record<string, number> = {}
  
  transactions
    .filter(t => t.type === 'Expense')
    .forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount)
    })

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: 0 // Will be calculated on frontend
  }))
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: user, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const method = req.method
    const reportType = url.searchParams.get('type')

    if (method === 'GET' && reportType) {
      // Fetch transactions for report generation
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch transactions' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      let reportData: any = {}

      switch (reportType) {
        case 'profit_loss':
          reportData = generateProfitLossReport(transactions)
          break
        case 'cash_flow':
          reportData = generateCashFlowReport(transactions)
          break
        case 'expense_by_category':
          reportData = generateExpenseByCategoryReport(transactions)
          break
        case 'balance_sheet':
          // Mock balance sheet data
          reportData = {
            assets: {
              currentAssets: 25000,
              fixedAssets: 75000,
              totalAssets: 100000
            },
            liabilities: {
              currentLiabilities: 15000,
              longTermLiabilities: 35000,
              totalLiabilities: 50000
            },
            equity: {
              ownersEquity: 50000,
              totalEquity: 50000
            }
          }
          break
        case 'gst_vat_summary':
          // Mock GST/VAT summary
          reportData = {
            totalTaxableAmount: 45000,
            totalTaxAmount: 8100,
            taxRate: 18,
            taxPeriod: new Date().toISOString().slice(0, 7)
          }
          break
        case 'income_by_channel':
          // Mock income by channel
          reportData = [
            { channel: 'Online Sales', amount: 35000, percentage: 70 },
            { channel: 'Retail Store', amount: 10000, percentage: 20 },
            { channel: 'Wholesale', amount: 5000, percentage: 10 }
          ]
          break
        default:
          return new Response(
            JSON.stringify({ error: 'Invalid report type' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
      }

      // Save report to database
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .insert({
          type: reportType,
          data: reportData,
          generated_by: user.user.id
        })
        .select()
        .single()

      if (reportError) {
        console.error('Error saving report:', reportError)
        // Still return the data even if saving fails
      }

      return new Response(
        JSON.stringify({ reportType, data: reportData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // GET /reports - Get saved reports
    if (method === 'GET') {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching reports:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch reports' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ reports }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})