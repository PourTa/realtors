import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const id = (req.query.session_id || req.query.id) as string;
    if (!id) return res.status(400).json({ error: 'Missing session_id' });
    const session = await stripe.checkout.sessions.retrieve(id, { expand: ['payment_intent'] });
    res.status(200).json({ session });
  } catch (e: any) {
    console.error('session-status error', e);
    res.status(500).json({ error: e?.message ?? 'Internal error' });
  }
}