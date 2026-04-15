'use client';

// shared/components/HomePage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard home — шинэ /today API-д тохирсон хувилбар
//
// Layout (дээрээс доош):
//   1. Greeting + StatRow: entry_count · pattern_count · Hawkins оноо
//   2. HawkinsCard — band label · оноо · дараагийн зорилт
//   3. HumanInsightSummary — last human insight эсвэл top pattern
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
        <div>
          <p className="text-sm font-medium">Hawkins оноо тооцоологдоогүй</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Тэмдэглэл бичиж эхэлснээр харагдана
          </p>
        </div>
      </div>
    );
  }

  const bandColor = current.color_hex ?? '#888888';

  const progressPct =
    current.band_min != null && current.band_max != null
      ? Math.round(
          ((current.level - current.band_min) /
            (current.band_max - current.band_min)) *
            100,
        )
      : null;

  return (
    <div
      className="p-4 rounded-2xl border"
      style={{ borderColor: `${bandColor}40`, background: `${bandColor}0D` }}
    >
      {/* Header: label + оноо */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
            Hawkins — одоогийн төлөв
          </p>
          <p className="text-lg font-bold leading-tight" style={{ color: bandColor }}>
            {current.label_mn}
          </p>
          {current.band_label && (
            <p className="text-xs text-muted-foreground mt-0.5">{current.band_label}</p>
          )}
        </div>
        {/* Оноо badge */}
        <div
          className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
          style={{ background: `${bandColor}20`, color: bandColor }}
        >
          {current.level}
        </div>
      </div>

      {/* Band-н дотор прогресс */}
      {progressPct != null && (
        <div className="mb-3">
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%`, background: bandColor }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {current.band_label ?? 'Одоогийн band'} дотор: {progressPct}%
          </p>
        </div>
      )}

      {/* Дараагийн зорилт */}
      {target && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: `${bandColor}15` }}
        >
          <TrendingUp size={13} style={{ color: bandColor }} className="shrink-0" />
          <p className="text-xs flex-1">
            <span className="font-semibold">{target.label_mn}</span>
            {' '}руу{' '}
            <span className="font-bold" style={{ color: bandColor }}>
              +{target.gap}
            </span>
            {' '}оноо хэрэгтэй
          </p>
        </div>
      )}
    </div>
  );
}

// ─── HumanInsightSummary ──────────────────────────────────────────────────────

function HumanInsightSummary({ data }: { data: TodaySnapshot }) {
  const hi  = data.last_human_insight;
  const pat = data.unread_patterns?.[0] ?? null;

  // Human insight байвал — үгчлэн харуулна
  if (hi) {
    return (
      <div className="p-4 rounded-2xl border bg-card">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={13} className="text-violet-500 shrink-0" />
          <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
            Сүүлийн ойлголт
          </p>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">
          {hi.insight_text}
        </p>
        <div className="flex justify-end mt-2">
          <a
            href="/insights"
            className="text-[11px] text-violet-500 font-medium flex items-center gap-0.5 hover:gap-1.5 transition-all"
          >
            Дэлгэрэнгүй <ArrowRight size={11} />
          </a>
        </div>
      </div>
    );
  }

  // Fallback: хамгийн хүчтэй pattern
  if (pat) {
    const pct = Math.round(pat.strength_score * 100);
    return (
      <div className="p-4 rounded-2xl border bg-muted/20">
        <div className="flex items-center gap-1.5 mb-2">
          <Brain size={13} className="text-muted-foreground" />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            {PATTERN_LABELS[pat.pattern_type] ?? pat.pattern_type}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">Хүч: {pct}%</p>
      </div>
    );
  }

  return null;
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

  const hawkinsLevel = data?.hawkins_current?.level ?? null;
  const patternCount = data?.unread_patterns?.length ?? 0;

  const statItems = data
    ? [
        {
          label: 'Бичлэг',
          value: data.entry_count,
        },
        {
          label: 'Илэрсэн паттерн',
          value: patternCount,
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

      {/* 3. Human insight / top pattern */}
      {loading ? (
        <SkeletonCard variant="block" className="h-[100px]" />
      ) : data ? (
        <HumanInsightSummary data={data} />
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
