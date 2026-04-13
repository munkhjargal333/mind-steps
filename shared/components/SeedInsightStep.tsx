// features/journal/components/SeedInsightStep.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Skeleton-г shared/ui/skeleton-аас авч, CSS token ашиглаж цэвэрлэсэн хувилбар.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS } from '@/shared/constants';
import { InsightCardSkeleton } from '@/shared/ui';
import type { SessionData, AnalyzeResult } from '@/core/api/types';

interface Props {
  session: SessionData;
  analyzing: boolean;
  result: AnalyzeResult | null;
  error: string | null;
  onMount: (session: SessionData) => void;
}

export function SeedInsightStep({ session, analyzing, result, error, onMount }: Props) {
  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center text-center gap-3 pt-2 pb-1">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-500">
            Дотоод түлхэц
          </p>
          <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-snug">
            Таны туршлагаас<br />
            <span className="text-primary/70">харагдаж буй зүйл</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full max-w-[140px]">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-muted-foreground/15" />
          <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-muted-foreground/15" />
        </div>
      </div>

      {/* ── Skeleton (shared/ui/skeleton) ──────────────────────────────────── */}
      {analyzing && (
        <div className="space-y-4">
          {INSIGHT_CARDS.map((card) => (
            <InsightCardSkeleton key={card.key} />
          ))}
          <p className="text-center text-[11px] text-muted-foreground/40 animate-pulse">
            Уншиж байна...
          </p>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* ── Insight cards (CSS token ашигладаг — globals.css-д --insight-* тодорхойлогдсон) */}
      {result && (
        <div className="space-y-3">
          {INSIGHT_CARDS.map((card, i) => (
            <div
              key={card.key}
              className={cn(
                'p-5 rounded-2xl',
                'animate-[fadeUp_0.4s_ease_both]',
                // CSS semantic token: bg-insight-mirror/8, bg-insight-reframe/8, bg-insight-relief/8
                // globals.css дээр --color-insight-mirror, --color-insight-reframe, --color-insight-relief
                card.bg,
              )}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                {/* CSS token dot: bg-insight-mirror, bg-insight-reframe, bg-insight-relief */}
                <div className={cn('w-2 h-2 rounded-full', card.dot)} />
                <span className="text-[10px] text-muted-foreground/40">· {card.sub}</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {result.insight[card.key]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}