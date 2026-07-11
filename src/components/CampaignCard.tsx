import React from 'react';
import Link from 'next/link';
import { Campaign } from '../types';
import { Coins, Calendar, ArrowRight } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percent = Math.min(Math.round((campaign.currentAmount / campaign.targetAmount) * 100), 100);
  const isExpired = new Date() > new Date(campaign.deadline);

  return (
    <div className="glass hover:border-indigo-500/30 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-white/5">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-full tracking-wider shadow">
            {campaign.category}
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow ${
              campaign.status === 'active'
                ? 'bg-emerald-500 text-white'
                : campaign.status === 'completed'
                ? 'bg-indigo-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {campaign.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {campaign.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{campaign.shortDescription}</p>
        </div>

        {/* Progress */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              <strong className="text-white">{campaign.currentAmount}</strong> / {campaign.targetAmount}
            </span>
            <span>{percent}%</span>
          </div>

          {/* Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Date & Action */}
          <div className="flex items-center justify-between pt-3 text-[11px] text-slate-500 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>
                {isExpired ? 'Ended' : `Ends ${new Date(campaign.deadline).toLocaleDateString()}`}
              </span>
            </span>

            <Link
              href={`/campaigns/${campaign._id}`}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition"
            >
              <span>View details</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
