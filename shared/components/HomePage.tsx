'use client';

// shared/components/HomePage.tsx
// Dashboard home — шинэ /today API-д тохирсон хувилбар

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowRight, Sparkles, Brain } from 'lucide-react';

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

// ─── HawkinsCard ──────────────────────────────────────────────────────────────

function HawkinsCard({ data }: { data: TodaySnapshot }) {
  const current = data.hawkins_current;
  const target  = data.hawkins_target;

  if (!current) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border bg-muted/30">
        <Brain size={16} className="text-muted-foreground/50 shrink-0" />
        <p className="text-sm text-muted-foreground">Hawkins оноо хараахан үүсээгүй</p>
      </div>
    );
  }

  const color = current.color_hex ?? '#888';

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${color}30` }}
    >
      {/* Gradient accent header */}
      <div
        className="px-4 pt-4 pb-3"
        style={{ background: `linear-gradient(135deg, ${color}20 0%, transparent 70%)` }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Таны төлөв
          </p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${color}20`, color }}
          >
            Hawkins
          </span>
        </div>
        <p className="text-3xl font-bold" style={{ color }}>
          {current.level}
        </p>
        <p className="text-sm font-semibold mt-0.5" style={{ color }}>
          {current.label_mn}
        </p>
      </div>

      <div className="px-4 pb-4 space-y-3 bg-card">
        {/* Progress bar */}
        {target && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-muted-foreground">Дараагийн: {target.label_mn} ({target.level})</p>
              <p className="text-xs text-muted-foreground">{target.level - current.level} дутуу</p>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (current.level / target.level) * 100)}%`,
                  background: color,
                }}
              />
            </div>
          </div>
        )}

        {/* Transcend key */}
        {current.transcend_key && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl"
            style={{ background: `${color}12` }}
          >
            <Sparkles size={12} style={{ color }} className="mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed" style={{ color }}>
              {current.transcend_key}
            </p>
          </div>
        )}
      </div>
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
  const patternCount = data?.pattern_type_count;

  const statItems = data
    ? [
        { label: 'Бичлэг',         value: data.entry_count },
        { label: 'Паттерн',         value: patternCount ?? 0 },
        {
          label: 'Hawkins',
          value: hawkinsLevel ?? '—',
          colorClass:
            hawkinsLevel != null
              ? hawkinsLevel >= 200
                ? 'text-green-600 dark:text-green-400'
                : 'text-orange-500'
              : undefined,
          tooltip: 'David Hawkins-ийн сэтгэлийн оноо. 200-аас дээш = эерэг, доош = сөрөг энергийн орчин.',
        },
      ]
    : [];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-3 animate-in fade-in duration-500">

      {/* Greeting */}
      <SectionHeader accent={greeting} title="Тэмдэглэлийн дэвтэр" />

      {/* Stats pill row */}
      {loading ? (
        <SkeletonCard variant="block" className="h-9" />
      ) : (
        <StatRow items={statItems} />
      )}

      {/* Hawkins card */}
      {loading ? (
        <SkeletonCard variant="block" className="h-[160px]" />
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

      {/* CTA */}
      <button
        onClick={() => router.push('/write')}
        disabled={!canWrite}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm',
          'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]',
          'shadow-sm transition-all duration-150',
          !canWrite && 'opacity-50 cursor-not-allowed',
        )}
      >
        <Plus size={17} strokeWidth={2.5} />
        Тэмдэглэл нэмэх
      </button>

      <p className="text-[10px] text-center text-muted-foreground/30 pt-0.5">
        MindSteps v2.0 • Сэтгэл зүйн туслах
      </p>
    </div>
  );
}
