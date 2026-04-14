'use client';

// shared/components/HomePage.tsx  (refactored)
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard home — "Би одоо ямар байна?"
// GET /api/today → emotion card · human insight · stats
//
// CHANGES from original:
//  • Removed local `Skel` helper → SkeletonCard
//  • Removed local `greeting()` / `hawkinsInfo()` → useDashboard hooks
//  • Removed inline rate-limit dots → RateLimitBar
//  • Removed inline emotion map → EmotionCard
//  • Removed inline insight / pattern render → HumanInsightCard + PatternCard
//  • Removed inline stat grid → StatRow
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

import { useAuth } from '@/core/auth/AuthContext';
import { useRateLimit } from '@/shared/hooks/useRateLimit';
import { useTierContext } from '@/core/providers';
import { getTodaySnapshot } from '@/core/api';
import { cn } from '@/shared/lib/utils';
import type { TodaySnapshot, Tier } from '@/core/api/types';

import { SkeletonCard }       from './SkeletonCard';
import { RateLimitBar }       from './RateLimitBar';
import { EmotionCard }        from './EmotionCard';
import { HumanInsightCard, PatternCard } from './InsightCard';
import { StatRow }            from './StatRow';
import { useGreeting, useHawkins } from '@/shared/hooks/useDashboard';
import { SectionHeader } from './SectionHeader';

// ─── Component ────────────────────────────────────────────────────────────────

export function HomePage() {
  const router = useRouter();
  const { token, user }   = useAuth();
  const { tier: ctxTier } = useTierContext();
  const greeting          = useGreeting();

  const tier: Tier  = ctxTier === 'pro' ? 'pro' : 'free';
  const userId      = user?.id ?? 'unknown';
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

  const ewmaRnd  = data?.ewma != null ? Math.round(data.ewma) : null;
  const hw       = useHawkins(ewmaRnd);
  const topPat   = data?.top_patterns?.[0] as any ?? null;
  const hi       = data?.last_human_insight ?? null;

  // ── Stat items for StatRow ────────────────────────────────────────────────
  const statItems = data
    ? [
        { label: 'Бичлэг',   value: data.entry_count },
        { label: 'Хэв маяг', value: data.top_patterns?.length ?? 0 },
        {
          label: 'EWMA',
          value: ewmaRnd ?? '—',
          colorClass: ewmaRnd != null
            ? ewmaRnd >= 200 ? 'text-green-600 dark:text-green-400' : 'text-orange-500'
            : undefined,
        },
      ]
    : [];

  return (
    <div className="w-full max-w-md mx-auto px-5 py-6 space-y-4 animate-in fade-in duration-500">

      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <SectionHeader
        accent={greeting}
        title="Тэмдэглэлийн дэвтэр"
      />

      {/* ── Emotion card ─────────────────────────────────────────────────── */}
      {loading ? (
        <SkeletonCard variant="block" className="h-[76px]" />
      ) : err ? (
        <div className="p-4 rounded-2xl border bg-destructive/10 text-destructive text-sm">{err}</div>
      ) : (
        <EmotionCard
          emotionKey={data?.dominant_emotion ?? null}
          entryCount={data?.entry_count}
          ewma={data?.ewma}
        />
      )}

      {/* ── Human insight / pattern card ─────────────────────────────────── */}
      {loading ? (
        <SkeletonCard variant="block" className="h-[100px]" />
      ) : hi ? (
        <HumanInsightCard
          insightText={hi.insight_text}
          acknowledged={hi.acknowledged}
        />
      ) : topPat ? (
        <PatternCard
          patternType={topPat.pattern_type}
          strengthScore={topPat.strength_score}
        />
      ) : null}

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      {!loading && data && <StatRow items={statItems} />}

      {/* ── Rate limit bar (free tier only) ──────────────────────────────── */}
      {!isPro && (
        <RateLimitBar
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
        />
      )}

      {/* ── Primary CTA ──────────────────────────────────────────────────── */}
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

      {/* ── Journal shortcut ─────────────────────────────────────────────── */}
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