'use client';

// features/journal/components/SeedInsightStep.tsx  (refactored)
// ─────────────────────────────────────────────────────────────────────────────
// CHANGES from original:
//  • Inline animate-pulse skeleton blocks → <SkeletonCard variant="card" />
//  • Inline insight card render → <SeedInsightCard />  (from shared/components/InsightCard)
//  • No logic changed; only presentation extracted to shared
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { INSIGHT_CARDS } from '@/shared/constants';
import type { SessionData, AnalyzeResult } from '@/core/api/types';

import { SkeletonCard }    from '@/shared/components/SkeletonCard';
import { SeedInsightCard } from '@/shared/components/InsightCard';

interface Props {
  session: SessionData;
  analyzing: boolean;
  result: AnalyzeResult | null;
  error: string | null;
  onMount: (session: SessionData) => void;
}

export function SeedInsightStep({
  session,
  analyzing,
  result,
  error,
  onMount,
}: Props) {
  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center text-center gap-3 pt-2 pb-1">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-accent,theme(colors.amber.500))]">
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

      {/* ── Loading skeleton — shared component ───────────────────────── */}
      {analyzing && (
        <SkeletonCard variant="card" repeat={INSIGHT_CARDS.length} />
      )}

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* ── Insight cards — shared component ──────────────────────────── */}
      {result && (
        <div className="space-y-3">
          {INSIGHT_CARDS.map((card, i) => (
            <SeedInsightCard
              key={card.key}
              card={card}
              text={result.insight[card.key]}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}