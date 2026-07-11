import React from 'react';
import { Skeleton } from '@heroui/react';

export const CampaignSkeleton = () => {
  return (
    <div className="border border-border rounded-2xl overflow-hidden p-5 space-y-4 bg-surface">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3 rounded-lg" />
        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-5/6 rounded-lg" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-2.5 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/4 rounded-lg" />
          <Skeleton className="h-3 w-1/6 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const StatsSkeleton = () => {
  return (
    <div className="border border-border p-5 rounded-2xl space-y-3 bg-surface">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-1/3 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-6 w-2/3 rounded-lg" />
      <Skeleton className="h-3 w-1/2 rounded-lg" />
    </div>
  );
};
