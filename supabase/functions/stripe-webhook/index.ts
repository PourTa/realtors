import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    // Verify webhook signature
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || 'sk_live_51234567890abcdef...', {
      apiVersion: '2023-10-16',
    })
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    const supabase = createClient(
      'https://vlkxsbdhlsyjojltxrvv.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsa3hzYmRobHN5am9qbHR4cnZ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMzMjQ3MCwiZXhwIjoyMDY4OTA4NDcwfQ.iSzfD6kKw2cIZdxaK0hgP08xyYI_AoU_8QaHmzIjqeg'
    )

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        // Update order with payment details
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            customer_email: session.customer_details?.email,
            shipping_address: session.shipping_details?.address,
            billing_address: session.customer_details?.address,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Error updating order:', updateError)
          return new Response('Error updating order', { status: 500 })
        }

        console.log('Order updated successfully for session:', session.id)
        break

      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break

      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        
        // Update order status to failed
        const failedPayment = event.data.object
        const { error: failError } = await supabase
          .from('orders')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', failedPayment.metadata?.session_id)

        if (failError) {
          console.error('Error updating failed order:', failError)
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response('ok', { headers: corsHeaders })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 400 })
  }
})