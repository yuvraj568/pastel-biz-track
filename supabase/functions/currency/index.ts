import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Mock currency rates (as requested: 1 USD = 85 INR, 1 USD = 0.8 GBP)
const mockRates = {
  'USD-INR': 85,
  'USD-GBP': 0.8,
  'INR-USD': 1/85,
  'INR-GBP': 0.8/85,
  'GBP-USD': 1/0.8,
  'GBP-INR': 85/0.8,
}

async function fetchCurrencyRates() {
  // In production, you would fetch from a real API like:
  // const response = await fetch('https://api.exchangerate.host/latest?base=USD')
  // For now, we'll use mock data
  
  const rates = [
    { base_currency: 'USD', target_currency: 'INR', rate: mockRates['USD-INR'] },
    { base_currency: 'USD', target_currency: 'GBP', rate: mockRates['USD-GBP'] },
    { base_currency: 'INR', target_currency: 'USD', rate: mockRates['INR-USD'] },
    { base_currency: 'INR', target_currency: 'GBP', rate: mockRates['INR-GBP'] },
    { base_currency: 'GBP', target_currency: 'USD', rate: mockRates['GBP-USD'] },
    { base_currency: 'GBP', target_currency: 'INR', rate: mockRates['GBP-INR'] },
  ]

  return rates
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const method = req.method
    const action = url.searchParams.get('action')

    // GET /currency - Get current currency rates
    if (method === 'GET') {
      const { data: rates, error } = await supabase
        .from('currency_rates')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Error fetching currency rates:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch currency rates' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ rates }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /currency?action=update - Update currency rates
    if (method === 'POST' && action === 'update') {
      console.log('Updating currency rates...')
      
      const latestRates = await fetchCurrencyRates()
      
      // Update rates in database
      for (const rate of latestRates) {
        await supabase
          .from('currency_rates')
          .upsert({
            base_currency: rate.base_currency,
            target_currency: rate.target_currency,
            rate: rate.rate
          }, { 
            onConflict: 'base_currency,target_currency'
          })
      }

      return new Response(
        JSON.stringify({ 
          message: 'Currency rates updated successfully',
          updatedRates: latestRates.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /currency?action=convert - Convert between currencies
    if (method === 'POST' && action === 'convert') {
      const body = await req.json()
      const { amount, from, to } = body

      if (!amount || !from || !to) {
        return new Response(
          JSON.stringify({ error: 'Amount, from, and to currencies are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (from === to) {
        return new Response(
          JSON.stringify({ 
            originalAmount: amount,
            convertedAmount: amount,
            fromCurrency: from,
            toCurrency: to,
            rate: 1
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get exchange rate
      const { data: rateData, error } = await supabase
        .from('currency_rates')
        .select('rate')
        .eq('base_currency', from)
        .eq('target_currency', to)
        .single()

      if (error || !rateData) {
        return new Response(
          JSON.stringify({ error: 'Exchange rate not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const convertedAmount = amount * rateData.rate

      return new Response(
        JSON.stringify({
          originalAmount: amount,
          convertedAmount: parseFloat(convertedAmount.toFixed(2)),
          fromCurrency: from,
          toCurrency: to,
          rate: rateData.rate
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