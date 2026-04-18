'use client';

import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';

type HighlightKey = 'mirror' | 'reframe' | 'relief';

// Картын үндсэн мэдээлэл (Хэрэв constants-д байхгүй бол эндээс авна)
const CARD_META: Record<HighlightKey, { title: string }> = {
  mirror:  { title: 'ТУСГАЛ' },
  reframe: { title: 'ШИНЭ ӨНЦӨГ' },
  relief:  { title: 'ТАЙВШИРАЛ' },
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
  const key = card.key as HighlightKey;
  const meta = CARD_META[key];

  return (
    <div
      className={cn(
        'relative border border-foreground/10 transition-all duration-300',
        'group overflow-hidden shadow-sm bg-card',
        card.bg, // INSIGHT_CARDS-аас ирэх background
        compact ? 'p-4' : 'p-6',
        'animate-[fadeUp_0.5s_ease_both]',
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
        
        {/* Stamp Style Title */}
        <div className="relative">
          <div className={cn(
            "absolute -inset-1 opacity-40 blur-[2px] rounded-sm",
            card.dot // Тодруулагчийн өнгө
          )} />
          <span className="relative z-10 px-2 py-0.5 font-black text-[10px] tracking-[0.2em] font-serif uppercase border-2 border-foreground/20 bg-background/50">
            {meta.title}
          </span>
        </div>

        <div className="h-[1px] flex-1 border-t border-dashed border-foreground/20" />

        {/* Sub-label from INSIGHT_CARDS */}
        <span className="font-serif italic text-[11px] font-bold tracking-tight text-foreground/70">
          {card.sub}
        </span>
      </div>

      {/* ── Body text ── */}
      <div className="relative">
        {/* Highlighter effect behind text */}
        <span className={cn(
          "absolute left-0 top-0 w-1 h-full opacity-50",
          card.dot
        )} />
        
        <p
          className={cn(
            'font-serif leading-relaxed italic text-foreground px-4',
            compact ? 'text-sm' : 'text-base',
          )}
        >
          &ldquo;{text}&rdquo;
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 p-1 opacity-10">
        <div className={cn("w-8 h-8 rounded-bl-full", card.dot)} />
      </div>

      {/* Ruled-line texture (Сонины мөр шиг харагдуулах) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[inherit]"
        style={{
          backgroundImage:
            'linear-gradient(var(--foreground) 1px, transparent 1px)',
          backgroundSize: '100% 28px',
        }}
      />
    </div>
  );
}