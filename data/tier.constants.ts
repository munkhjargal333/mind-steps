import type { Tier } from './constants';

export type { Tier };

export const TIER_LABELS: Record<Tier, string> = {
  free: 'Үнэгүй',
  pro: 'Pro',
};

export const TIER_COLORS: Record<Tier, string> = {
  free: 'text-muted-foreground',
  pro: 'text-amber-600 dark:text-amber-400',
};
