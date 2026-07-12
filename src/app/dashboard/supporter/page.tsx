'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService, contributionService } from '../../../lib/api';
import CheckoutForm from '../../../components/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  Coins,
  ArrowUpRight,
  History,
  CreditCard,
  PlusCircle,
  PiggyBank,
  Heart,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Pabcdefghijklmnopqrstuvwxyz123456789'
);

export default function SupporterDashboard() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBuyAmount, setSelectedBuyAmount] = useState<number | null>(null);

  // Fetch Payment History
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments-history'],
    queryFn: paymentService.getHistory,
    enabled: !!user,
  });

  // Fetch Contribution History
  const { data: contributionsData, isLoading: contributionsLoading } = useQuery({
    queryKey: ['contributions-history'],
    queryFn: contributionService.getMyContributions,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-6">
        <div className="text-center">
          <p className="text-slate-400">Please sign in to access your dashboard.</p>
          <Link href="/login" className="mt-4 inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = async () => {
    setSelectedBuyAmount(null);
    await refreshUser();
    queryClient.invalidateQueries({ queryKey: ['payments-history'] });
  };

  const payments = paymentsData?.payments || [];
  const contributions = contributionsData?.contributions || [];

  const totalDonated = contributions.reduce((acc: number, c: any) => acc + c.amount, 0);

  return (
    <div className="flex-1 bg-slate-950 p-6 sm:p-10 text-white max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Supporter Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your wallet credits and backed crowdfunding projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/campaigns"
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <span>Explore Campaigns</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wallet Balance */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Coins className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credit Balance</p>
          <p className="text-3xl font-extrabold text-white mt-3">{user.credits} Credits</p>
          <p className="text-xs text-slate-500 mt-1">1 Credit = $1.00 USD</p>
        </div>

        {/* Total Contributed */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 text-violet-400">
            <PiggyBank className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Contributed</p>
          <p className="text-3xl font-extrabold text-white mt-3">{totalDonated} Credits</p>
          <p className="text-xs text-slate-500 mt-1">Invested in creative ideas</p>
        </div>

        {/* Backed Projects Count */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Heart className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaigns Backed</p>
          <p className="text-3xl font-extrabold text-white mt-3">{contributions.length} Campaigns</p>
          <p className="text-xs text-slate-500 mt-1">Active backing initiatives</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Purchase Wallet Credits */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-indigo-400" />
              <span>Purchase Credits</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Choose an amount to top up your wallet. Backers use credits to support creative campaigns.
            </p>

            {selectedBuyAmount === null ? (
              <div className="grid grid-cols-2 gap-3">
                {[10, 25, 50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedBuyAmount(amt)}
                    className="py-3 px-4 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-indigo-500/10 hover:border-indigo-500 text-slate-200 hover:text-white font-semibold transition flex flex-col items-center justify-center cursor-pointer"
                  >
                    <span className="text-lg">${amt}</span>
                    <span className="text-[10px] text-slate-500">{amt} Credits</span>
                  </button>
                ))}
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={selectedBuyAmount}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setSelectedBuyAmount(null)}
                />
              </Elements>
            )}
          </div>
        </div>

        {/* Right Side: Tab Feeds */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contributions Feed */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-indigo-400" />
              <span>My Contributions</span>
            </h2>

            {contributionsLoading ? (
              <div className="space-y-3">
                <div className="h-16 bg-slate-900 animate-pulse rounded-xl" />
                <div className="h-16 bg-slate-900 animate-pulse rounded-xl" />
              </div>
            ) : contributions.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/20 border border-dashed border-white/5 rounded-xl">
                <Heart className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500">You haven't contributed to any campaigns yet.</p>
                <Link href="/campaigns" className="text-xs text-indigo-400 hover:underline mt-1 inline-block">
                  Browse Active Campaigns
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {contributions.map((c: any) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between p-3.5 bg-slate-900/50 border border-white/5 rounded-xl hover:border-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      {c.campaignId?.image ? (
                        <img
                          src={c.campaignId.image}
                          alt={c.campaignId.title}
                          className="h-10 w-10 rounded-lg object-cover border border-white/10"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center font-bold text-xs text-indigo-400">
                          FV
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-200 truncate max-w-xs">
                          {c.campaignId?.title || 'Unknown Campaign'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Category: {c.campaignId?.category} | Contributed on{' '}
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-400">+{c.amount} Credits</p>
                      <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-wider">
                        {c.campaignId?.status || 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments Topups Feed */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" />
              <span>Top-up Transactions</span>
            </h2>

            {paymentsLoading ? (
              <div className="space-y-3">
                <div className="h-16 bg-slate-900 animate-pulse rounded-xl" />
                <div className="h-16 bg-slate-900 animate-pulse rounded-xl" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No transactions recorded.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {payments.map((p: any) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-3.5 bg-slate-900/50 border border-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300 font-mono">
                          ID: {p.stripePaymentIntentId.slice(0, 15)}...
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Purchased on {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">+${p.amount}.00</p>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider ${
                          p.status === 'succeeded' ? 'text-emerald-500' : 'text-amber-500'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
