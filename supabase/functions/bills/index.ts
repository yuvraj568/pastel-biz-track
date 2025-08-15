import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

interface BillData {
  vendor: string
  date: string
  amount: number
  currency: string
  category: string
}

// Mock AI parsing function
async function parseBillContent(filename: string): Promise<BillData> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock parsed data based on filename or random generation
  const vendors = ['ABC Corp', 'XYZ Ltd', 'Office Supplies Inc', 'Tech Solutions']
  const categories = ['Office Supplies', 'Utilities', 'Travel', 'Equipment', 'Software']
  
  return {
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    date: new Date().toISOString().split('T')[0],
    amount: Math.floor(Math.random() * 500) + 50,
    currency: 'USD',
    category: categories[Math.floor(Math.random() * categories.length)]
  }
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

    // GET /bills - Get all bills
    if (method === 'GET') {
      const { data: bills, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bills:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch bills' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ bills }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /bills - Upload and parse bill
    if (method === 'POST') {
      const formData = await req.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // For demo purposes, we'll simulate file storage and parsing
      const filePath = `bills/${user.user.id}/${Date.now()}_${file.name}`
      
      // Create bill record with "processing" status
      const { data: bill, error: insertError } = await supabase
        .from('bills')
        .insert({
          original_filename: file.name,
          file_path: filePath,
          status: 'processing',
          uploaded_by: user.user.id
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating bill record:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to create bill record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Simulate AI parsing (in a real app, this would be a background job)
      try {
        const parsedData = await parseBillContent(file.name)
        
        // Update bill with parsed data
        const { error: updateError } = await supabase
          .from('bills')
          .update({
            parsed_data: parsedData,
            status: 'parsed'
          })
          .eq('id', bill.id)

        if (updateError) {
          console.error('Error updating bill with parsed data:', updateError)
        }

        return new Response(
          JSON.stringify({ 
            bill: { ...bill, parsed_data: parsedData, status: 'parsed' },
            message: 'Bill uploaded and parsed successfully'
          }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (parseError) {
        console.error('Error parsing bill:', parseError)
        
        // Update bill status to failed
        await supabase
          .from('bills')
          .update({ status: 'failed' })
          .eq('id', bill.id)

        return new Response(
          JSON.stringify({ 
            bill: { ...bill, status: 'failed' },
            error: 'Failed to parse bill'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
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