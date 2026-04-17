'use client';

// shared/components/StatRow.tsx
// ─────────────────────────────────────────────────────────────────────────────
// 3-column stat grid used on the dashboard home page.
// Supports optional tooltip for complex metrics (e.g. EWMA).
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';
import { Info } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  /** Optional Tailwind color class for the value */
  colorClass?: string;
  /** Tooltip text shown on hover — use for jargon like EWMA */
  tooltip?: string;
}

interface StatRowProps {
  items: StatItem[];
  className?: string;
}

export function StatRow({ items, className }: StatRowProps) {
  return (
    <div className={cn('grid gap-2.5', `grid-cols-${items.length}`, className)}>
      {items.map(({ label, value, colorClass, tooltip }) => (
        <div key={label} className="p-2.5 rounded-xl border bg-muted/20 text-center">
          <p className={cn('text-[17px] font-bold', colorClass)}>{value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
            {label}
            {tooltip && (
              <span
                className="relative group/tip inline-flex"
                title={tooltip}
                aria-label={tooltip}
              >
                <Info size={10} className="text-muted-foreground/50 cursor-help hover:text-muted-foreground transition-colors" />
                {/* Tooltip bubble */}
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 rounded-xl bg-foreground px-2.5 py-1.5 text-[10px] leading-snug text-background opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 shadow-lg z-50 text-left">
                  {tooltip}
                </span>
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
}