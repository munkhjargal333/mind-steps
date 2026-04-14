'use client';

// shared/components/StatRow.tsx
// ─────────────────────────────────────────────────────────────────────────────
// 3-column stat grid used on the dashboard home page.
// Extracted from HomePage.tsx inline render logic.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';

interface StatItem {
  label: string;
  value: number | string;
  /** Optional Tailwind color class for the value */
  colorClass?: string;
}

interface StatRowProps {
  items: StatItem[];
  className?: string;
}

export function StatRow({ items, className }: StatRowProps) {
  return (
    <div className={cn('grid gap-2.5', `grid-cols-${items.length}`, className)}>
      {items.map(({ label, value, colorClass }) => (
        <div key={label} className="p-2.5 rounded-xl border bg-muted/20 text-center">
          <p className={cn('text-[17px] font-bold', colorClass)}>{value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}