'use client';

// InsightCardItem.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Insight card with notebook-marker highlighter effects.
//
// CSS tokens used (defined in design-tokens.css):
//   --highlight-mirror / --highlight-reframe / --highlight-relief
//   --highlight-blend  (multiply in light, screen in dark)
//
// No inline rgba values — fully token-driven so dark mode works automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';

type HighlightKey = 'mirror' | 'reframe' | 'relief';

const CARD_META: Record<HighlightKey, { title: string; sub: string }> = {
  mirror:  { title: 'ТУСГАЛ',     sub: 'Чиний хэлсэн зүйл'   },
  reframe: { title: 'ШИНЭ ӨНЦӨГ', sub: 'Өөр талаас харвал'    },
  relief:  { title: 'ТАЙВШИРАЛ',  sub: 'Одоо хийж болох зүйл' },
};

// Inline highlight span — uses CSS token + blend mode set per theme
function HL({
  hlKey,
  className,
  children,
}: {
  hlKey: HighlightKey;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span
        aria-hidden
        className="absolute -inset-y-0.5 -inset-x-1 rounded-[2px] pointer-events-none"
        style={{
          background: `var(--highlight-${hlKey})`,
          mixBlendMode: 'var(--highlight-blend, multiply)' as React.CSSProperties['mixBlendMode'],
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

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
  const meta = CARD_META[key] ?? { title: card.label, sub: card.sub };

  return (
    <div
      className={cn(
        'relative border-l-4 border-t-0 border-r-0 border-b-0 transition-all duration-300',
        'hover:translate-x-1 group overflow-hidden',
        'border-foreground/10',
        compact ? 'p-4' : 'p-6',
        'animate-[fadeUp_0.5s_ease_both]',
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">

        {/* Stamp tag */}
        <HL hlKey={key}>
          <span className="px-1 py-0.5 font-black text-[10px] tracking-[0.2em] font-serif uppercase border border-foreground/10">
            {meta.title}
          </span>
        </HL>

        <div className="h-[1px] flex-1 bg-foreground/10" />

        {/* Sub-label */}
        <HL hlKey={key}>
          <span className="font-serif italic text-[11px] font-bold tracking-tight opacity-75">
            {meta.sub}
          </span>
        </HL>
      </div>

      {/* ── Body text ── */}
      <p
        className={cn(
          'font-serif leading-relaxed italic text-foreground/85',
          compact ? 'text-sm' : 'text-base',
        )}
      >
        &ldquo;{text}&rdquo;
      </p>

      {/* Decorative index */}
      <div className="absolute bottom-2 right-3 opacity-10 font-serif text-[10px] font-bold italic">
        {index + 1}
      </div>

      {/* Ruled-line texture — CSS-only, no external URL */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.025] rounded-[inherit]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 23px, var(--border) 24px)',
        }}
      />
    </div>
  );
}