// shared/components/TierDisplay.tsx
// ─────────────────────────────────────────────────────────────────────────────
// TierBadge (shared/components) + TierPill (journal/TierPill.module.css)
// хоёрыг нэгтгэсэн нэг component.
//
// ХУУЧИН хэрэглээ:
//   <TierBadge tier="pro" />          → Tailwind className ашиглаж байсан
//   <TierPill  tier="pro" />          → CSS module ашиглаж байсан
//
// ШИНЭ хэрэглээ:
//   <TierDisplay tier="pro" />            → default (badge, rounded-full)
//   <TierDisplay tier="pro" variant="pill" /> → emoji dot + label (хуучин TierPill)
//   <TierDisplay tier="free" variant="badge" size="lg" />
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';
import type { Tier } from '@/shared/constants';

interface TierDisplayProps {
  tier: Tier;
  /** "badge" (default) = star icon variant; "pill" = dot emoji variant */
  variant?: 'badge' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TIER_CONFIG = {
  pro: {
    // badge variant
    badgeBg:    'bg-violet-100 dark:bg-violet-900/40',
    badgeText:  'text-violet-700 dark:text-violet-300',
    // pill variant
    pillBg:     'bg-violet-100 dark:bg-violet-900/30',
    pillText:   'text-violet-700 dark:text-violet-400',
    dot:        '🟣',
    label:      'Pro',
  },
  free: {
    badgeBg:    'bg-gray-100 dark:bg-gray-800',
    badgeText:  'text-gray-600 dark:text-gray-400',
    pillBg:     'bg-green-50 dark:bg-green-950/30',
    pillText:   'text-green-700 dark:text-green-400',
    dot:        '🟢',
    label:      'Үнэгүй',
  },
  demo: {
    badgeBg:    'bg-orange-100 dark:bg-orange-900/30',
    badgeText:  'text-orange-700 dark:text-orange-300',
    pillBg:     'bg-orange-50 dark:bg-orange-950/20',
    pillText:   'text-orange-700 dark:text-orange-400',
    dot:        '🟠',
    label:      'Demo',
  },
} satisfies Record<Tier, {
  badgeBg: string; badgeText: string;
  pillBg: string;  pillText: string;
  dot: string;     label: string;
}>;

const SIZE = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-0.5 text-xs gap-1',
  lg: 'px-3 py-1 text-sm gap-1.5',
} as const;

const STAR_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-3 h-3 shrink-0"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

export function TierDisplay({
  tier,
  variant = 'badge',
  size = 'sm',
  className,
}: TierDisplayProps) {
  const cfg = TIER_CONFIG[tier];

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full font-semibold',
          SIZE[size],
          cfg.pillBg,
          cfg.pillText,
          className,
        )}
      >
        <span className="text-[10px] leading-none">{cfg.dot}</span>
        {cfg.label}
      </span>
    );
  }

  // badge (default)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        SIZE[size],
        cfg.badgeBg,
        cfg.badgeText,
        className,
      )}
    >
      {tier === 'pro' && STAR_ICON}
      {cfg.label}
    </span>
  );
}