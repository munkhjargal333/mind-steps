// ─────────────────────────────────────────────────────────────────────────────
// components/atoms/TierPill.tsx
// ATOM — Displays the user's subscription tier as a colored pill badge.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/lib/utils';
import type { Tier } from '@/types';

export interface TierPillProps {
  tier: Tier;
  className?: string;
}

const TIER_STYLES: Record<Tier, { label: string; dot: string; classes: string }> = {
  demo: {
    label: 'Demo',
    dot: '🔵',
    classes:
      'bg-tier-demo/15 text-tier-demo',
  },
  free: {
    label: 'Үнэгүй',
    dot: '🟢',
    classes:
      'bg-primary/15 text-primary',
  },
  pro: {
    label: 'Pro',
    dot: '🟣',
    classes:
      'bg-accent/15 text-accent',
  },
};

export function TierPill({ tier, className }: TierPillProps) {
  const { label, dot, classes } = TIER_STYLES[tier];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'text-[10px] font-bold uppercase tracking-wider',
        classes,
        className
      )}
    >
      <span>{dot}</span>
      {label} план
    </span>
  );
}
