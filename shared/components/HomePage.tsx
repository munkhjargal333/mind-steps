'use client';

// shared/components/HomePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard home — шинэ /today API-д тохирсон хувилбар
//
// Layout (дээрээс доош):
//   1. Greeting + StatRow: entry_count · pattern_count · Hawkins оноо
//   2. HawkinsCard — from to
  // 3. HumanInsightSummary — ?
//   4. RateLimitBar (free tier)
//   5. "Тэмдэглэл нэмэх" CTA товч
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, ArrowRight, Sparkles, Brain } from 'lucide-react';

import { useAuth } from '@/core/auth/AuthContext';
import { useRateLimit } from '@/shared/hooks/useRateLimit';
import { useTierContext } from '@/core/providers';
import { getTodaySnapshot } from '@/core/api';
import { cn } from '@/shared/lib/utils';
import type { TodaySnapshot, Tier } from '@/core/api/types';

import { SkeletonCard }  from './SkeletonCard';
import { RateLimitBar }  from './RateLimitBar';
import { StatRow }       from './StatRow';
import { useGreeting }   from '@/shared/hooks/useDashboard';
import { SectionHeader } from './SectionHeader';

// ─── PATTERN_LABELS ───────────────────────────────────────────────────────────

const PATTERN_LABELS: Record<string, string> = {
  dominant_need:          'Гол хэрэгцээ',
  unmet_need:             'Хангагдаагүй хэрэгцээ',
  dominant_emotion:       'Давамгай сэтгэл',
  high_intensity_emotion: 'Хурц сэтгэл',
  strong_need_connection: 'Хүчтэй холбоо',
  low_state:              'Доод түвшин',
  emotion_trend:          'Сэтгэлийн чиг',
  emotion_variance:       'Хэлбэлзэл',
};

// ─── HawkinsCard ──────────────────────────────────────────────────────────────

function HawkinsCard({ data }: { data: TodaySnapshot }) {
  const current = data.hawkins_current;
  const target  = data.hawkins_target;

  if (!current) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border bg-muted/30">
        <Brain size={16} className="text-muted-foreground/50 shrink-0" />
        <p className="text-sm">Hawkins оноо хараахан үүсээгүй</p>
      </div>
    );
  }

  const color = current.color_hex ?? '#888';

  return (
    <div
      className="rounded-2xl border p-4 space-y-4"
      style={{ borderColor: `${color}30`, background: `${color}08` }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">
          Таны төлөв
        </p>

        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${color}20`, color }}
        >
          Hawkins
        </span>
      </div>

      {/* ── CURRENT → TARGET ── */}
      <div className="flex items-center gap-3">

        {/* Current */}
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground mb-1">Одоо</p>
          <div
            className="p-3 rounded-xl"
            style={{ background: `${color}15` }}
          >
            <p className="text-sm font-bold" style={{ color }}>
              {current.label_mn}
            </p>
            <p className="text-xs text-muted-foreground">
              {current.level}
            </p>
          </div>
        </div>

        {/* Arrow */}
        {target && (
          <div className="flex flex-col items-center gap-1">
            <ArrowRight size={16} className="text-muted-foreground/40" />
            <span className="text-[10px] text-muted-foreground">
              +{target.level - current.level}
            </span>
          </div>
        )}

        {/* Target */}
        {target && (
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground mb-1">Дараагийн</p>
            <div className="p-3 rounded-xl border border-dashed">
              <p className="text-sm font-semibold text-foreground/70">
                {target.label_mn}
              </p>
              <p className="text-xs text-muted-foreground">
                {target.level}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Progress bar ── */}
      {target && (
        <div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  100,
                  ((current.level) / (target.level)) * 100
                )}%`,
                background: color,
              }}
            />
          </div>

          <p className="text-[10px] text-muted-foreground mt-1 text-right">
            {target.level - current.level} оноо дутуу
          </p>
        </div>
      )}

      {/* ── Key insight (🔥 маш хүчтэй UX) ── */}
      {current.transcend_key && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl"
          style={{ background: `${color}15` }}
        >
          <Sparkles size={12} style={{ color }} className="mt-0.5" />
          <p className="text-xs leading-relaxed" style={{ color }}>
            {current.transcend_key}
          </p>
        </div>
      )}
    </div>
  );
}


// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const router            = useRouter();
  const { token, user }   = useAuth();
  const { tier: ctxTier } = useTierContext();
  const greeting          = useGreeting();

  const tier: Tier = ctxTier === 'pro' ? 'pro' : 'free';
  const userId     = user?.id ?? 'unknown';
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

  const hawkinsLevel = Math.round(data?.hawkins || 0);
  const patternCount = data?.pattern_type_count

  const statItems = data
    ? [
        {
          label: 'Бичлэг',
          value: data.entry_count,
        },
        {
          label: 'Илэрсэн паттерн',
          value: patternCount ?? 0,
        },
        {
          label: 'Hawkins оноо',
          value: hawkinsLevel ?? '—',
          colorClass:
            hawkinsLevel != null
              ? hawkinsLevel >= 200
                ? 'text-green-600 dark:text-green-400'
                : 'text-orange-500'
              : undefined,
          tooltip:
            'David Hawkins-ийн сэтгэлийн оноо. 200-аас дээш = эерэг, доош = сөрөг энергийн орчин.',
        },
      ]
    : [];

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 space-y-4 animate-in fade-in duration-500">

      {/* Greeting */}
      <SectionHeader accent={greeting} title="Тэмдэглэлийн дэвтэр" />

      {/* 1. Stats: бичлэг · паттерн · Hawkins оноо */}
      {loading ? (
        <SkeletonCard variant="block" className="h-[60px]" />
      ) : (
        <StatRow items={statItems} />
      )}

      {/* 2. Hawkins card */}
      {loading ? (
        <SkeletonCard variant="block" className="h-[140px]" />
      ) : err ? (
        <div className="p-4 rounded-2xl border bg-destructive/10 text-destructive text-sm">
          {err}
        </div>
      ) : data ? (
        <HawkinsCard data={data} />
      ) : null}

      {/* Rate limit bar — free tier */}
      {!isPro && (
        <RateLimitBar
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
        />
      )}

      {/* 4. CTA */}
      <button
        onClick={() => router.push('/write')}
        disabled={!canWrite}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm',
          'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-sm transition-all',
          !canWrite && 'opacity-50 cursor-not-allowed',
        )}
      >
        <Plus size={18} strokeWidth={2.5} />
        Тэмдэглэл нэмэх
      </button>

      <p className="text-[10px] text-center text-muted-foreground/40 pt-1">
        MindSteps v2.0 • Сэтгэл зүйн туслах
      </p>
    </div>
  );
}