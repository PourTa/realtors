// supabase/functions/create-checkout-session/index.ts
import Stripe from "npm:stripe@^16.6.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, metadata, successUrl, cancelUrl } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No items provided");
    }

    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

    // Build Stripe line_items
    const line_items = items.map((it: any) => {
      const qty = Number(it.quantity) || 1;
      const amount = Number(it.unit_amount);
      if (!Number.isFinite(amount) || amount < 50) {
        throw new Error("Invalid unit_amount (must be cents ≥ 50)");
      }
      return {
        price_data: {
          currency: "usd",
          product_data: { name: String(it.name), description: it.description ?? undefined },
          unit_amount: Math.round(amount),
        },
        quantity: qty,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      phone_number_collection: { enabled: true },
      customer_creation: "always",
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ],
      metadata: metadata ?? {},
    });

    return new Response(JSON.stringify({ id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    console.error("create-checkout-session error:", e);
    return new Response(JSON.stringify({ error: e?.message ?? "Internal error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});