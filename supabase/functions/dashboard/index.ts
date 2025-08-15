import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

function generateChartData(transactions: any[]) {
  const monthlyData: Record<string, { revenue: number; expenses: number }> = {}
  
  // Get last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    monthlyData[month] = { revenue: 0, expenses: 0 }
  }

  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date)
    const month = transactionDate.toLocaleDateString('en-US', { month: 'short' })
    
    if (monthlyData[month]) {
      if (transaction.type === 'Income') {
        monthlyData[month].revenue += parseFloat(transaction.amount)
      } else if (transaction.type === 'Expense') {
        monthlyData[month].expenses += parseFloat(transaction.amount)
      }
    }
  })

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data
  }))
}

function generateExpenseBreakdown(transactions: any[]) {
  const categoryTotals: Record<string, number> = {}
  
  transactions
    .filter(t => t.type === 'Expense')
    .forEach(transaction => {
      const category = transaction.category
      categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(transaction.amount)
    })

  const colors = ['#5AB2FF', '#A0DEFF', '#CAF4FF', '#FFF9D0', '#E8F4FD']
  
  return Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, value], index) => ({
      name,
      value,
      color: colors[index] || colors[colors.length - 1]
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

    const method = req.method

    // GET /dashboard - Get dashboard analytics
    if (method === 'GET') {
      // Fetch all transactions
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

      // Calculate KPI metrics
      const totalRevenue = transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const totalExpenses = transactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

      const totalProfit = totalRevenue - totalExpenses

      const kpiMetrics = {
        totalRevenue,
        totalExpenses,
        totalProfit
      }

      // Generate chart data
      const chartData = generateChartData(transactions)
      
      // Generate expense breakdown
      const expenseBreakdown = generateExpenseBreakdown(transactions)

      // Get recent transactions (last 5)
      const recentTransactions = transactions.slice(0, 5)

      return new Response(
        JSON.stringify({
          kpiMetrics,
          chartData,
          expenseBreakdown,
          recentTransactions
        }),
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