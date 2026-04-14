'use client';

// shared/components/TierBadge.tsx  (refactored)
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES:
//  • Hardcoded bg-violet-100 / text-violet-700 → CSS tokens
//  • Hardcoded bg-gray-100 / text-gray-600     → CSS tokens
//  • Added 'demo' tier variant
//  • React.FC<> removed (not needed in modern React)
//  • cn() utility used for className merging
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';

interface TierBadgeProps {
  tier: 'free' | 'pro' | 'demo';
  className?: string;
}

// ── Per-tier config ───────────────────────────────────────────────────────────

const TIER_CONFIG = {
  pro: {
    label: 'Pro',
    // Token defined in globals.tokens.css
    className: [
      'bg-[color:var(--color-tier-pro-bg,theme(colors.violet.100))]',
      'text-[color:var(--color-tier-pro-text,theme(colors.violet.700))]',
    ],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3 h-3 shrink-0"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  free: {
    label: 'Free',
    className: [
      'bg-[color:var(--color-tier-free-bg,theme(colors.gray.100))]',
      'text-[color:var(--color-tier-free-text,theme(colors.gray.600))]',
    ],
    icon: null,
  },
  demo: {
    label: 'Demo',
    className: [
      'bg-muted',
      'text-muted-foreground',
    ],
    icon: null,
  },
} satisfies Record<string, { label: string; className: string[]; icon: React.ReactNode }>;

// ── Component ─────────────────────────────────────────────────────────────────

export function TierBadge({ tier, className }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.free;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        ...config.className,
        className,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}