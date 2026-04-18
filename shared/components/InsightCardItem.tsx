'use client';

import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';

type HighlightKey = 'mirror' | 'reframe' | 'relief';

const HL_BASE_1 = 'highlight highlight-variant-3 highlight-sky-300 after:opacity-40 highlight-spread-md';    
const HL_BASE_2 = 'highlight highlight-variant-3 highlight-violet-300 after:opacity-40 highlight-spread-md';  
const HL_BASE_3 = 'highlight highlight-variant-3 highlight-emerald-300 after:opacity-40 highlight-spread-md';


const CARD_META: Record<HighlightKey, { title: string; hl: string }> = {
  mirror:  { title: 'ТУСГАЛ',     hl: HL_BASE_1 },
  reframe: { title: 'ШИНЭ ӨНЦӨГ', hl: HL_BASE_2 },
  relief:  { title: 'ТАЙВШИРАЛ',  hl: HL_BASE_3 },
};

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
  const key  = card.key as HighlightKey;
  const meta = CARD_META[key];

  return (
    <div
      className={cn(
        'relative border border-foreground/10 transition-all duration-300',
        'group overflow-hidden',
        compact ? 'p-4' : 'p-6',
        'animate-[fadeUp_0.5s_ease_both]',
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">

        {/* Title */}
        <span className={cn('font-black text-[10px] tracking-[0.2em] font-mono uppercase', meta.hl)}>
          {meta.title}
        </span>

        <div className="h-[1px] flex-1 border-t border-dashed border-foreground/20" />

        {/* Sub-label */}
        <span className="font-serif italic text-[11px] font-bold tracking-tight text-foreground/70">
          {card.sub}
        </span>
      </div>

      {/* ── Body text ── */}
      <p
        className={cn(
          'font-serif leading-relaxed italic text-foreground',
          compact ? 'text-sm' : 'text-base',
        )}
      >
        &ldquo;{text}&rdquo;
      </p>

      {/* Ruled-line texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[inherit]"
        style={{
          backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px)',
          backgroundSize: '100% 28px',
        }}
      />
    </div>
  );
}