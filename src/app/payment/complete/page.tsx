'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentService } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { CheckCircle, XCircle, Loader2, Coins, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type SessionStatus = 'loading' | 'complete' | 'open' | 'expired' | 'error';

function PaymentCompleteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<SessionStatus>('loading');
  const [credits, setCredits] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No session ID found in URL.');
      return;
    }

    paymentService
      .getSessionStatus(sessionId)
      .then(async (data: any) => {
        if (data.status === 'complete') {
          setStatus('complete');
          setCredits(data.credits);
          // Refresh user credits in the auth context
          await refreshUser();
        } else if (data.status === 'open') {
          setStatus('open');
        } else {
          setStatus('expired');
        }
      })
      .catch((err: any) => {
        setStatus('error');
        setErrorMsg(err?.message || 'Failed to verify payment.');
      });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Loading */}
        {status === 'loading' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center animate-pulse">
              <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
            </div>
            <p className="text-slate-400 text-sm">Verifying your payment…</p>
          </div>
        )}

        {/* Success */}
        {status === 'complete' && (
          <div className="glass p-8 rounded-2xl text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Payment Successful!</h1>
              <p className="text-slate-400 text-sm mt-2">
                Your credits have been added to your wallet.
              </p>
            </div>
            {credits !== null && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex items-center justify-center gap-3">
                <Coins className="h-6 w-6 text-indigo-400" />
                <div className="text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">New Balance</p>
                  <p className="text-2xl font-extrabold text-white">{credits.toLocaleString()} Credits</p>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link
                href="/campaigns"
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20"
              >
                Browse Campaigns <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/supporter"
                className="w-full py-3 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-semibold rounded-xl transition text-sm"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Payment open / incomplete */}
        {status === 'open' && (
          <div className="glass p-8 rounded-2xl text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Payment Incomplete</h1>
              <p className="text-slate-400 text-sm mt-2">
                Your payment was not completed. You can try again.
              </p>
            </div>
            <Link
              href="/dashboard/supporter"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
            >
              Try Again
            </Link>
          </div>
        )}

        {/* Expired / Error */}
        {(status === 'expired' || status === 'error') && (
          <div className="glass p-8 rounded-2xl text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Something Went Wrong</h1>
              <p className="text-slate-400 text-sm mt-2">
                {errorMsg || 'The session has expired or the payment failed.'}
              </p>
            </div>
            <Link
              href="/dashboard/supporter"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
        </div>
      }
    >
      <PaymentCompleteContent />
    </Suspense>
  );
}
