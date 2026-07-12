'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { paymentService } from '../lib/api';
import { X, Sparkles, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

// ─── Inner Form (must be inside <Elements>) ────────────────────────────────
function PaymentForm({
  credits,
  amount,
  onSuccess,
  onCancel,
}: {
  credits: number;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Validation failed.');
      setLoading(false);
      return;
    }

    try {
      // Create PaymentIntent on server
      const data = await paymentService.createCheckoutSession(amount, credits);

      // Confirm payment client-side
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/complete?session_id=${data.sessionId}`,
        },
        // Don't redirect — handle success inline for better UX
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed.');
      } else {
        // Payment succeeded — verify and award credits
        await paymentService.getSessionStatus(data.sessionId);
        setSuccess(true);
        setTimeout(() => onSuccess(), 1800);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <p className="text-white font-bold text-lg">Payment Successful!</p>
          <p className="text-slate-400 text-sm mt-1">{credits} credits added to your wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !stripe}
          className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing…</span>
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              <span>Pay ${amount}.00</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Modal Wrapper ─────────────────────────────────────────────────────────
interface CheckoutFormProps {
  amount: number;
  credits: number;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function CheckoutForm({
  amount,
  credits,
  onCancel,
  onSuccess,
}: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    paymentService
      .createCheckoutSession(amount, credits)
      .then((data: any) => {
        setClientSecret(data.clientSecret);
        setSessionId(data.sessionId);
      })
      .catch((err: any) => {
        setInitError(err?.message || 'Failed to initialize payment.');
      });
  }, [amount, credits]);

  const handleSuccess = async () => {
    // Award credits via session status check
    if (sessionId) {
      try {
        await paymentService.getSessionStatus(sessionId);
      } catch (_) {}
    }
    onSuccess?.();
    onCancel();
  };

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#0f172a',
      colorText: '#f1f5f9',
      colorDanger: '#f43f5e',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '10px',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Purchase Credits</h3>
              <p className="text-xs text-slate-400">
                {credits} credits &nbsp;·&nbsp;{' '}
                <span className="text-indigo-400 font-medium">${amount}.00 USD</span>
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Init Error */}
          {initError && (
            <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{initError}</span>
            </div>
          )}

          {/* Loading skeleton */}
          {!clientSecret && !initError && (
            <div className="space-y-3 py-2">
              <div className="h-10 bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-28 bg-slate-800 animate-pulse rounded-xl" />
              <div className="h-10 bg-slate-800 animate-pulse rounded-xl" />
            </div>
          )}

          {/* Stripe Payment Element */}
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance }}
            >
              <PaymentForm
                amount={amount}
                credits={credits}
                onSuccess={handleSuccess}
                onCancel={onCancel}
              />
            </Elements>
          )}
        </div>

        {/* Test card hint */}
        <div className="px-6 pb-4">
          <p className="text-[10px] text-slate-600 text-center">
            Test card: <span className="font-mono text-slate-500">4242 4242 4242 4242</span>
            &nbsp;· Any future date · Any CVC
          </p>
        </div>
      </div>
    </div>
  );
}
