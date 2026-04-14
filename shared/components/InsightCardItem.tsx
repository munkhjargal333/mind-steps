'use client';

import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';

export function InsightCardItem({
  card,
  text,
  index,
  compact = false,
}: {
  card: (typeof INSIGHT_CARDS)[number];
  text: string;
  index: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl animate-[fadeUp_0.4s_ease_both]',
        compact ? 'p-4' : 'p-5',
        card.bg
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-2 h-2 rounded-full', card.dot)} />
        <span className="text-[10px] text-muted-foreground/40">
          {card.sub}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/80">
        {text}
      </p>
    </div>
  );
}