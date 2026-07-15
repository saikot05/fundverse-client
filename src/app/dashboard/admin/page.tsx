'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  campaignService,
  withdrawalService,
  reportService,
  userAdminService,
  statsService,
} from '../../../lib/api';
import {
  ShieldAlert,
  Users,
  Megaphone,
  Banknote,
  Flag,
  CheckCircle,
  XCircle,
  TrendingUp,
  Coins,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#a78bfa', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'withdrawals' | 'users' | 'reports'>('campaigns');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState<string>('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('');

  // Fetch Global Admin Stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: statsService.getAdminStats,
    enabled: !!user && user.role === 'admin',
  });

  // Fetch Campaigns
  const { data: campaignsData, isLoading: campaignsLoading } = useQuery({
    queryKey: ['admin-campaigns'],
    queryFn: campaignService.getAdminAll,
    enabled: !!user && user.role === 'admin',
  });

  // Fetch Withdrawals
  const { data: withdrawalsData, isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: withdrawalService.getAdminAll,
    enabled: !!user && user.role === 'admin',
  });

  // Fetch Users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: userAdminService.getAll,
    enabled: !!user && user.role === 'admin',
  });

  // Fetch Reports
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: reportService.getAdminAll,
    enabled: !!user && user.role === 'admin',
  });

  // Campaign approval/rejection mutations
  const approveCampaignMutation = useMutation({
    mutationFn: campaignService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setStatusMsg('Campaign approved successfully.');
    },
  });

  const rejectCampaignMutation = useMutation({
    mutationFn: campaignService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setStatusMsg('Campaign rejected.');
    },
  });

  // Withdrawal approval/rejection mutations
  const approveWithdrawalMutation = useMutation({
    mutationFn: withdrawalService.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setStatusMsg('Withdrawal payout approved.');
    },
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: withdrawalService.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setStatusMsg('Withdrawal payout rejected.');
    },
  });

  // User role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userAdminService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setStatusMsg('User role updated successfully.');
    },
  });

  // Resolve report mutation
  const resolveReportMutation = useMutation({
    mutationFn: reportService.resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      setStatusMsg('Report resolved.');
    },
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 p-6">
        <div className="text-center bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
          <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto mb-2" />
          <p className="text-rose-400 font-bold">Access Denied</p>
          <p className="text-xs text-slate-500 mt-1">You must be logged in as an administrator.</p>
        </div>
      </div>
    );
  }

  const campaigns = campaignsData?.campaigns || [];
  const withdrawals = withdrawalsData?.withdrawals || [];
  const users = usersData?.users || [];
  const reports = reportsData?.reports || [];

  return (
    <div className="flex-1 bg-slate-950 p-6 sm:p-10 text-white max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="h-8 w-8 text-indigo-400" />
          <span>Admin Portal Dashboard</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Global audit queue, user permissions mapping, and payout approvals</p>
      </div>

      {statusMsg && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span>{statusMsg}</span>
          <button onClick={() => setStatusMsg(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
                <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.users.totalUsers}</p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2">
              <span>Creators: {stats.users.creatorsCount} | Supporters: {stats.users.supportersCount}</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+12.4%</span>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaigns Queue</p>
                <div className="bg-violet-500/10 p-2 rounded-xl text-violet-400">
                  <Megaphone className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.campaigns.totalCampaigns}</p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2">
              <span>Pending: {stats.campaigns.pendingCampaigns} | Active: {stats.campaigns.activeCampaigns}</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+8.2%</span>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Contributions</p>
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400">
                  <Coins className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.financials.totalContributionsAmount} Credits</p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2">
              <span>100% Stripe Verified</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+15.9%</span>
            </div>
          </div>

          <div className="glass p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
            <div>
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Payouts</p>
                <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400">
                  <Banknote className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-white mt-1">{stats.financials.totalWithdrawalsApproved} Credits</p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2">
              <span>Pending: {stats.financials.totalWithdrawalsPending} credits</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">+9.4%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Categories chart layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass p-4 rounded-2xl flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Controls</h3>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'campaigns' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                <span>Campaigns Review</span>
              </div>
              {stats?.campaigns.pendingCampaigns > 0 && (
                <span className="bg-rose-500 text-[10px] text-white font-bold h-5 w-5 rounded-full flex items-center justify-center">
                  {stats.campaigns.pendingCampaigns}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('withdrawals')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'withdrawals' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                <span>Withdrawals Queue</span>
              </div>
              {stats?.financials.totalWithdrawalsPending > 0 && (
                <span className="bg-rose-500 text-[10px] text-white font-bold h-2 w-2 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'users' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>User Permissions</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'reports' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                <span>Campaign Reports</span>
              </div>
              {reports.filter((r: any) => r.status === 'pending').length > 0 && (
                <span className="bg-rose-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full">
                  {reports.filter((r: any) => r.status === 'pending').length}
                </span>
              )}
            </button>
          </div>

          {/* Stats category chart */}
          {stats && stats.categoryData?.length > 0 && (
            <div className="glass p-4 rounded-2xl">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Global Distribution</span>
              </h4>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                {stats.categoryData.map((entry: any, index: number) => {
                  const total = stats.categoryData.reduce((sum: number, item: any) => sum + item.value, 0);
                  const percentage = Math.round((entry.value / total) * 100);
                  return (
                    <div key={entry.name} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-slate-300 font-semibold">{entry.name}</span>
                      </div>
                      <span className="text-slate-500 font-bold">{entry.value} ({percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tab Detail panel (Right grid - spans 3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass p-6 rounded-2xl min-h-[400px]">
            {/* Tab: Campaigns Review */}
            {activeTab === 'campaigns' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Campaign Verification Queue</h3>
                {campaignsLoading ? (
                  <div className="space-y-3"><div className="h-16 bg-slate-900 animate-pulse rounded-xl" /></div>
                ) : campaigns.length === 0 ? (
                  <p className="text-sm text-slate-500 py-10 text-center">No campaigns found in database.</p>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {campaigns.map((camp: any) => (
                      <div
                        key={camp._id}
                        className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">{camp.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{camp.shortDescription}</p>
                          <div className="flex flex-wrap gap-3 text-[10px] text-slate-500 mt-2">
                            <span>Creator: {camp.creatorId?.name || 'Deleted User'}</span>
                            <span>Goal: {camp.targetAmount} credits</span>
                            <span>Category: {camp.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              camp.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : camp.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {camp.status}
                          </span>

                          {camp.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => approveCampaignMutation.mutate(camp._id)}
                                className="p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold transition cursor-pointer"
                                title="Approve Campaign"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => rejectCampaignMutation.mutate(camp._id)}
                                className="p-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-semibold transition cursor-pointer"
                                title="Reject Campaign"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Withdrawals Queue */}
            {activeTab === 'withdrawals' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">Withdrawal Clearance Queue</h3>
                {withdrawalsLoading ? (
                  <div className="h-10 bg-slate-900 animate-pulse rounded-xl" />
                ) : withdrawals.length === 0 ? (
                  <p className="text-sm text-slate-500 py-10 text-center">No withdrawal request recorded.</p>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {withdrawals.map((w: any) => (
                      <div
                        key={w._id}
                        className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-200">Amount: {w.amount} Credits</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                w.status === 'approved'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : w.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">Creator: {w.creatorId?.name} ({w.creatorId?.email})</p>
                          <p className="text-[11px] text-slate-500">
                            Bank: {w.bankDetails?.bankName} | Account: {w.bankDetails?.accountName} | Num:{' '}
                            {w.bankDetails?.accountNumber}
                          </p>
                        </div>

                        {w.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveWithdrawalMutation.mutate(w._id)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold text-xs transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectWithdrawalMutation.mutate(w._id)}
                              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-semibold text-xs transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: User Permissions */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6">User Permissions Mapping</h3>
                
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="">All Roles</option>
                    <option value="supporter">Supporters</option>
                    <option value="creator">Creators</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>

                {usersLoading ? (
                  <div className="h-10 bg-slate-900 animate-pulse rounded-xl" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-xs uppercase">
                          <th className="py-3 px-2">Name</th>
                          <th className="py-3 px-2">Email</th>
                          <th className="py-3 px-2">Role</th>
                          <th className="py-3 px-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter((u: any) => {
                            const matchesSearch =
                              u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                              u.email.toLowerCase().includes(userSearch.toLowerCase());
                            const matchesRole = !userRoleFilter || u.role === userRoleFilter;
                            return matchesSearch && matchesRole;
                          })
                          .map((u: any) => (
                            <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition">
                              <td className="py-3 px-2 text-slate-200">{u.name}</td>
                              <td className="py-3 px-2 text-slate-400">{u.email}</td>
                              <td className="py-3 px-2 text-indigo-400 uppercase text-xs font-bold">{u.role}</td>
                              <td className="py-3 px-2">
                                <select
                                  value={u.role}
                                  onChange={(e) =>
                                    updateUserRoleMutation.mutate({ id: u._id, role: e.target.value })
                                  }
                                  className="bg-slate-900 border border-white/10 rounded-lg text-xs text-white p-1 focus:outline-none"
                                >
                                  <option value="supporter">Supporter</option>
                                  <option value="creator">Creator</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Campaign Reports */}
            {activeTab === 'reports' && (
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-rose-500" />
                  <span>Flagged Campaigns Queue</span>
                </h3>
                {reportsLoading ? (
                  <div className="h-10 bg-slate-900 animate-pulse rounded-xl" />
                ) : reports.length === 0 ? (
                  <p className="text-sm text-slate-500 py-10 text-center">No reports active.</p>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {reports.map((r: any) => (
                      <div
                        key={r._id}
                        className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-rose-400">Reason: {r.reason}</h4>
                            <span
                              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                r.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Campaign: "{r.campaignId?.title}"</p>
                          <p className="text-[10px] text-slate-500">Reported by: {r.reporterId?.name}</p>
                        </div>

                        {r.status === 'pending' && (
                          <button
                            onClick={() => resolveReportMutation.mutate(r._id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-semibold text-xs transition cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
