'use client';

// shared/components/InsightCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Single insight card used by:
//   • HomePage  — "Сүүлийн ойлголт" section (human insight from API)
//   • SeedInsightStep — mirror / reframe / relief cards after analysis
//
// CSS tokens: card backgrounds use `--color-insight-mirror`, `--color-insight-reframe`,
// `--color-insight-relief` from globals.css (bg-insight-*/8 pattern).
// ─────────────────────────────────────────────────────────────────────────────
'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight, Brain } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { SkeletonCard } from '@/shared/components/SkeletonCard';
import { INSIGHT_CARDS, InsightKey } from '@/shared/constants';
import { InsightCardItem } from './InsightCardItem';

interface Props {
  data?: Partial<Record<InsightKey, string>> | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  showRefresh?: boolean;
  title?: string;
  compact?: boolean;
}

// ── Seed-insight card (mirror / reframe / relief) ─────────────────────────────


export function InsightCards({
  data,
  loading,
  error,
  onRefresh,
  showRefresh ,
  title = 'Өөрөөр сэтгэ',
  compact = false,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Header */}
      {(title || showRefresh) && (
        <div className="flex items-center justify-between">
          {title && (
            <h2 className="font-bold text-base text-[color:var(--color-accent,theme(colors.amber.500))] ">{title}</h2>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <SkeletonCard variant="card" repeat={INSIGHT_CARDS.length} />
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-destructive/10">
          <p className="text-sm text-destructive">{error}</p>

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs"
              onClick={onRefresh}
            >
              Дахин оролдох
            </Button>
          )}
        </div>
      )}

      {/* Cards */}
      {data && !loading && (
        <div className="space-y-3">
          {INSIGHT_CARDS.map((card, i) => {
            const text = data[card.key as InsightKey];
            if (!text) return null;

            return (
              <InsightCardItem
                key={card.key}
                card={card}
                text={text}
                index={i}
                compact={compact}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}




// ── Human insight card (last insight from API, used in HomePage) ──────────────

interface HumanInsightCardProps {
  insightText: string;
  acknowledged?: boolean;
  /** Link destination; defaults to /insights */
  href?: string;
}

export function HumanInsightCard({
  insightText,
  acknowledged = true,
  href = '/insights',
}: HumanInsightCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="p-4 rounded-2xl border bg-card hover:border-primary/30 transition-all">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-violet-500 shrink-0" />
            <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Сүүлийн ойлголт
            </p>
          </div>
          {!acknowledged && (
            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-0.5" />
          )}
        </div>
        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">{insightText}</p>
        <div className="flex justify-end mt-2">
          <span className="text-[11px] text-violet-500 font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
            Дэлгэрэнгүй <ChevronRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Pattern card (fallback when no human insight yet) ─────────────────────────

interface PatternCardProps {
  patternType: string;
  strengthScore: number;
  label?: string;
}

const PATTERN_LABELS: Record<string, string> = {
  dominant_need: 'Гол хэрэгцээ',
  unmet_need: 'Хангагдаагүй хэрэгцээ',
  dominant_emotion: 'Давамгай сэтгэл',
  high_intensity_emotion: 'Хурц сэтгэл',
  strong_need_connection: 'Хүчтэй холбоо',
  low_state: 'Доод түвшин',
  emotion_trend: 'Сэтгэлийн чиг',
  emotion_variance: 'Хэлбэлзэл',
};

export function PatternCard({ patternType, strengthScore, label }: PatternCardProps) {
  const displayLabel = label ?? (PATTERN_LABELS[patternType] ?? patternType);
  const pct = Math.round(strengthScore * 100);

  return (
    <div className="p-4 rounded-2xl border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={13} className="text-muted-foreground" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {displayLabel}
        </p>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">Хүч: {pct}%</p>
    </div>
  );
}