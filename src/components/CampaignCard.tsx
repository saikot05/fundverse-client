import React from 'react';
import Link from 'next/link';
import { Card, Chip } from '@heroui/react';
import { Campaign } from '../types';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatCredits, getDaysRemaining } from '../lib/helpers';

interface CampaignCardProps {
  campaign: Campaign;
}

const statusConfig: Record<string, { label: string; styles: string }> = {
  active: { label: 'Active', styles: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' },
  completed: { label: 'Completed', styles: 'bg-violet-500/10 border border-violet-500/20 text-violet-400' },
  pending: { label: 'Pending', styles: 'bg-amber-500/10 border border-amber-500/20 text-amber-400' },
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percent = Math.min(
    Math.round((campaign.currentAmount / campaign.targetAmount) * 100),
    100
  );
  
  const daysRemaining = getDaysRemaining(campaign.deadline);
  const isExpired = daysRemaining <= 0;
  const statusInfo = statusConfig[campaign.status] || { label: campaign.status, styles: 'bg-slate-800 border border-slate-700 text-slate-400' };

  return (
    <Card className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 hover:border-violet-500/30 shadow-lg hover:shadow-violet-500/5 transition-all duration-500 h-full flex flex-col group overflow-hidden rounded-2xl">
      {/* Banner Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
        
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Chip size="sm" className="bg-slate-950/90 backdrop-blur-md border border-white/10 text-slate-200 font-semibold px-2.5 py-0.5 text-[10px] rounded-lg">
            {campaign.category}
          </Chip>
          <Chip size="sm" className={`${statusInfo.styles} font-semibold px-2.5 py-0.5 text-[10px] rounded-lg`}>
            {statusInfo.label}
          </Chip>
        </div>
      </div>

      {/* Card Content */}
      <Card.Content className="p-5 flex-1 flex flex-col gap-4 bg-transparent">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors line-clamp-1">
            {campaign.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-1.5">
            {campaign.shortDescription}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mt-auto space-y-2">
          <div className="flex justify-between items-end text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">Pledged</span>
              <span className="text-slate-700 dark:text-slate-200">
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold">{formatCredits(campaign.currentAmount)}</strong>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal"> of {formatCredits(campaign.targetAmount)}</span>
              </span>
            </span>
            <span className="text-violet-600 dark:text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded text-[10px]">
              {percent}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/60 h-2 rounded-full overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </Card.Content>

      {/* Card Footer */}
      <Card.Footer className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          {isExpired ? 'Campaign Ended' : `${daysRemaining} Days Left`}
        </span>
        <Link
          href={`/campaigns/${campaign._id}`}
          className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-bold transition duration-300"
        >
          View details 
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </Card.Footer>
    </Card>
  );
}
