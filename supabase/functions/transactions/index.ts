import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

interface TransactionRequest {
  date: string
  type: 'Income' | 'Expense' | 'Transfer'
  account: string
  category: string
  amount: number
  currency: 'USD' | 'INR' | 'GBP'
  description?: string
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

    // GET /transactions - Get all transactions with optional filters
    if (method === 'GET') {
      const { searchParams } = url
      const startDate = searchParams.get('startDate')
      const endDate = searchParams.get('endDate')
      const type = searchParams.get('type')
      const currency = searchParams.get('currency')
      const category = searchParams.get('category')

      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (startDate) query = query.gte('date', startDate)
      if (endDate) query = query.lte('date', endDate)
      if (type) query = query.eq('type', type)
      if (currency) query = query.eq('currency', currency)
      if (category) query = query.ilike('category', `%${category}%`)

      const { data: transactions, error } = await query

      if (error) {
        console.error('Error fetching transactions:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch transactions' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ transactions }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /transactions - Create new transaction
    if (method === 'POST') {
      const body: TransactionRequest = await req.json()

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          ...body,
          created_by: user.user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating transaction:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to create transaction' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ transaction }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT /transactions/:id - Update transaction
    if (method === 'PUT') {
      const pathParts = url.pathname.split('/')
      const transactionId = pathParts[pathParts.length - 1]
      const body: Partial<TransactionRequest> = await req.json()

      const { data: transaction, error } = await supabase
        .from('transactions')
        .update(body)
        .eq('id', transactionId)
        .eq('created_by', user.user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating transaction:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update transaction' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ transaction }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // DELETE /transactions/:id - Delete transaction
    if (method === 'DELETE') {
      const pathParts = url.pathname.split('/')
      const transactionId = pathParts[pathParts.length - 1]

      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('created_by', user.user.id)

      if (error) {
        console.error('Error deleting transaction:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to delete transaction' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ message: 'Transaction deleted successfully' }),
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