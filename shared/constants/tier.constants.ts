// shared/constants/tier.constants.ts
// Tier labels and permissions constants

import type { Tier } from '@/types';

export const TIER_LABELS: Record<Tier, string> = {
  demo: 'Demo',
  free: 'Үнэгүй',
  pro: 'Pro',
};

export const TIER_PERMISSIONS: Record<Tier, string[]> = {
  demo: ['view_insights'],
  free: ['view_insights', 'view_emotions', 'view_graph'],
  pro: ['view_insights', 'view_emotions', 'view_graph', 'deep_analysis', 'unlimited_entries'],
};
