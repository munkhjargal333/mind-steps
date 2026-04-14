'use client';

// shared/components/RateLimitBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Rate-limit progress dots — formerly copy-pasted in both HomePage and
// ActionSelector.  Single source of truth now lives here.
//
// Usage:
//   <RateLimitBar usageCount={2} limit={5} remaining={3} isLimited={false} />
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';

interface RateLimitBarProps {
  usageCount: number;
  limit: number;
  remaining: number;
  isLimited: boolean;
  /** Optional label override for left side */
  label?: string;
  className?: string;
}

export function RateLimitBar({
  usageCount,
  limit,
  remaining,
  isLimited,
  label = 'Өнөөдрийн ашиглалт',
  className,
}: RateLimitBarProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Header row */}
      <div className="flex justify-between">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p
          className={cn(
            'text-[11px] font-semibold',
            isLimited ? 'text-[color:var(--color-danger,theme(colors.red.500))]' : 'text-muted-foreground',
          )}
        >
          {isLimited ? 'Хязгаарт хүрлээ' : `${remaining} үлдсэн`}
        </p>
      </div>

      {/* Dot progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-1.5 rounded-full transition-colors duration-300',
              i < usageCount
                ? isLimited
                  ? 'bg-[color:var(--color-danger,theme(colors.red.500))]'
                  : 'bg-orange-400'
                : 'bg-muted',
            )}
          />
        ))}
      </div>
    </div>
  );
}