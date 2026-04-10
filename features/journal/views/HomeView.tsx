'use client';

// features/journal/views/HomeView.tsx
// Main action grid shown on /home (authenticated) and /demo (public).
// Renders the quick-action cards that start the journal flow.

import { useThoughtContext } from '@/shared/providers/tier.provider';
import { useAuth } from '@/shared/providers/auth.provider';
import { ALL_ACTIONS } from '../data/actions';
import { cn } from '@/shared/lib/utils/utils';
import { Lock } from 'lucide-react';
import type { QuickActionType } from '../types';

interface HomeViewProps {
  demoMode?: boolean;
  onSelectAction?: (type: QuickActionType) => void;
}

export function HomeView({ demoMode = false, onSelectAction }: HomeViewProps) {
  const { tier } = useThoughtContext();
  const { user } = useAuth();

  const greeting = demoMode
    ? 'Туршиж үзэх'
    : `Сайн байна уу${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}`;

  const visibleActions = demoMode
    ? ALL_ACTIONS.filter((a) => a.tier === 'free')
    : ALL_ACTIONS;

  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8">
      {/* Greeting */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          {demoMode ? 'Demo горим' : 'Тавтай морил'}
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
        {demoMode && (
          <p className="text-sm text-muted-foreground">
            Бүртгэлгүйгээр туршиж үзнэ үү
          </p>
        )}
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-2 gap-3">
        {visibleActions.map((action) => {
          const Icon = action.icon;
          const locked = !demoMode && tier === 'demo' && action.tier === 'pro';

          return (
            <button
              key={action.type}
              onClick={() => !locked && onSelectAction?.(action.type)}
              disabled={locked}
              className={cn(
                'relative flex flex-col items-start gap-3 p-4 rounded-[2.5rem]',
                'border border-border transition-all duration-200 text-left',
                action.bg,
                locked
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              )}
            >
              {locked && (
                <Lock
                  size={12}
                  className="absolute top-3 right-3 text-muted-foreground"
                />
              )}
              <div className={cn('p-2 rounded-2xl', action.bg)}>
                <Icon size={18} className={action.color} />
              </div>
              <div>
                <p className={cn('text-sm font-semibold', action.color)}>
                  {action.label}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {action.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HomeViewSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto px-5 py-8 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-32 bg-muted rounded" />
        <div className="h-8 w-56 bg-muted rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 rounded-[2.5rem] bg-muted" />
        ))}
      </div>
    </div>
  );
}
