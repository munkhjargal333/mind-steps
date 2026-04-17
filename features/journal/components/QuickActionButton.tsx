'use client';

import { ArrowRight, Lock } from 'lucide-react';
import type { QuickActionType } from '@/core/api/types';
import { cn } from '@/shared/lib/utils';

interface QuickActionButtonProps {
  action: {
    type: QuickActionType;
    icon: any;
    label: string;
    sub: string;
    color: string;
    bg: string;
  };
  onSelect?: (type: QuickActionType) => void;
  onUpgrade?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
  showArrow?: boolean;
  className?: string;
}

export function QuickActionButton({ 
  action, 
  onSelect, 
  onUpgrade,
  disabled = false,
  variant = 'default',
  showArrow = true,
  className = ''
}: QuickActionButtonProps) {

  const Icon = action.icon;
  const isDisabled = disabled || !onSelect;

  // compact variant keeps old vertical layout
  if (variant === 'compact') {
    return (
      <button
        onClick={() => {
          if (isDisabled) { onUpgrade?.(); return; }
          onSelect?.(action.type);
        }}
        className={cn(
          'group flex flex-col items-center justify-center p-4 rounded-2xl text-center border transition-all min-h-[130px] relative overflow-hidden',
          !isDisabled && [action.bg, 'hover:border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.95]'],
          isDisabled && ['bg-muted/30 border-dashed border-border', 'opacity-60 grayscale', 'cursor-not-allowed'],
          className
        )}
      >
        {isDisabled && (
          <div className="absolute top-2.5 right-2.5">
            <div className="flex items-center gap-1 text-[10px] bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-1 rounded-full font-semibold border border-violet-200 dark:border-violet-800/40">
              <Lock size={9} /> Pro
            </div>
          </div>
        )}
        <div className={cn(
          'p-2.5 rounded-xl mb-2.5 transition-transform bg-white/90 dark:bg-black/20 shadow-sm',
          action.color,
          !isDisabled && 'group-hover:scale-110 group-hover:rotate-3'
        )}>
          <Icon size={20} />
        </div>
        <div className="space-y-0.5">
          <div className={cn('text-sm font-bold leading-tight', action.color)}>{action.label}</div>
          <div className="text-[10px] text-muted-foreground/80 leading-snug font-medium">{action.sub}</div>
        </div>
        <Icon size={36} className={cn('absolute -bottom-1.5 -right-1.5 opacity-5 rotate-12', action.color)} />
      </button>
    );
  }

  // default variant → horizontal list layout
  return (
    <button
      onClick={() => {
        if (isDisabled) { onUpgrade?.(); return; }
        onSelect?.(action.type);
      }}
      className={cn(
        'group relative flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl',
        'bg-card border border-border',
        'transition-all duration-150',
        // left accent border
        'border-l-4',
        !isDisabled && [
          'hover:shadow-sm hover:translate-x-0.5 hover:border-primary/30',
          'active:scale-[0.98]',
        ],
        isDisabled && [
          'opacity-55 grayscale cursor-not-allowed border-dashed',
        ],
        className
      )}
      style={!isDisabled ? { borderLeftColor: `var(${action.color.replace('text-[', '').replace(']', '')})` } : undefined}
    >
      {/* Icon container */}
      <div
        className={cn(
          'shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform',
          action.bg, action.color,
          !isDisabled && 'group-hover:scale-105'
        )}
      >
        <Icon size={20} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold leading-tight text-foreground">{action.label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{action.sub}</p>
      </div>

      {/* Right side */}
      {isDisabled ? (
        <div className="shrink-0 flex items-center gap-1 text-[10px] bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-1 rounded-full font-semibold border border-violet-200 dark:border-violet-800/40">
          <Lock size={9} /> Pro
        </div>
      ) : showArrow ? (
        <ArrowRight
          size={15}
          className="shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all"
        />
      ) : null}
    </button>
  );
}
