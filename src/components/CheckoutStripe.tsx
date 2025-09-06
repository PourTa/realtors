// src/components/CheckoutStripe.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, Shield } from 'lucide-react';
import type { OrderItem } from '../types';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

interface Props {
  cart: OrderItem[];
  calculateTotal: () => number;
  onBack: () => void;
}

type CreateSessionResponse = { id: string };

const CheckoutStripe: React.FC<Props> = ({ cart, calculateTotal, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load — check VITE_STRIPE_PUBLISHABLE_KEY');

      // Minimal payload; your server will verify
      const items = cart.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity) || 1,
        unit_amount: Math.round(Number(item.price) * 100), // cents
        description: item.customization
          ? `${item.customization.designs || 1} custom design(s)`
          : 'Custom coffee product',
      }));

      const payload = {
        items,
        metadata: {
          orderType: 'realtor-coffee-order',
          designs:
            cart.find((it) => it.customization?.designs)?.customization?.designs?.toString() ?? '1',
          total_cents: Math.round(calculateTotal() * 100).toString(),
          ts: new Date().toISOString(),
        },
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/`,
      };

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `Failed to create checkout session (${res.status})`;
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {}
        throw new Error(msg);
      }

      const data = (await res.json()) as CreateSessionResponse;
      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) throw new Error(result.error.message || 'Checkout redirect failed');
    } catch (e: any) {
      console.error('Checkout error:', e);
      setError(e?.message ?? 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Secure Checkout</h1>
          <p className="text-lg text-gray-600">Complete your order with our secure payment system</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="font-bold text-green-600">${item.price.toLocaleString()}</span>
                  </div>
                  {item.customization?.designs && (
                    <div className="text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {item.customization.designs} design{item.customization.designs > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300 mb-6 text-center">
              <div className="text-lg font-bold text-green-800 mb-1">🚚 Free Shipping Included!</div>
              <div className="text-sm text-green-600">No additional shipping costs • Delivered to your door</div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">${calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Payment Information
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800 font-medium">Payment Error</div>
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3 font-bold text-lg shadow-xl mb-4"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Proceed to Secure Payment
                </>
              )}
            </button>

            <button onClick={onBack} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Back to Cart
            </button>

            <div className="mt-6 text-center text-xs text-gray-500">Powered by Stripe • Trusted by millions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStripe;