'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-6">

      {/* Rate limit bar */}
      {!isPro && (
        <RateLimitBar
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
        />
      )}

      {/* ── Асуудлын тэмдэглэл (FREE) */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground px-1">
          Асуудлын тэмдэглэл
        </p>
        <div className="flex flex-col gap-2">
          {FREE_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.type}
                onClick={() => !isLimited && onSelectAction(a.type)}
                disabled={isLimited}
                className={cn(
                  'group flex items-center gap-3 w-full text-left',
                  'px-4 py-3.5 rounded-2xl border transition-all duration-150',
                  'border-border/50 bg-card hover:bg-muted/60 active:scale-[0.99]',
                  isLimited && 'opacity-40 cursor-not-allowed',
                )}
              >
                <div className={cn('p-2 rounded-xl shrink-0', a.bg)}>
                  <Icon size={16} className={a.color} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{a.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{a.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Өсөлтийн тэмдэглэл (PRO) */}
      {!isDemo && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-1">
            {!isPro && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground tracking-wider">
                Pro
              </span>
            )}
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
              Өсөлтийн тэмдэглэл
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {PRO_ACTIONS.slice(0, 4).map((a) => {
              const Icon = a.icon;
              const locked = !isPro;
              return (
                <button
                  key={a.type}
                  onClick={() => isPro && onSelectAction(a.type)}
                  disabled={locked}
                  className={cn(
                    'group flex items-center gap-3 w-full text-left',
                    'px-4 py-3.5 rounded-2xl border transition-all duration-150',
                    'border-border/50 bg-card',
                    locked
                      ? 'opacity-50 grayscale-[0.4] cursor-not-allowed'
                      : 'hover:bg-muted/60 active:scale-[0.99]',
                  )}
                >
                  <div className={cn('p-2 rounded-xl shrink-0', a.bg)}>
                    <Icon size={16} className={a.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">{a.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{a.sub}</p>
                  </div>
                  {locked && <Lock size={13} className="text-muted-foreground/40 shrink-0" />}
                </button>
              );
            })}
          </div>
          {isFree && (
            <button
              onClick={onUpgrade}
              className="mt-1 w-full py-2.5 rounded-2xl border border-dashed border-border/60 text-xs text-muted-foreground hover:bg-muted/40 transition-colors"
            >
              Pro болж нээх →
            </button>
          )}
        </div>
      )}

      {/* Demo — login prompt */}
      {isDemo && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-muted/30 border border-border/40">
          <div>
            <p className="text-sm font-medium">Илүү гүнзгийрүүлэх үү?</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Нэвтэрч бүх боломжийг ашигла</p>
          </div>
          <Link href="/login" className="text-xs font-semibold text-[color:var(--color-tier-pro,theme(colors.violet.500))]">
            Нэвтрэх
          </Link>
        </div>
      )}

      <p className="text-[10px] text-center text-muted-foreground/30 -mt-2">
        MindSteps v1.0 • Сэтгэл зүйн туслах
      </p>
    </div>
  );
}