'use client';

// shared/components/EmotionCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Displays the dominant emotion for the day (HomePage → top card).
// Extracted from HomePage.tsx so other pages (Insights, etc.) can reuse it.
//
// CSS tokens used:
//   Each emotion maps through the EMOTION_MAP below to semantic classes.
//   All color tokens (amber-500, teal-400 …) should eventually be aliased to
//   --color-emotion-* in globals.css for full token coverage.
// ─────────────────────────────────────────────────────────────────────────────

import { Brain } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// ── Config ────────────────────────────────────────────────────────────────────

export const EMOTION_MAP: Record<
  string,
  { label: string; emoji: string; color: string; bg: string }
> = {
  joy:          { label: 'Баяр хөөр',  emoji: '☀️', color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/30'   },
  trust:        { label: 'Итгэл',      emoji: '🤝', color: 'text-teal-600 dark:text-teal-400',     bg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/30'     },
  fear:         { label: 'Айдас',      emoji: '🌫️', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/30' },
  surprise:     { label: 'Гайхшрал',  emoji: '✨', color: 'text-sky-600 dark:text-sky-400',       bg: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/30'         },
  sadness:      { label: 'Гуниг',      emoji: '🌧️', color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/30'     },
  disgust:      { label: 'Дургүйцэл', emoji: '🍂', color: 'text-green-700 dark:text-green-400',   bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/30'   },
  anger:        { label: 'Уур хилэн', emoji: '🔥', color: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/30'         },
  anticipation: { label: 'Хүлээлт',   emoji: '🌅', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/30' },
};

// ── Hawkins level helper (also used in hooks/useHawkins) ──────────────────────

export function hawkinsInfo(lvl: number) {
  if (lvl >= 350) return { label: 'Хүлээн зөвшөөрөл', cls: 'text-teal-600 dark:text-teal-400' };
  if (lvl >= 250) return { label: 'Хүлцэл',            cls: 'text-sky-600 dark:text-sky-400' };
  if (lvl >= 200) return { label: 'Зоримог байдал',    cls: 'text-green-600 dark:text-green-400' };
  if (lvl >= 150) return { label: 'Бардамнал',         cls: 'text-orange-600 dark:text-orange-400' };
  return               { label: 'Айдас / Гуниг',     cls: 'text-indigo-600 dark:text-indigo-400' };
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface EmotionCardProps {
  /** One of the EMOTION_MAP keys, e.g. 'joy' | 'fear' | … */
  emotionKey: string | null;
  /** Entry count shown on the right */
  entryCount?: number;
  /** Hawkins EWMA value */
  ewma?: number | null;
  /** Shown when emotionKey is null but data is present */
  emptyMessage?: { title: string; sub: string };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EmotionCard({
  emotionKey,
  entryCount,
  ewma,
  emptyMessage = { title: 'Сэтгэл бүртгэгдээгүй', sub: 'Эхний тэмдэглэлийг бичиж эхэлцгээе' },
}: EmotionCardProps) {
  const emo = emotionKey ? (EMOTION_MAP[emotionKey] ?? null) : null;
  const ewmaRnd = ewma != null ? Math.round(ewma) : null;
  const hw = ewmaRnd != null ? hawkinsInfo(ewmaRnd) : null;

  // No emotion recorded yet
  if (!emo) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border bg-muted/30">
        <Brain size={18} className="text-muted-foreground/50 shrink-0" />
        <div>
          <p className="text-sm font-medium">{emptyMessage.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{emptyMessage.sub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-4 p-4 rounded-2xl border', emo.bg)}>
      {/* Том emoji — гол харааны цэг */}
      <span className="text-[42px] leading-none select-none shrink-0">{emo.emoji}</span>

      {/* Сэтгэлийн мэдээлэл */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
          Өнөөдрийн давамгай сэтгэл
        </p>
        <p className={cn('text-xl font-bold leading-tight', emo.color)}>{emo.label}</p>
      </div>

      {/* Баруун тал: бичлэг тоо + Hawkins тэмдэглэгээ */}
      <div className="shrink-0 text-right flex flex-col items-end gap-1">
        {entryCount != null && (
          <div>
            <p className="text-2xl font-bold">{entryCount}</p>
            <p className="text-[10px] text-muted-foreground">бичлэг</p>
          </div>
        )}
        {hw && ewmaRnd != null && (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
              'bg-white/60 dark:bg-black/20',
              hw.cls,
            )}
            title={`Hawkins оноо: ${ewmaRnd}`}
          >
            {ewmaRnd} · {hw.label}
          </span>
        )}
      </div>
    </div>
  );
}