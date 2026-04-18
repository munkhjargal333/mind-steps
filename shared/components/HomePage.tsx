'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, TrendingUp } from 'lucide-react';

import { useAuth } from '@/core/auth/AuthContext';
import { useRateLimit } from '@/shared/hooks/useRateLimit';
import { useTierContext } from '@/core/providers';
import { getTodaySnapshot } from '@/core/api';
import { cn } from '@/shared/lib/utils';
import type { TodaySnapshot, Tier, DominantEmotion, QuickActionType } from '@/core/api/types';

import { RateLimitBar } from './RateLimitBar';
import { useGreeting } from '@/shared/hooks/useDashboard';
import { ThoughtFlow } from '@/features/journal';
import { DailyLimitModal } from '@/features/home';

// ─── Style Constants ──────────────────────────────────────────────────────────
const HL_BASE  = 'highlight highlight-variant-2 highlight-blue-200 after:opacity-20 highlight-spread-md';
const HL_LABEL = 'highlight highlight-variant-1 highlight-sky-300 after:opacity-30';
const HL_BOLD  = 'highlight highlight-variant-20 highlight-amber-400';

// ─── Editorial Divider ────────────────────────────────────────────────────────

function EditorialDivider({ label, sideText }: { label: string; sideText?: string }) {
  return (
    <div className="relative flex items-center my-6">
      <div
        className="flex-none border px-3 py-1 z-10"
        style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
      >
        <span className={cn('text-[9px] font-bold tracking-[0.2em] uppercase font-mono', HL_BASE)}>
          {label}
        </span>
      </div>
      <div className="flex-grow h-[1px] absolute w-full" style={{ background: 'var(--border)' }} />
      {sideText && (
        <div className="ml-auto pl-3 z-10" style={{ background: 'var(--background)' }}>
          <span className="text-[9px] italic font-serif lowercase tracking-tight" style={{ color: 'var(--muted-foreground)' }}>
            {sideText}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Dominant Emotions — progress bars ───────────────────────────────────────

function EmotionSection({ emotions }: { emotions: DominantEmotion[] }) {
  if (!emotions.length) return null;
  const top = emotions.slice(0, 4);
  const max = top[0]?.percentage ?? 1;

  return (
    <div>
      <EditorialDivider label="Давамгай сэтгэл" sideText="өнөөдөр" />
      <div className="space-y-3">
        {top.map((e) => (
          <div key={e.emotion}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="font-serif text-sm italic" style={{ color: 'var(--foreground)' }}>
                {e.label_mn ?? e.emotion}
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
                {Math.round(e.percentage)}%
              </span>
            </div>
            <div className="w-full h-px relative" style={{ background: 'var(--border)' }}>
              <div
                className="absolute left-0 top-0 h-px transition-all duration-700"
                style={{
                  width: `${(e.percentage / max) * 100}%`,
                  background: 'var(--foreground)',
                  opacity: 0.35 + (e.percentage / max) * 0.65,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity ─────────────────────────────────────────────────────────────────

function ActivitySection({ data, onWrite }: { data: TodaySnapshot; onWrite: () => void }) {
  const score = Math.round(data.hawkins);

  return (
    <div>
      <EditorialDivider label="Үйл ажиллагаа" />
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-sm" style={{ color: 'var(--foreground)' }}>
          <span className="font-bold">{data.entry_count}</span>
          <span className="text-[10px] ml-1" style={{ color: 'var(--muted-foreground)' }}>бичлэг</span>
          <span className="mx-3" style={{ color: 'var(--border)' }}>·</span>
          <span className="font-bold">{data.pattern_type_count}</span>
          <span className="text-[10px] ml-1" style={{ color: 'var(--muted-foreground)' }}>зүй тогтол</span>
          <span className="mx-3" style={{ color: 'var(--border)' }}>·</span>
          <TrendingUp size={11} className="inline mb-0.5" style={{ color: 'var(--muted-foreground)' }} />
          <span className="font-bold ml-1">{score}</span>
        </p>
        <button
          onClick={onWrite}
          className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 border text-[10px] uppercase tracking-[0.15em] font-bold font-mono transition-all duration-150"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'transparent' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--foreground)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--background)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground)';
          }}
        >
          <Plus size={11} />
          Шинэ
        </button>
      </div>
    </div>
  );
}

// ─── Hawkins Window ───────────────────────────────────────────────────────────

function HawkinsWindow({ data }: { data: TodaySnapshot }) {
  const current = data.hawkins_current;
  if (!current) return null;

  return (
    <div>
      <EditorialDivider label="Ертөнийг харах цонх" sideText="Hawkins" />

      <h2 className="font-serif text-3xl italic leading-none mb-5" style={{ color: 'var(--foreground)' }}>
        {current.label_mn}
      </h2>

      <div className="space-y-4">
        {current.view_of_life && (
          <div>
            <span className={cn('block text-[8px] uppercase tracking-widest font-mono mb-1', HL_LABEL)}>
              Амьдралыг үзэхүй
            </span>
            <p className="font-serif text-sm italic leading-relaxed" style={{ color: 'var(--foreground)' }}>
              {current.view_of_life}
            </p>
          </div>
        )}
        {current.what_we_experience && (
          <div>
            <span className={cn('block text-[8px] uppercase tracking-widest font-mono mb-1', HL_LABEL)}>
              Бидний мэдрэхүй
            </span>
            <p className="font-serif text-sm italic leading-relaxed" style={{ color: 'var(--foreground)' }}>
              {current.what_we_experience}
            </p>
          </div>
        )}
        {current.transcend_key && (
          <div className="pl-4 py-2" style={{ borderLeft: '2px solid var(--border)' }}>
            <span className={cn('block text-[8px] uppercase tracking-widest font-mono mb-2', HL_BOLD)}>
              Даван туулах түлхүүр
            </span>
            <p className="font-serif text-[15px] italic leading-relaxed" style={{ color: 'var(--foreground)' }}>
              "{current.transcend_key}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard view ───────────────────────────────────────────────────────────

function DashboardView({
  data,
  loading,
  greeting,
  onWrite,
  tier,
  usageCount,
  limit,
  remaining,
  isLimited,
}: {
  data: TodaySnapshot | null;
  loading: boolean;
  greeting: string;
  onWrite: () => void;
  tier: Tier;
  usageCount: number;
  limit: number;
  remaining: number;
  isLimited: boolean;
}) {
  return (
    <div className="max-w-md mx-auto px-6 py-12 space-y-10">

      {/* Header */}
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-serif italic tracking-tighter" style={{ color: 'var(--foreground)' }}>
          {greeting}
        </h1>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          <span className={cn('text-[9px] uppercase tracking-[0.4em] font-bold', HL_BASE)}>
            Дотоод ертөнцийн архив
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
      </header>

      {loading && (
        <div className="h-40 flex items-center justify-center opacity-20">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      {!loading && data && (
        <>
          {data.dominant_emotions?.length > 0 && (
            <EmotionSection emotions={data.dominant_emotions} />
          )}
          <ActivitySection data={data} onWrite={onWrite} />
          <HawkinsWindow data={data} />
        </>
      )}

      {tier !== 'pro' && (
        <RateLimitBar
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
        />
      )}

      <footer className="text-center space-y-2 pt-4" style={{ opacity: 0.3 }}>
        <p className="text-[8px] uppercase tracking-[0.5em] font-mono" style={{ color: 'var(--muted-foreground)' }}>
          System // Active
        </p>
        <p className="text-[10px] font-serif italic" style={{ color: 'var(--muted-foreground)' }}>
          MindSteps v2.0
        </p>
      </footer>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { token, user } = useAuth();
  const { tier: ctxTier } = useTierContext();
  const greeting = useGreeting();

  const tier: Tier = ctxTier === 'pro' ? 'pro' : 'free';
  const isPro      = tier === 'pro';
  const userId     = user?.id ?? 'unknown';
  const { usageCount, limit, remaining, isLimited, increment } = useRateLimit(userId, tier);

  const [data, setData]           = useState<TodaySnapshot | null>(null);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState<'dashboard' | 'flow'>('dashboard');
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getTodaySnapshot(token)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  function handleWrite() {
    if (!isPro && isLimited) { setShowLimitModal(true); return; }
    setView('flow');
  }

  function handleFlowComplete() {
    if (!isPro) increment();
    setView('dashboard');
  }

  function handleFlowReset() {
    if (!isPro) increment();
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {view === 'dashboard' && (
        <DashboardView
          data={data}
          loading={loading}
          greeting={greeting}
          onWrite={handleWrite}
          tier={tier}
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
        />
      )}

      {view === 'flow' && (
        <ThoughtFlow
          onBack={() => setView('dashboard')}
          onComplete={handleFlowComplete}
          onReset={handleFlowReset} initialAction={'values'}        />
      )}

      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        userTier={tier}
        usageCount={usageCount}
        limit={limit}
      />
    </div>
  );
}