import React from 'react';
import Link from 'next/link';
import { Card, Chip } from '@heroui/react';
import { Campaign } from '../types';
import { Coins, Calendar, ArrowRight } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

// HeroUI v3 Chip color API: "default" | "success" | "warning" | "danger" | "accent"
const statusColorMap: Record<string, 'success' | 'accent' | 'warning'> = {
  active: 'success',
  completed: 'accent',
  pending: 'warning',
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percent = Math.min(
    Math.round((campaign.currentAmount / campaign.targetAmount) * 100),
    100
  );
  const isExpired = new Date() > new Date(campaign.deadline);

  return (
    <Card className="border border-border hover:border-accent/40 transition-all duration-300 h-full flex flex-col group">
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Chip size="sm" color="accent" variant="soft">
            {campaign.category}
          </Chip>
          <Chip
            size="sm"
            color={statusColorMap[campaign.status] || 'default'}
            variant="soft"
          >
            {campaign.status}
          </Chip>
        </div>
      </div>

      {/* Content */}
      <Card.Content className="flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-bold group-hover:text-accent transition-colors line-clamp-1">
            {campaign.title}
          </h3>
          <p className="text-xs text-muted line-clamp-2 leading-relaxed mt-1">
            {campaign.shortDescription}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-auto space-y-1">
          <div className="flex justify-between text-xs font-semibold text-muted">
            <span className="flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-warning" />
              <strong className="text-foreground">{campaign.currentAmount}</strong>
              &nbsp;/ {campaign.targetAmount}
            </span>
            <span>{percent}%</span>
          </div>
          {/* Native progress bar styled with Tailwind */}
          <div className="w-full bg-default h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </Card.Content>

      <Card.Footer className="border-t border-separator flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-muted">
          <Calendar className="h-3.5 w-3.5" />
          {isExpired ? 'Ended' : `Ends ${new Date(campaign.deadline).toLocaleDateString()}`}
        </span>
        <Link
          href={`/campaigns/${campaign._id}`}
          className="flex items-center gap-1 text-accent hover:text-accent/80 font-semibold text-[11px] transition"
        >
          View details <ArrowRight className="h-3 w-3" />
        </Link>
      </Card.Footer>
    </Card>
  );
}
