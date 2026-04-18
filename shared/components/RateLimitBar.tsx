'use client';

// shared/components/RateLimitBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Rate-limit progress dots.
//
// CSS tokens used:
//   --color-danger  (defined in design-tokens.css, bridged via @theme inline)
//   --color-warning (same)
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
  // ≤20% үлдсэн бол анхааруулга
  const isWarning = !isLimited && remaining > 0 && remaining / limit <= 0.2;

  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Header row */}
      <div className="flex justify-between items-center">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p
          className={cn('text-[11px] font-semibold')}
          style={{
            color: isLimited
              ? 'var(--color-danger)'
              : isWarning
              ? 'var(--color-warning)'
              : 'var(--muted-foreground)',
          }}
        >
          {isLimited
            ? 'Хязгаарт хүрлээ'
            : isWarning
            ? `⚠ ${remaining} үлдсэн`
            : `${remaining} үлдсэн`}
        </p>
      </div>

      {/* Dot progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-colors duration-300"
            style={{
              background:
                i < usageCount
                  ? isLimited
                    ? 'var(--color-danger)'
                    : isWarning
                    ? 'var(--color-warning)'
                    : 'var(--brand-amber)'
                  : 'var(--muted)',
            }}
          />
        ))}
      </div>

      {/* Upgrade CTA */}
      {(isLimited || isWarning) && (
        <p className="text-[10px] text-center">
          <a
            href="/upgrade"
            className="font-semibold underline underline-offset-2 transition-colors hover:opacity-80"
            style={{
              color: isLimited ? 'var(--color-danger)' : 'var(--color-warning)',
            }}
          >
            Pro руу шилжих →
          </a>{' '}
          <span className="text-muted-foreground">хязгаргүй болгох</span>
        </p>
      )}
    </div>
  );
}