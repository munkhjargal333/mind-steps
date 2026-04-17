'use client';

import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { INSIGHT_CARDS, ACTION_MAP } from '@/shared/constants';
import type { SessionData, AnalyzeResult } from '@/core/api/types';
import type { InsightKey } from '@/shared/constants';

interface Props {
  session: SessionData;
  analyzing: boolean;
  result: AnalyzeResult | null;
  error: string | null;
  onMount: (session: SessionData) => void;
}

const SECTION_LABELS: Record<string, { label: string; style: 'quote' | 'body' | 'pill' }> = {
  mirror:  { label: 'Та ингэж харлаа',      style: 'quote' },
  reframe: { label: 'Өөр өнцгөөс',           style: 'body'  },
  relief:  { label: 'Одоо хийж болох зүйл',  style: 'pill'  },
};

export function SeedInsightStep({ session, analyzing, result, error, onMount }: Props) {
  useEffect(() => {
    onMount(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionCfg = ACTION_MAP[session.actionType];
  const Icon = actionCfg.icon;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-2 pt-1">
        {analyzing ? (
          <div className="flex flex-col items-center gap-2">
            <Sparkles size={20} className="text-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Таны туршлагыг уншиж байна…</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/70">
              Дотоод түлхэц
            </p>
            <h2 className="text-xl font-bold tracking-tight text-foreground/90 leading-snug">
              Таны туршлагаас<br />
              <span className="text-primary/70">харагдаж буй зүйл</span>
            </h2>
          </>
        )}
      </div>

      {/* Loading skeleton — 3 rows, gentle pulse */}
      {analyzing && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn('p-4 space-y-2', i < 2 && 'border-b border-border')}>
              <div className="h-2.5 w-24 rounded-full bg-muted-foreground/15" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded-full bg-muted-foreground/10" />
                <div className="h-3 w-4/5 rounded-full bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !analyzing && (
        <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Unified insight card */}
      {result?.insight && !analyzing && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {INSIGHT_CARDS.map((card, i) => {
            const text = result.insight[card.key as InsightKey];
            if (!text) return null;
            const meta = SECTION_LABELS[card.key] ?? { label: card.label, style: 'body' };

            return (
              <div
                key={card.key}
                className={cn(
                  'p-4 animate-[fadeUp_0.4s_ease_both]',
                  i < INSIGHT_CARDS.length - 1 && 'border-b border-border',
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Section label */}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2">
                  {meta.label}
                </p>

                {/* Content — style varies by section */}
                {meta.style === 'quote' && (
                  <p className="text-sm leading-relaxed text-foreground/80 italic">
                    "{text}"
                  </p>
                )}
                {meta.style === 'body' && (
                  <p className="text-sm leading-relaxed text-foreground/80">{text}</p>
                )}
                {meta.style === 'pill' && (
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-medium leading-snug">
                    {text}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
