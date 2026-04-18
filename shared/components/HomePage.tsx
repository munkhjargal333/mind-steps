'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowDown, Loader2 } from 'lucide-react';

import { useAuth } from '@/core/auth/AuthContext';
import { useRateLimit } from '@/shared/hooks/useRateLimit';
import { useTierContext } from '@/core/providers';
import { getTodaySnapshot } from '@/core/api';
import { cn } from '@/shared/lib/utils';
import type { TodaySnapshot, Tier } from '@/core/api/types';

import { RateLimitBar } from './RateLimitBar';
import { useGreeting } from '@/shared/hooks/useDashboard';

// ─── Editorial Divider ────────────────────────────────────────────────────────

function EditorialDivider({ label, sideText }: { label: string; sideText?: string }) {
  return (
    <div className="relative flex items-center my-8">
      <div
        className="flex-none border px-3 py-1 z-10"
        style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
      >
        <span
          className="text-[9px] font-bold tracking-[0.2em] uppercase font-mono"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {label}
        </span>
      </div>
      <div
        className="flex-grow h-[1px] absolute w-full"
        style={{ background: 'var(--border)' }}
      />
      {sideText && (
        <div className="ml-auto pl-3 z-10" style={{ background: 'var(--background)' }}>
          <span
            className="text-[9px] italic font-serif lowercase tracking-tight"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {sideText}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Hawkins State Detail ─────────────────────────────────────────────────────

function HawkinsStateDetail({
  state,
  type,
}: {
  state: any;
  type: 'current' | 'target';
}) {
  const isTarget = type === 'target';

  return (
    <div className={cn('space-y-6', isTarget && 'opacity-60')}>
      <div
        className="flex justify-between items-baseline gap-4 pb-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="space-y-1">
          <p
            className="text-[9px] uppercase tracking-[0.2em] font-mono"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {isTarget ? 'Хүрэх цэг' : 'Одоогийн төлөв'}
          </p>
          <h2
            className={cn(
              'font-serif italic leading-none',
              isTarget ? 'text-2xl' : 'text-3xl',
            )}
            style={{ color: isTarget ? 'var(--muted-foreground)' : 'var(--foreground)' }}
          >
            {state.label_mn}
          </h2>
        </div>
        <div className="text-right">
          <p
            className="text-[9px] uppercase tracking-widest font-mono mb-1"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Үелзэл
          </p>
          <p className="text-lg font-serif italic" style={{ color: 'var(--muted-foreground)' }}>
            {state.level}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {state.state_of_consciousness && (
          <div>
            <span
              className="block text-[8px] uppercase tracking-widest font-mono mb-1"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Ухамсрын төлөв
            </span>
            <span className="text-[13px] font-serif" style={{ color: 'var(--foreground)' }}>
              {state.state_of_consciousness}
            </span>
          </div>
        )}
        {state.view_of_life && (
          <div>
            <span
              className="block text-[8px] uppercase tracking-widest font-mono mb-1"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Амьдралыг үзэхүй
            </span>
            <span className="text-[13px] font-serif" style={{ color: 'var(--foreground)' }}>
              {state.view_of_life}
            </span>
          </div>
        )}
        {state.what_we_experience && (
          <div className="col-span-2">
            <span
              className="block text-[8px] uppercase tracking-widest font-mono mb-1"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Бидний мэдрэхүй
            </span>
            <span className="text-[13px] font-serif" style={{ color: 'var(--foreground)' }}>
              {state.what_we_experience}
            </span>
          </div>
        )}
      </div>

      {state.transcend_key && (
        <div
          className="pl-4 py-1 mt-2"
          style={{ borderLeft: '1px solid var(--border)' }}
        >
          <span
            className="block text-[8px] uppercase tracking-widest font-mono mb-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Даван туулах түлхүүр
          </span>
          <p
            className="text-[15px] leading-relaxed font-serif italic"
            style={{ color: 'var(--foreground)' }}
          >
            "{state.transcend_key}"
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Hawkins Editorial Card ───────────────────────────────────────────────────

function HawkinsEditorialCard({ data }: { data: TodaySnapshot }) {
  const current = data.hawkins_current;
  const target = data.hawkins_target;

  if (!current) return null;

  return (
    <div className="space-y-8">
      <EditorialDivider label="Сэтгэл зүйн шинжилгээ" sideText="Hawkins Map" />

      <HawkinsStateDetail state={current} type="current" />

      {target && (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="px-4 border rounded-full z-10 p-2"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <ArrowDown size={14} style={{ color: 'var(--muted-foreground)' }} />
            </div>
          </div>
          <div
            className="h-[1px] w-full overflow-hidden relative"
            style={{ background: 'var(--border)' }}
          >
            <div
              className="absolute left-0 top-0 h-full transition-all duration-1000"
              style={{
                width: `${(current.level / target.level) * 100}%`,
                background: 'var(--muted-foreground)',
              }}
            />
          </div>
        </div>
      )}

      {target && <HawkinsStateDetail state={target} type="target" />}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function HomePage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { tier: ctxTier } = useTierContext();
  const greeting = useGreeting();

  const tier: Tier = ctxTier === 'pro' ? 'pro' : 'free';
  const userId = user?.id ?? 'unknown';
  const { usageCount, limit, remaining, isLimited } = useRateLimit(userId, tier);

  const [data, setData] = useState<TodaySnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getTodaySnapshot(token)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const canWrite = tier === 'pro' || !isLimited;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="max-w-md mx-auto px-6 py-12 space-y-12">

        {/* 1. Header */}
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-serif italic tracking-tighter" style={{ color: 'var(--foreground)' }}>
            {greeting}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span
              className="text-[9px] uppercase tracking-[0.4em] font-bold"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Дотоод ертөнцийн архив
            </span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>
        </header>

        {/* 2. Stat Row */}
        {!loading && data && (
          <div
            className="grid grid-cols-3 py-4"
            style={{
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Бичлэг',    value: data.entry_count },
              { label: 'Зүй тогтол', value: data.pattern_type_count },
              { label: 'Хокинс',    value: Math.round(data.hawkins), italic: true },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center px-2"
                style={i > 0 ? { borderLeft: '1px solid var(--border)' } : undefined}
              >
                <p
                  className="text-[8px] uppercase tracking-widest font-mono mb-1"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {stat.label}
                </p>
                <p
                  className={cn('text-lg font-serif', stat.italic && 'italic')}
                  style={{ color: 'var(--foreground)' }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 3. Hawkins Editorial */}
        {loading ? (
          <div className="h-40 flex items-center justify-center opacity-20">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : data ? (
          <HawkinsEditorialCard data={data} />
        ) : null}

        {/* 4. Rate Limit */}
        {tier !== 'pro' && (
          <div className="pt-4">
            <RateLimitBar
              usageCount={usageCount}
              limit={limit}
              remaining={remaining}
              isLimited={isLimited}
            />
          </div>
        )}

        {/* 5. CTA Button */}
        <div className="pt-8">
          <button
            onClick={() => router.push('/write')}
            disabled={!canWrite}
            className={cn(
              'w-full py-4 border bg-transparent transition-all duration-300',
              'text-[10px] uppercase tracking-[0.3em] font-bold',
              'flex items-center justify-center gap-3',
              !canWrite && 'opacity-30 cursor-not-allowed',
            )}
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
            onMouseEnter={(e) => {
              if (canWrite) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-tint-primary)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            }}
          >
            <Plus size={14} style={{ color: 'var(--muted-foreground)' }} />
            Шинэ тэмдэглэл бичих
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center space-y-2 pt-4" style={{ opacity: 0.3 }}>
          <p
            className="text-[8px] uppercase tracking-[0.5em] font-mono"
            style={{ color: 'var(--muted-foreground)' }}
          >
            System // Active
          </p>
          <p className="text-[10px] font-serif italic" style={{ color: 'var(--muted-foreground)' }}>
            MindSteps v2.0
          </p>
        </footer>
      </div>
    </div>
  );
}