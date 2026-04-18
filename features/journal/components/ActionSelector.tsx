'use client';

import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';

import { FREE_ACTIONS, PRO_ACTIONS } from '@/shared/constants';
import { RateLimitBar } from '@/shared/components/RateLimitBar';
import { cn } from '@/shared/lib/utils';

interface Props {
  onSelectAction: (type: any) => void;
  onUpgrade?: () => void;
  onBack?: () => void;
  usageCount: number;
  limit: number;
  remaining: number;
  isLimited: boolean;
  tier: 'demo' | 'free' | 'pro';
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
    <div className="w-full max-w-md mx-auto flex flex-col min-h-full bg-background text-foreground font-serif border-x-4 border-double border-border shadow-sm overflow-y-auto">
      
      {/* ── Rate Limit Section (The Notice Board) ── */}
      {!isPro && (
        <div className="px-5 py-4 border-b-2 border-foreground/20 bg-muted/30">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-70 italic text-center">
            — Daily Allowance Notice —
          </p>
          <RateLimitBar
            usageCount={usageCount}
            limit={limit}
            remaining={remaining}
            isLimited={isLimited}
          />
        </div>
      )}

      <div className="flex-1 px-5 py-8 space-y-10">
        
        {/* ── Section: Free Actions (The Daily Log) ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-2 border-foreground" />
            <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-foreground shrink-0">
              Асуудлын тэмдэглэл
            </h2>
            <div className="flex-1 border-t-2 border-foreground" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {FREE_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.type}
                  onClick={() => !isLimited && onSelectAction(a.type)}
                  disabled={isLimited}
                  className={cn(
                    'group relative flex items-center gap-4 w-full text-left p-4 transition-all duration-150',
                    'bg-card border-2 border-foreground/10 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]',
                    'hover:bg-muted hover:border-foreground active:translate-y-[1px] active:shadow-none',
                    isLimited && 'opacity-40 grayscale cursor-not-allowed',
                  )}
                >
                  <div className={cn('p-2.5 border border-foreground/20 bg-background', a.bg)}>
                    <Icon size={18} className={a.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold leading-tight tracking-tight uppercase">
                      {a.label}
                    </p>
                    <p className="text-[12px] text-muted-foreground leading-tight mt-1 italic font-medium">
                      {a.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Section: Pro Actions (The Deep Analysis) ── */}
        {!isDemo && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t-2 border-foreground" />
              <div className="flex items-center gap-2 px-2 py-1 bg-foreground text-background">
                 {!isPro && <Sparkles size={10} className="animate-pulse" />}
                 <h2 className="text-[11px] font-black tracking-[0.3em] uppercase">
                   Өсөлтийн тэмдэглэл
                 </h2>
              </div>
              <div className="flex-1 border-t-2 border-foreground" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {PRO_ACTIONS.slice(0, 4).map((a) => {
                const Icon = a.icon;
                const locked = !isPro;
                return (
                  <button
                    key={a.type}
                    onClick={() => isPro && onSelectAction(a.type)}
                    disabled={locked}
                    className={cn(
                      'group relative flex items-center gap-4 w-full text-left p-4 transition-all duration-150',
                      'bg-card border-2 border-foreground/10 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]',
                      locked
                        ? 'opacity-60 bg-muted/50 border-dashed cursor-not-allowed'
                        : 'hover:bg-muted hover:border-foreground active:translate-y-[1px]',
                    )}
                  >
                    <div className={cn('p-2.5 border border-foreground/20 bg-background', a.bg)}>
                      <Icon size={18} className={a.color} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-bold leading-tight tracking-tight uppercase">
                        {a.label}
                      </p>
                      <p className="text-[12px] text-muted-foreground leading-tight mt-1 italic">
                        {a.sub}
                      </p>
                    </div>
                    {locked && <Lock size={14} className="text-muted-foreground/40 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isFree && (
              <button
                onClick={onUpgrade}
                className="mt-2 w-full py-4 rounded-none border-2 border-dashed border-foreground/30 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                — Unlock Professional Insights —
              </button>
            )}
          </div>
        )}

        {/* Demo — Login Prompt (The Classified Ad) */}
        {isDemo && (
          <div className="p-6 border-4 border-double border-foreground bg-muted/20 text-center space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest">Илүү гүнзгийрүүлэх үү?</h3>
            <p className="text-xs italic text-muted-foreground">Бүх боломжийг ашиглахын тулд нэвтэрч орно уу.</p>
            <Link 
              href="/login" 
              className="inline-block px-6 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Нэвтрэх
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}