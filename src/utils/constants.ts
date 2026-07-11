export const CAMPAIGN_CATEGORIES = [
  'Tech',
  'Creative',
  'Community',
  'Charity',
  'Gaming',
] as const;

export type CampaignCategory = (typeof CAMPAIGN_CATEGORIES)[number];

export const NAV_LINKS = [
  { href: '/campaigns', label: 'Explore Campaigns' },
  { href: '/how-it-works', label: 'How It Works' },
] as const;
