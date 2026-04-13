'use client';

// shared/components/HomePage.tsx
// HOME — "Би одоо ямар байна?"
// Холболт: GET /api/today → emotion card • human insight • stats

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ChevronRight, Plus, Brain, BookOpen } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import { useRateLimit } from '@/shared/hooks/useRateLimit';
import { useTierContext } from '@/core/providers';
import { getTodaySnapshot } from '@/core/api';
import { cn } from '@/shared/lib/utils';
import type { TodaySnapshot, Tier } from '@/core/api/types';

// ─── Static config ────────────────────────────────────────────────────────────

const EMOTION: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  joy:          { label: 'Баяр хөөр',  emoji: '☀️', color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/30'  },
  trust:        { label: 'Итгэл',      emoji: '🤝', color: 'text-teal-600 dark:text-teal-400',    bg: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/30'    },
  fear:         { label: 'Айдас',      emoji: '🌫️', color: 'text-indigo-600 dark:text-indigo-400',bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/30'},
  surprise:     { label: 'Гайхшрал',  emoji: '✨', color: 'text-sky-600 dark:text-sky-400',      bg: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/30'      },
  sadness:      { label: 'Гуниг',      emoji: '🌧️', color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/30'    },
  disgust:      { label: 'Дургүйцэл', emoji: '🍂', color: 'text-green-700 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/30'  },
  anger:        { label: 'Уур хилэн', emoji: '🔥', color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/30'      },
  anticipation: { label: 'Хүлээлт',   emoji: '🌅', color: 'text-orange-600 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800/30'},
};

const PATTERN_LABELS: Record<string, string> = {
  dominant_need: 'Гол хэрэгцээ', unmet_need: 'Хангагдаагүй хэрэгцээ',
  dominant_emotion: 'Давамгай сэтгэл', high_intensity_emotion: 'Хурц сэтгэл',
  strong_need_connection: 'Хүчтэй холбоо', low_state: 'Доод түвшин',
  emotion_trend: 'Сэтгэлийн чиг', emotion_variance: 'Хэлбэлзэл',
};

function hawkinsInfo(lvl: number) {
  if (lvl >= 350) return { label: 'Хүлээн зөвшөөрөл', cls: 'text-teal-600 dark:text-teal-400' };
  if (lvl >= 250) return { label: 'Хүлцэл',            cls: 'text-sky-600 dark:text-sky-400' };
  if (lvl >= 200) return { label: 'Зоримог байдал',    cls: 'text-green-600 dark:text-green-400' };
  if (lvl >= 150) return { label: 'Бардамнал',         cls: 'text-orange-600 dark:text-orange-400' };
  return               { label: 'Айдас / Гуниг',     cls: 'text-indigo-600 dark:text-indigo-400' };
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Өглөөний мэнд' : h < 18 ? 'Өдрийн мэнд' : 'Оройн мэнд';
}

function Skel({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-muted', className)} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
// Props шаардлагагүй — useAuth, useTierContext, useRateLimit дотроо дуудна

export function HomePage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { tier: ctxTier } = useTierContext();

  const tier: Tier = ctxTier === 'pro' ? 'pro' : 'free';
  const userId = user?.id ?? 'unknown';
  const { usageCount, limit, remaining, isLimited } = useRateLimit(userId, tier);

  const [data, setData]       = useState<TodaySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getTodaySnapshot(token)
      .then(setData)
      .catch(e => setErr(e.message ?? 'Алдаа гарлаа'))
      .finally(() => setLoading(false));
  }, [token]);

  const isPro    = tier === 'pro';
  const canWrite = isPro || !isLimited;
  const emo      = data?.dominant_emotion ? (EMOTION[data.dominant_emotion] ?? null) : null;
  const hi       = data?.last_human_insight ?? null;
  const topPat   = data?.top_patterns?.[0] as any ?? null;
  const ewmaRnd  = data?.ewma != null ? Math.round(data.ewma) : null;
  const hw       = ewmaRnd != null ? hawkinsInfo(ewmaRnd) : null;

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 space-y-4 animate-in fade-in duration-500">

      {/* Greeting */}
      <div className="pt-2">
        <p className="text-xs text-muted-foreground font-medium tracking-wide">{greeting()}</p>
        <h1 className="text-xl font-semibold tracking-tight mt-0.5">Сэтгэлийн дэвтэр</h1>
      </div>

      {/* Emotion card */}
      {loading ? <Skel className="h-[76px]" /> : err ? (
        <div className="p-4 rounded-2xl border bg-destructive/10 text-destructive text-sm">{err}</div>
      ) : emo ? (
        <div className={cn('flex items-center gap-4 p-4 rounded-2xl border', emo.bg)}>
          <span className="text-[26px] leading-none select-none">{emo.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              Өнөөдрийн давамгай сэтгэл
            </p>
            <p className={cn('text-base font-semibold', emo.color)}>{emo.label}</p>
            {hw && ewmaRnd != null && (
              <p className={cn('text-[11px] mt-0.5', hw.cls)}>
                Хокинс {ewmaRnd} — {hw.label}
              </p>
            )}
          </div>
          {data && (
            <div className="shrink-0 text-right">
              <p className="text-2xl font-bold">{data.entry_count}</p>
              <p className="text-[10px] text-muted-foreground">бичлэг</p>
            </div>
          )}
        </div>
      ) : data ? (
        <div className="flex items-center gap-3 p-4 rounded-2xl border bg-muted/30">
          <Brain size={18} className="text-muted-foreground/50 shrink-0" />
          <div>
            <p className="text-sm font-medium">Сэтгэл бүртгэгдээгүй</p>
            <p className="text-xs text-muted-foreground mt-0.5">Эхний тэмдэглэлийг бичиж эхэлцгээе</p>
          </div>
        </div>
      ) : null}

      {/* Human insight / pattern card */}
      {loading ? <Skel className="h-[100px]" /> : hi ? (
        <Link href="/insights" className="block group">
          <div className="p-4 rounded-2xl border bg-card hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-violet-500 shrink-0" />
                <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Сүүлийн ойлголт
                </p>
              </div>
              {!hi.acknowledged && <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-0.5" />}
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">{hi.insight_text}</p>
            <div className="flex justify-end mt-2">
              <span className="text-[11px] text-violet-500 font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                Дэлгэрэнгүй <ChevronRight size={11} />
              </span>
            </div>
          </div>
        </Link>
      ) : topPat ? (
        <div className="p-4 rounded-2xl border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={13} className="text-muted-foreground" />
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              {PATTERN_LABELS[topPat.pattern_type] ?? topPat.pattern_type}
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.round(topPat.strength_score * 100)}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">Хүч: {Math.round(topPat.strength_score * 100)}%</p>
        </div>
      ) : null}

      {/* Stats row */}
      {!loading && data && (
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Бичлэг',   val: data.entry_count, cls: '' },
            { label: 'Хэв маяг', val: data.top_patterns?.length ?? 0, cls: '' },
            {
              label: 'EWMA',
              val: ewmaRnd ?? '—',
              cls: ewmaRnd != null
                ? ewmaRnd >= 200 ? 'text-green-600 dark:text-green-400' : 'text-orange-500'
                : '',
            },
          ].map(({ label, val, cls }) => (
            <div key={label} className="p-2.5 rounded-xl border bg-muted/20 text-center">
              <p className={cn('text-[17px] font-bold', cls)}>{val}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Rate limit bar */}
      {!isPro && (
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <p className="text-[11px] text-muted-foreground">Өнөөдрийн ашиглалт</p>
            <p className={cn('text-[11px] font-semibold', isLimited ? 'text-red-500' : 'text-muted-foreground')}>
              {isLimited ? 'Хязгаарт хүрлээ' : `${remaining} үлдсэн`}
            </p>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: limit }).map((_, i) => (
              <div
                key={i}
                className={cn('flex-1 h-1.5 rounded-full transition-colors',
                  i < usageCount ? (isLimited ? 'bg-red-500' : 'bg-orange-400') : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Primary CTA → /write */}
      <button
        onClick={() => router.push('/write')}
        disabled={!canWrite}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all',
          'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]',
          !canWrite && 'opacity-50 cursor-not-allowed',
        )}
      >
        <Plus size={17} strokeWidth={2.5} />
        Шинэ тэмдэглэл бичих
      </button>

      {/* Journal shortcut */}
      <Link
        href="/entries"
        className="flex items-center justify-between px-4 py-3 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-all"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Бичлэгийн түүх</span>
        </div>
        <ChevronRight size={13} className="text-muted-foreground/50" />
      </Link>

      <p className="text-[10px] text-center text-muted-foreground/40 pt-1">
        MindSteps v2.0 • Сэтгэл зүйн туслах
      </p>
    </div>
  );
}