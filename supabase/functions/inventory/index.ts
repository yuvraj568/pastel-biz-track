import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

// Mock inventory data
const mockInventoryItems = [
  { name: 'Office Chair', cost: 299.99, quantity: 25 },
  { name: 'Desk Lamp', cost: 89.99, quantity: 50 },
  { name: 'Monitor Stand', cost: 45.99, quantity: 30 },
  { name: 'Wireless Mouse', cost: 29.99, quantity: 100 },
  { name: 'Keyboard', cost: 79.99, quantity: 75 }
]

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
    const action = url.searchParams.get('action')

    // GET /inventory - Get inventory items
    if (method === 'GET') {
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching inventory:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch inventory' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Calculate total value and other metrics
      const totalValue = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const linkedItems = items.filter(item => item.linked_status).length

      return new Response(
        JSON.stringify({ 
          items,
          summary: {
            totalItems,
            totalValue,
            linkedItems,
            integrationStatus: 'connected'
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /inventory?action=sync - Sync inventory from external system
    if (method === 'POST' && action === 'sync') {
      console.log('Starting inventory sync...')
      
      // Simulate syncing with external inventory system
      for (const mockItem of mockInventoryItems) {
        // Check if item exists
        const { data: existingItem } = await supabase
          .from('inventory_items')
          .select('id')
          .eq('name', mockItem.name)
          .single()

        if (!existingItem) {
          // Create new item
          await supabase
            .from('inventory_items')
            .insert({
              ...mockItem,
              linked_status: true
            })
        } else {
          // Update existing item
          await supabase
            .from('inventory_items')
            .update({
              cost: mockItem.cost,
              quantity: mockItem.quantity,
              linked_status: true
            })
            .eq('name', mockItem.name)
        }
      }

      return new Response(
        JSON.stringify({ 
          message: 'Inventory synced successfully',
          syncedItems: mockInventoryItems.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /inventory?action=link - Link inventory system
    if (method === 'POST' && action === 'link') {
      // Simulate linking to external inventory system
      console.log('Linking inventory system...')
      
      // Update settings to mark inventory as linked
      await supabase
        .from('settings')
        .upsert({ 
          key: 'inventory_integration_enabled', 
          value: true 
        }, { onConflict: 'key' })

      return new Response(
        JSON.stringify({ 
          message: 'Inventory system linked successfully',
          status: 'connected'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // POST /inventory - Create new inventory item
    if (method === 'POST') {
      const body = await req.json()
      
      const { data: item, error } = await supabase
        .from('inventory_items')
        .insert(body)
        .select()
        .single()

      if (error) {
        console.error('Error creating inventory item:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to create inventory item' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ item }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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