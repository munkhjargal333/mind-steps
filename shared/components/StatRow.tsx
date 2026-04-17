'use client';

import { cn } from '@/shared/lib/utils';
import { Info } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  colorClass?: string;
  tooltip?: string;
}

interface StatRowProps {
  items: StatItem[];
  className?: string;
}

export function StatRow({ items, className }: StatRowProps) {
  return (
    <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
      {items.map(({ label, value, colorClass, tooltip }, idx) => (
        <>
          {idx > 0 && (
            <span key={`sep-${label}`} className="text-muted-foreground/20 text-xs select-none">·</span>
          )}
          <div
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/60"
          >
            <span className={cn('text-sm font-bold tabular-nums', colorClass)}>{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
            {tooltip && (
              <span className="relative group/tip inline-flex" title={tooltip} aria-label={tooltip}>
                <Info size={10} className="text-muted-foreground/40 cursor-help hover:text-muted-foreground transition-colors" />
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 rounded-xl bg-foreground px-2.5 py-1.5 text-[10px] leading-snug text-background opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 shadow-lg z-50 text-left">
                  {tooltip}
                </span>
              </span>
            )}
          </div>
        </>
      ))}
    </div>
  );
}
