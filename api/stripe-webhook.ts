import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Checkout session completed:', {
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          amountTotal: session.amount_total,
          currency: session.currency,
          paymentStatus: session.payment_status,
          metadata: session.metadata
        });

        // Here you can:
        // 1. Save order to your database
        // 2. Send confirmation emails
        // 3. Update inventory
        // 4. Trigger fulfillment processes
        
        // Example: Log order details for Pour Ta Manufacturing
        const orderData = {
          orderId: session.metadata?.orderType || 'realtor-coffee-order',
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email,
          customerPhone: session.customer_details?.phone,
          shippingAddress: session.shipping_details?.address,
          billingAddress: session.customer_details?.address,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
          currency: session.currency,
          designs: session.metadata?.designs || '1',
          timestamp: new Date().toISOString(),
          paymentStatus: session.payment_status,
          fulfillmentStatus: 'pending'
        };

        console.log('Order data for Pour Ta Manufacturing:', orderData);

        // TODO: Integrate with your Pour Ta Manufacturing system
        // - Save to Supabase orders table
        // - Send to production queue
        // - Send confirmation email to customer
        // - Notify production team

        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}