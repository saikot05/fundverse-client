'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService, contributionService, reportService } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import {
  Coins,
  Calendar,
  User as UserIcon,
  AlertTriangle,
  Heart,
  ArrowLeft,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function CampaignDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Pledge & Report States
  const [pledgeAmount, setPledgeAmount] = useState<number>(10);
  const [reportReason, setReportReason] = useState<string>('');
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch campaign details
  const { data: campaignData, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign-details', id],
    queryFn: () => campaignService.getById(id),
    enabled: !!id,
  });

  // Fetch campaign contributions
  const { data: contributionsData, isLoading: contributionsLoading } = useQuery({
    queryKey: ['campaign-contributions', id],
    queryFn: () => contributionService.getByCampaign(id),
    enabled: !!id,
  });

  // Pledge mutation
  const pledgeMutation = useMutation({
    mutationFn: (amount: number) => contributionService.create(id, amount),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['campaign-details', id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-contributions', id] });
      await refreshUser();
      setNotif({ type: 'success', message: `Thank you! You successfully pledged ${pledgeAmount} credits.` });
      setPledgeAmount(10);
    },
    onError: (err: any) => {
      setNotif({ type: 'error', message: err.response?.data?.message || 'Pledge transaction failed.' });
    },
  });

  // Report mutation
  const reportMutation = useMutation({
    mutationFn: (reason: string) => reportService.create(id, reason),
    onSuccess: () => {
      setReportModalOpen(false);
      setReportReason('');
      setNotif({ type: 'success', message: 'Campaign has been flagged. Admins will review it shortly.' });
    },
    onError: (err: any) => {
      setNotif({ type: 'error', message: err.response?.data?.message || 'Failed to submit report.' });
    },
  });

  if (campaignLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 p-6">
        <div className="spinner" />
      </div>
    );
  }

  const campaign = campaignData?.campaign;
  if (!campaign) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 p-6">
        <div className="text-center">
          <p className="text-slate-400">Campaign not found.</p>
          <Link href="/campaigns" className="text-indigo-400 hover:underline text-sm mt-2 block">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const contributions = contributionsData?.contributions || [];
  const percent = Math.min(Math.round((campaign.currentAmount / campaign.targetAmount) * 100), 100);
  const isExpired = new Date() > new Date(campaign.deadline);

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (pledgeAmount <= 0) {
      alert('Pledge must be greater than zero.');
      return;
    }

    if (user.credits < pledgeAmount) {
      setNotif({ type: 'error', message: 'Insufficient credits! Top up your wallet in the dashboard.' });
      return;
    }

    setNotif(null);
    pledgeMutation.mutate(pledgeAmount);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!reportReason.trim()) return;
    reportMutation.mutate(reportReason);
  };

  return (
    <div className="flex-grow bg-slate-950 p-6 sm:p-10 text-white max-w-7xl mx-auto w-full">
      {/* Back link */}
      <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-8 transition">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Campaigns</span>
      </Link>

      {notif && (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg mb-6 border ${
            notif.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          <span>{notif.message}</span>
          <button onClick={() => setNotif(null)} className="text-xs opacity-50 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Main details (spans 2) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-[320px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img src={campaign.image} alt={campaign.title} className="h-full w-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs font-bold uppercase bg-indigo-500 text-white px-3 py-1 rounded-full tracking-wider shadow">
                {campaign.category}
              </span>
              <span
                className={`text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider shadow ${
                  campaign.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {campaign.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{campaign.title}</h1>
            <p className="text-sm font-semibold text-indigo-400">{campaign.shortDescription}</p>
            <div className="border-t border-white/5 pt-4 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {campaign.description}
            </div>
          </div>

          {/* Contributors List */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-400" />
              <span>Backers ({contributions.length})</span>
            </h2>

            {contributionsLoading ? (
              <div className="h-10 bg-slate-900 animate-pulse rounded-xl" />
            ) : contributions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Be the first to back this campaign!</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {contributions.map((c: any) => (
                  <div key={c._id} className="flex items-center justify-between p-3 bg-slate-950 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      {c.supporterId?.image ? (
                        <img src={c.supporterId.image} alt={c.supporterId.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                          {c.supporterId?.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{c.supporterId?.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Pledged on {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">+{c.amount} Credits</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Widget/Pledge sidebar (spans 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pledged Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{campaign.currentAmount}</span>
                <span className="text-xs text-slate-400">of {campaign.targetAmount} credits</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs text-indigo-300 font-semibold">{percent}% Funded</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-t border-b border-white/5 py-4">
              <div>
                <span className="block text-slate-500">Deadline</span>
                <span className="font-semibold text-slate-200 mt-0.5 block flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                </span>
              </div>
              <div>
                <span className="block text-slate-500">Status</span>
                <span className="font-bold text-emerald-400 uppercase tracking-wider mt-0.5 block">
                  {campaign.status}
                </span>
              </div>
            </div>

            {/* Creator Card details */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campaign Creator</p>
              <div className="flex items-center gap-3 p-3 bg-slate-950 border border-white/5 rounded-xl">
                {campaign.creatorId?.image ? (
                  <img src={campaign.creatorId.image} alt={campaign.creatorId.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-violet-500 flex items-center justify-center font-bold text-xs">
                    {campaign.creatorId?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-200">{campaign.creatorId?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{campaign.creatorId?.email}</p>
                </div>
              </div>
            </div>

            {/* Pledge inputs */}
            {campaign.status === 'active' && !isExpired ? (
              <form onSubmit={handlePledgeSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Enter Pledge Credits
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                      <Coins className="h-4 w-4 text-amber-400" />
                    </span>
                    <input
                      type="number"
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      min={1}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  {user && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Wallet: {user.credits} credits available
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pledgeMutation.isPending}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition"
                >
                  {user ? (pledgeMutation.isPending ? 'Processing...' : 'Back this project') : 'Sign in to pledge'}
                </button>
              </form>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3.5 rounded-xl flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Contributions are closed for this campaign.</span>
              </div>
            )}

            {/* Report Button */}
            {user && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="w-full py-2 bg-transparent hover:bg-rose-500/10 border border-dashed border-rose-500/25 hover:border-rose-500 text-rose-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Report this campaign</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              <span>Report Campaign</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Please specify the reason you believe this campaign violates terms (e.g. fraudulent, intellectual property, misleading goal).
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe your reasoning in detail..."
                rows={4}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex gap-3 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 py-2 text-xs text-slate-400 border border-white/10 rounded-xl hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportMutation.isPending}
                  className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl"
                >
                  {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
