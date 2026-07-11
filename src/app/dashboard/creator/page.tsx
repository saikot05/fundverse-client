'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService, withdrawalService, statsService } from '../../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  Coins,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Trash2,
  Calendar,
  AlertCircle,
  PiggyBank,
  CheckCircle,
  Banknote,
  DollarSign,
  Edit2,
  History,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#6366f1', '#a78bfa', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

export default function CreatorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  // Modal State
  const [withdrawalCampaignId, setWithdrawalCampaignId] = useState<string | null>(null);
  const [withdrawalCampaignTitle, setWithdrawalCampaignTitle] = useState<string>('');
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [withdrawalAvailable, setWithdrawalAvailable] = useState<number>(0);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
  });

  const [notifMsg, setNotifMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch creator stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['creator-stats'],
    queryFn: statsService.getCreatorStats,
    enabled: !!user,
  });

  // Fetch creator's campaigns
  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: campaignService.getMyCampaigns,
    enabled: !!user,
  });

  // Fetch creator's withdrawals
  const { data: withdrawalsData, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['my-withdrawals'],
    queryFn: withdrawalService.getMyWithdrawals,
    enabled: !!user,
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: campaignService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['creator-stats'] });
      setNotifMsg({ type: 'success', text: 'Campaign deleted successfully.' });
    },
  });

  // Request withdrawal mutation
  const requestWithdrawalMutation = useMutation({
    mutationFn: withdrawalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['creator-stats'] });
      setWithdrawalCampaignId(null);
      setBankDetails({ accountName: '', accountNumber: '', bankName: '', routingNumber: '' });
      setWithdrawalAmount(0);
      setNotifMsg({ type: 'success', text: 'Withdrawal requested successfully. Admin review pending.' });
    },
    onError: (err: any) => {
      setNotifMsg({ type: 'error', text: err.response?.data?.message || 'Withdrawal request failed.' });
    },
  });

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-6">
        <p className="text-slate-400">Please log in to access this page.</p>
      </div>
    );
  }

  const campaigns = campaignsData?.campaigns || [];
  const withdrawals = withdrawalsData?.withdrawals || [];

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaignMutation.mutate(id);
    }
  };

  const handleWithdrawalRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalCampaignId) return;

    if (withdrawalAmount <= 0 || withdrawalAmount > withdrawalAvailable) {
      alert('Invalid withdrawal amount.');
      return;
    }

    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
      alert('Please fill out account name, number, and bank name.');
      return;
    }

    requestWithdrawalMutation.mutate({
      campaignId: withdrawalCampaignId,
      amount: withdrawalAmount,
      bankDetails,
    });
  };

  const openWithdrawalModal = (campaign: any) => {
    // Calculate withdrawable remaining balance
    const campaignWithdrawals = withdrawals.filter(
      (w: any) => w.campaignId?._id === campaign._id && w.status !== 'rejected'
    );
    const alreadyWithdrawn = campaignWithdrawals.reduce((sum: number, w: any) => sum + w.amount, 0);
    const available = campaign.currentAmount - alreadyWithdrawn;

    setWithdrawalCampaignId(campaign._id);
    setWithdrawalCampaignTitle(campaign.title);
    setWithdrawalAvailable(available);
    setWithdrawalAmount(available);
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 sm:p-10 text-white max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Creator Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your active fundraising programs and verify payouts</p>
        </div>
        <div>
          <Link
            href="/dashboard/creator/add-campaign"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </Link>
        </div>
      </div>

      {notifMsg && (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg mb-6 border ${
            notifMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            {notifMsg.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{notifMsg.text}</span>
          </div>
          <button onClick={() => setNotifMsg(null)} className="text-xs opacity-50 hover:opacity-100">
            Close
          </button>
        </div>
      )}

      {/* Grid Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
              <Megaphone className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Campaigns</p>
            <p className="text-2xl font-extrabold text-white mt-2">{stats.totalCampaigns}</p>
            <p className="text-[10px] text-slate-500 mt-1">{stats.activeCampaigns} campaigns active</p>
          </div>

          <div className="glass p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-violet-500/10 p-2 rounded-xl text-violet-400">
              <Coins className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Funds Raised</p>
            <p className="text-2xl font-extrabold text-white mt-2">{stats.totalRaised} Credits</p>
            <p className="text-[10px] text-slate-500 mt-1">Goal: {stats.totalGoal} credits</p>
          </div>

          <div className="glass p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Withdrawn</p>
            <p className="text-2xl font-extrabold text-white mt-2">{stats.totalWithdrawn} Credits</p>
            <p className="text-[10px] text-slate-500 mt-1">Approved payouts</p>
          </div>

          <div className="glass p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-500/10 p-2 rounded-xl text-amber-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Payouts</p>
            <p className="text-2xl font-extrabold text-white mt-2">{stats.pendingWithdrawals} Credits</p>
            <p className="text-[10px] text-slate-500 mt-1">Awaiting admin clearance</p>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Campaigns List (Left Col - spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-indigo-400" />
              <span>My Campaigns</span>
            </h2>

            {campaignsLoading ? (
              <div className="space-y-4">
                <div className="h-20 bg-slate-900 animate-pulse rounded-xl" />
                <div className="h-20 bg-slate-900 animate-pulse rounded-xl" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/10 border border-dashed border-white/5 rounded-2xl">
                <p className="text-sm text-slate-500">You haven't created any campaigns yet.</p>
                <Link
                  href="/dashboard/creator/add-campaign"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  <span>Launch your first campaign</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.map((camp: any) => {
                  const percent = Math.min(Math.round((camp.currentAmount / camp.targetAmount) * 100), 100);
                  return (
                    <div
                      key={camp._id}
                      className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={camp.image}
                          alt={camp.title}
                          className="h-16 w-16 rounded-xl object-cover border border-white/10"
                        />
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-slate-200 truncate max-w-[250px]">{camp.title}</h3>
                          <p className="text-[10px] text-slate-500">Category: {camp.category}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                camp.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : camp.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {camp.status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {camp.currentAmount} / {camp.targetAmount} credits ({percent}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Actions */}
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <Link
                          href={`/dashboard/creator/edit-campaign/${camp._id}`}
                          className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition border border-white/5"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCampaign(camp._id)}
                          className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-500/10 rounded-xl transition border border-white/5 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {camp.status === 'active' && camp.currentAmount > 0 && (
                          <button
                            onClick={() => openWithdrawalModal(camp)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
                          >
                            <Banknote className="h-3.5 w-3.5" />
                            <span>Withdraw</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Charts & Analytics (Right Col - spans 1) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <span>Categories</span>
            </h2>

            {stats && stats.categoryData?.length > 0 ? (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-10">No category statistics available.</p>
            )}
          </div>

          {/* Withdrawals List */}
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" />
              <span>Withdrawals History</span>
            </h2>

            {withdrawalsLoading ? (
              <div className="h-10 bg-slate-900 animate-pulse rounded-xl" />
            ) : withdrawals.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No withdrawals requested yet.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {withdrawals.map((w: any) => (
                  <div key={w._id} className="p-3 bg-slate-900/50 border border-white/5 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Amount: {w.amount} Credits</span>
                      <span
                        className={`font-bold uppercase tracking-wider text-[9px] ${
                          w.status === 'approved'
                            ? 'text-emerald-400'
                            : w.status === 'pending'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">Campaign: {w.campaignId?.title}</p>
                    <p className="text-[10px] text-slate-500">
                      Bank: {w.bankDetails?.bankName} ({w.bankDetails?.accountNumber})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {withdrawalCampaignId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Request Campaign Withdrawal</h3>
            <p className="text-xs text-slate-400 mb-4">Campaign: {withdrawalCampaignTitle}</p>

            <form onSubmit={handleWithdrawalRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Amount to Withdraw (max: {withdrawalAvailable} credits)
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(parseFloat(e.target.value) || 0)}
                  max={withdrawalAvailable}
                  min={1}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    placeholder="123456789"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    placeholder="Chase Bank"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Routing Number (Opt)
                  </label>
                  <input
                    type="text"
                    value={bankDetails.routingNumber}
                    onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                    placeholder="987654321"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setWithdrawalCampaignId(null)}
                  className="flex-1 py-2 text-sm text-slate-400 border border-white/10 rounded-xl hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requestWithdrawalMutation.isPending}
                  className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl"
                >
                  {requestWithdrawalMutation.isPending ? 'Requesting...' : 'Request Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
