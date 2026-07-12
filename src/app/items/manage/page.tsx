'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';

import {
  Sparkles,
  Plus,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  Coins,
  Megaphone,
} from 'lucide-react';

export default function ItemsManagePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [notif, setNotif] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Protect page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch creator's campaigns
  const { data, isLoading } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: campaignService.getMyCampaigns,
    enabled: !!user,
  });

  const campaigns = data?.campaigns || [];

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: campaignService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      setNotif({ type: 'success', text: 'Campaign item deleted successfully.' });
    },
    onError: (err: any) => {
      setNotif({ type: 'error', text: err.response?.data?.message || 'Failed to delete campaign.' });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign item?')) {
      deleteCampaignMutation.mutate(id);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-grow p-6 sm:p-10 text-slate-800 dark:text-slate-200 max-w-7xl mx-auto w-full transition-colors duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Megaphone className="h-7 w-7 text-indigo-500" />
            <span>Manage Campaign Items</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View, track, or delete campaign items you have submitted to the platform.
          </p>
        </div>
        <Link
          href="/items/add"
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </Link>
      </div>

      {notif && (
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg mb-6 border ${
            notif.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}
        >
          <span className="text-xs font-medium">{notif.text}</span>
          <button onClick={() => setNotif(null)} className="text-xs opacity-50 hover:opacity-100 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main campaigns display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
          <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">You haven't submitted any campaign items yet.</p>
          <Link href="/items/add" className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold hover:underline mt-2 inline-block">
            Create your first item now
          </Link>
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                  <th className="p-4 pl-6">Campaign Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Funding Target</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-300">
                {campaigns.map((camp: any) => (
                  <tr key={camp._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img src={camp.image} alt={camp.title} className="h-10 w-16 object-cover rounded-lg border border-slate-200 dark:border-white/5" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{camp.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{camp.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                        {camp.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                        <Coins className="h-3.5 w-3.5 text-amber-500" />
                        <span>{camp.currentAmount} / {camp.targetAmount}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          camp.status === 'active'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : camp.status === 'pending'
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(camp.deadline).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/campaigns/${camp._id}`}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(camp._id)}
                          className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition"
                          title="Delete Campaign"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
