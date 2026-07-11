import React from 'react';

export const CampaignSkeleton = () => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden p-5 space-y-4 animate-pulse">
      <div className="h-44 bg-slate-800 rounded-xl w-full" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-2.5 bg-slate-800 rounded w-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-slate-800 rounded w-1/4" />
          <div className="h-3 bg-slate-800 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-800 rounded w-1/3" />
        <div className="h-8 bg-slate-800 rounded-xl w-8" />
      </div>
      <div className="h-6 bg-slate-800 rounded w-2/3" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
    </div>
  );
};
