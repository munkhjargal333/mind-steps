'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/core/auth/AuthContext';
import { useRateLimit } from '@/shared/hooks/useRateLimit';
import { useTierContext } from '@/core/providers';
import { getTodaySnapshot } from '@/core/api';
import { cn } from '@/shared/lib/utils';
import type { TodaySnapshot, Tier, DominantEmotion } from '@/core/api/types';

import { RateLimitBar } from './RateLimitBar';
import { useGreeting } from '@/shared/hooks/useDashboard';
import { DailyLimitModal } from '@/features/home';

// ─── Highlight constants ──────────────────────────────────────
const HL_SECTION = 'highlight highlight-variant-3 highlight-amber-400 after:opacity-30 highlight-spread-sm';
const HL_LABEL   = 'highlight highlight-variant-1 highlight-sky-300 after:opacity-30';
const HL_BOLD    = 'highlight highlight-variant-20 highlight-amber-400';

// ─── Editorial Divider ────────────────────────────────────────
function EditorialDivider({ label, sideText }: { label: string; sideText?: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 border-t-[3px] border-double border-border" />
      <span className={cn(
        'text-[10px] font-bold tracking-widest uppercase font-mono shrink-0 text-muted-foreground',
        HL_SECTION,
      )}>
        {label}
      </span>
      <div className="flex-1 border-t-[3px] border-double border-border" />
      {sideText && (
        <span className="text-[9px] italic font-mono lowercase tracking-tight text-muted-foreground shrink-0">
          {sideText}
        </span>
      )}
    </div>
  );
}

// ─── Dominant Emotions ────────────────────────────────────────
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
              <span className="font-mono text-sm italic text-foreground">
                {e.label_mn ?? e.emotion}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {Math.round(e.percentage)}%
              </span>
            </div>
            <div className="w-full h-px relative bg-border">
              <div
                className="absolute left-0 top-0 h-px bg-foreground transition-all duration-700"
                style={{
                  width: `${(e.percentage / max) * 100}%`,
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

function ActivitySection({
  data,
  onWrite,
  isLimited,
}: {
  data: TodaySnapshot;
  onWrite: () => void;
  isLimited: boolean;
}) {
  const score = Math.round(data.hawkins);

  return (
    <div>
      <EditorialDivider label="Үйл ажиллагаа" />

      <div className="flex flex-col gap-3">
        {/* 3 stat */}
        <div className="flex items-center justify-around font-mono text-sm text-foreground">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-base">{data.entry_count}</span>
            <span className="text-[10px] text-muted-foreground">бичлэг</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-base">{data.pattern_type_count}</span>
            <span className="text-[10px] text-muted-foreground">зүй тогтол</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="flex items-center gap-1 font-bold text-base">
              <TrendingUp size={12} className="text-muted-foreground" />
              {score}
            </span>
            <span className="text-[10px] text-muted-foreground">оноо</span>
          </div>
        </div>

        {/* Write button */}
        <button
          onClick={onWrite}
          disabled={isLimited}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-sm border font-mono',
            'text-xs font-bold tracking-wide transition-all duration-150',
            !isLimited
              ? 'bg-foreground text-background border-foreground hover:bg-foreground/90 active:scale-[0.98]'
              : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-60',
          )}
        >
          <Plus size={13} strokeWidth={2.5} />
          Тэмдэглэл нэмэх
        </button>
      </div>
    </div>
  );
}

// ─── Hawkins Window ───────────────────────────────────────────
function HawkinsWindow({ data }: { data: TodaySnapshot }) {
  const current = data.hawkins_current;
  if (!current) return null;

  return (
    <div>
      <EditorialDivider label="Ертөнийг харах өнцөг" sideText="Hawkins" />
      <h2 className="font-mono text-3xl italic leading-none mb-5 text-foreground">
        {current.label_mn}
      </h2>
      <div className="space-y-4">
        {current.view_of_life && (
          <div>
            <span className={cn('block text-[8px] uppercase tracking-widest font-mono mb-1', HL_LABEL)}>
              Амьдралыг үзэхүй
            </span>
            <p className="font-mono text-sm italic leading-relaxed text-foreground">
              {current.view_of_life}
            </p>
          </div>
        )}
        {current.what_we_experience && (
          <div>
            <span className={cn('block text-[8px] uppercase tracking-widest font-mono mb-1', HL_LABEL)}>
              Бидний мэдрэхүй
            </span>
            <p className="font-mono text-sm italic leading-relaxed text-foreground">
              {current.what_we_experience}
            </p>
          </div>
        )}
        {current.transcend_key && (
          <div className="pl-4 py-2 border-l-2 border-border">
            <span className={cn('block text-[8px] uppercase tracking-widest font-mono mb-2', HL_BOLD)}>
              Даван туулах түлхүүр
            </span>
            <p className="font-mono text-[15px] italic leading-relaxed text-foreground">
              "{current.transcend_key}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export function HomePage() {
  const router            = useRouter();
  const { token, user }   = useAuth();
  const { tier: ctxTier } = useTierContext();
  const greeting          = useGreeting();

  const tier: Tier = ctxTier === 'pro' ? 'pro' : 'free';
  const isPro      = tier === 'pro';
  const userId     = user?.id ?? 'unknown';
  const { usageCount, limit, remaining, isLimited } = useRateLimit(userId, tier);

  const [data, setData]                     = useState<TodaySnapshot | null>(null);
  const [loading, setLoading]               = useState(true);
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
    router.push('/write');
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-md mx-auto px-6 py-12 space-y-8">

        {/* ── Header ── */}
        <header className="space-y-3 text-center">
          <h1 className="text-4xl font-mono italic tracking-tighter text-foreground">
            {greeting}
          </h1>
        </header>

        {/* ── Rate limit bar ── */}
        {!isPro && (
          <RateLimitBar
            usageCount={usageCount}
            limit={limit}
            remaining={remaining}
            isLimited={isLimited}
          />
        )}

        {/* ── Dashboard data ── */}
        {loading && (
          <div className="h-40 flex items-center justify-center opacity-20">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}

        {!loading && data && (
          <>
            <HawkinsWindow data={data} />
            {data.dominant_emotions?.length > 0 && (
              <EmotionSection emotions={data.dominant_emotions} />
            )}
            <ActivitySection
              data={data}
              onWrite={handleWrite}
              isLimited={!isPro && isLimited}
            />
          </>
        )}
      </div>

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