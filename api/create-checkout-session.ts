import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

// Allow Bolt preview to call your deployed API
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or your preview origin if you prefer
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, metadata, successUrl, cancelUrl } = req.body as {
      items: { name: string; quantity: number; unit_amount: number; description?: string }[];
      metadata?: Record<string, string>;
      successUrl: string;
      cancelUrl: string;
    };

    if (!Array.isArray(items) || !items.length) throw new Error('No items provided');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((it) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: it.name, description: it.description },
          unit_amount: it.unit_amount,
        },
        quantity: it.quantity,
      })),
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      phone_number_collection: { enabled: true },
      customer_creation: 'always',
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
      ],
      metadata,
    });

    return res.status(200).json({ id: session.id });
  } catch (e: any) {
    console.error('create-checkout-session error', e);
    return res.status(500).json({ error: e?.message ?? 'Internal error' });
  }
}