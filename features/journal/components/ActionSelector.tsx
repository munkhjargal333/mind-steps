'use client';

import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';

import { FREE_ACTIONS, PRO_ACTIONS } from '@/shared/constants';
import { RateLimitBar } from '@/shared/components/RateLimitBar';
import { cn } from '@/shared/lib/utils';

interface Props {
  onSelectAction: (type: any) => void;
  onUpgrade?:     () => void;
  onBack?:        () => void;
  usageCount:     number;
  limit:          number;
  remaining:      number;
  isLimited:      boolean;
  tier:           'demo' | 'free' | 'pro';
}

export function ActionSelector({
  onSelectAction,
  onUpgrade,
  onBack,
  usageCount,
  limit,
  remaining,
  isLimited,
  tier,
}: Props) {
  const isDemo = tier === 'demo';
  const isPro  = tier === 'pro';
  const isFree = tier === 'free';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col min-h-full bg-background text-foreground font-serif border-x border-border shadow-sm overflow-y-auto">

      {/* ── Rate limit ── */}
      {!isPro && (
        <div className="px-5 py-4 border-b border-border bg-card">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground text-center mb-2">
            өдрийн хэмжээ
          </p>
          <RateLimitBar
            usageCount={usageCount}
            limit={limit}
            remaining={remaining}
            isLimited={isLimited}
          />
        </div>
      )}

      <div className="flex-1 px-5 py-7 space-y-8">

        {/* ── Free actions ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-[3px] border-double border-border" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground shrink-0 font-serif">
              Асуудлын тэмдэглэл
            </span>
            <div className="flex-1 border-t-[3px] border-double border-border" />
          </div>

          <div className="flex flex-col gap-2">
            {FREE_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.type}
                  onClick={() => !isLimited && onSelectAction(a.type)}
                  disabled={isLimited}
                  className={cn(
                    'group flex items-center gap-4 w-full text-left px-4 py-3 transition-all duration-150',
                    'bg-card border border-border rounded-sm',
                    'hover:bg-muted active:scale-[0.99]',
                    isLimited && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  <div className="p-2 border border-border/60 bg-background shrink-0">
                    <Icon size={16} className={a.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold leading-tight tracking-wide font-serif">
                      {a.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 italic">
                      {a.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Pro actions ── */}
        {!isDemo && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t-[3px] border-double border-border" />
              <div className="flex items-center gap-1.5 shrink-0">
                {!isPro && <Sparkles size={9} className="text-muted-foreground animate-pulse" />}
                <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground font-serif">
                  Өсөлтийн тэмдэглэл
                </span>
              </div>
              <div className="flex-1 border-t-[3px] border-double border-border" />
            </div>

            <div className="flex flex-col gap-2">
              {PRO_ACTIONS.slice(0, 4).map((a) => {
                const Icon  = a.icon;
                const locked = !isPro;
                return (
                  <button
                    key={a.type}
                    onClick={() => isPro && onSelectAction(a.type)}
                    disabled={locked}
                    className={cn(
                      'group flex items-center gap-4 w-full text-left px-4 py-3 transition-all duration-150',
                      'bg-card border border-border rounded-sm',
                      locked
                        ? 'opacity-50 border-dashed cursor-not-allowed'
                        : 'hover:bg-muted active:scale-[0.99]',
                    )}
                  >
                    <div className="p-2 border border-border/60 bg-background shrink-0">
                      <Icon size={16} className={a.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold leading-tight tracking-wide font-serif">
                        {a.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 italic">
                        {a.sub}
                      </p>
                    </div>
                    {locked && <Lock size={13} className="text-muted-foreground/40 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isFree && (
              <button
                onClick={onUpgrade}
                className={cn(
                  'mt-1 w-full py-3 rounded-sm border border-dashed border-border',
                  'text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-serif',
                  'hover:bg-muted hover:text-foreground transition-all',
                )}
              >
                бүх боломжийг нээх
              </button>
            )}
          </div>
        )}

        {/* ── Demo login prompt ── */}
        {isDemo && (
          <div className="p-5 border border-border rounded-sm bg-card text-center space-y-3">
            <p className="text-sm font-bold tracking-wide font-serif">Илүү гүнзгийрүүлэх үү?</p>
            <p className="text-xs text-muted-foreground italic font-serif">
              Бүх боломжийг ашиглахын тулд нэвтэрч орно уу.
            </p>
            <Link
              href="/login"
              className={cn(
                'inline-block px-5 py-2 bg-foreground text-background rounded-sm',
                'text-xs font-bold tracking-widest uppercase font-serif',
                'hover:opacity-90 transition-opacity',
              )}
            >
              Нэвтрэх
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}