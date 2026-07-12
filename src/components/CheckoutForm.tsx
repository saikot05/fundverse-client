'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentService } from '../lib/api';
import { CreditCard, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface CheckoutFormProps {
  amount: number;
  onSuccess: (credits: number) => void;
  onCancel: () => void;
}

export default function CheckoutForm({ amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<'stripe' | 'mock'>('mock');

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setError(null);
    setLoading(true);

    try {
      // 1. Create payment intent
      const { clientSecret, paymentIntentId } = await paymentService.createPaymentIntent(amount);

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card input element not found.');
        setLoading(false);
        return;
      }

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Stripe transaction failed.');
        setLoading(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // 3. Verify payment with backend
        const res = await paymentService.verifyPayment(paymentIntentId);
        setSuccessMsg('Payment processed successfully via Stripe!');
        setTimeout(() => {
          onSuccess(res.credits);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Payment confirmation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create and instantly verify mock payment
      const { paymentIntentId } = await paymentService.createPaymentIntent(amount);
      
      // Simulate success on server via custom verify
      const res = await paymentService.verifyPayment(paymentIntentId);
      setSuccessMsg(`Mock Payment succeeded! Recieved ${amount} credits.`);
      setTimeout(() => {
        onSuccess(res.credits);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mock transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl max-w-md w-full relative">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <span>Purchase Credits</span>
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        You are purchasing <strong className="text-white">{amount} credits</strong> for{' '}
        <strong className="text-white">${amount}.00 USD</strong>.
      </p>

      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6">
        <button
          onClick={() => setMethod('mock')}
          className={`flex-1 pb-2 text-sm font-semibold transition ${
            method === 'mock' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Mock Checkout (Fast Test)
        </button>
        <button
          onClick={() => setMethod('stripe')}
          className={`flex-1 pb-2 text-sm font-semibold transition ${
            method === 'stripe' ? 'border-b-2 border-indigo-500 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Stripe Payment
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg mb-4">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {method === 'stripe' ? (
        <form onSubmit={handleStripeSubmit} className="space-y-6">
          <div className="bg-slate-950 p-4 border border-white/10 rounded-xl">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '14px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#64748b',
                    },
                  },
                  invalid: {
                    color: '#f43f5e',
                  },
                },
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !stripe}
              className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/10"
            >
              <CreditCard className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Pay with Stripe'}</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMockSubmit} className="space-y-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            For rapid evaluation of the contribution and role workflow, click below to bypass real payment confirmation. The system will instantly reward {amount} credits to your account.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Instant Checkout'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
