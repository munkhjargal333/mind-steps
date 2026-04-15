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

  const variants = {
    default: {
      button: "group relative flex flex-col items-center justify-center p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-border shadow-sm transition-all text-center overflow-hidden",
      iconContainer: `p-2.5 rounded-xl mb-3 transition-transform ${action.bg} ${action.color}`,
      iconSize: 20,
      label: "font-bold text-sm leading-tight",
      sub: "text-[11px] text-muted-foreground mt-1 leading-snug"
    },
    compact: {
      button: `group flex flex-col items-center justify-center p-4 rounded-3xl text-center border transition-all min-h-[140px] relative overflow-hidden ${className}`,
      iconContainer: `p-2.5 rounded-xl mb-3 transition-transform bg-white/90 dark:bg-black/20 ${action.color} shadow-sm`,
      iconSize: 22,
      label: `text-sm font-bold leading-tight ${action.color}`,
      sub: "text-[10px] text-muted-foreground/80 leading-snug font-medium"
    }
  };

  const style = variants[variant];

  return (
    <button
      onClick={() => {
        if (isDisabled) {
          onUpgrade?.()
          return
        }
        onSelect?.(action.type)
      }}
      className={cn(
        style.button,

        // 🎨 ACTIVE
        !isDisabled && [
          action.bg,
          'hover:border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.95]'
        ],

        // 🔒 DISABLED
        isDisabled && [
          'bg-muted/30 border-dashed border-border',
          'opacity-60 grayscale',
          'cursor-not-allowed'
        ]
      )}
    >
      {/* 🔒 LOCK BADGE — hover-т upgrade tooltip */}
      {isDisabled && (
        <div className="absolute top-3 right-3 group/lock">
          <div className="flex items-center gap-1 text-[10px] bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-1 rounded-full font-semibold border border-violet-200 dark:border-violet-800/40 cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-800/40 transition-colors">
            <Lock size={10} />
            Pro
          </div>
          {/* Upgrade tooltip */}
          <div className="pointer-events-none absolute top-full right-0 mt-1.5 w-36 rounded-xl bg-foreground px-2.5 py-2 text-[10px] leading-snug text-background opacity-0 group-hover/lock:opacity-100 transition-opacity duration-150 shadow-lg z-50">
            <p className="font-semibold mb-0.5">Pro онцлог</p>
            <p className="opacity-70">Нэвтрэх боломжийг нээхийн тулд дарна уу</p>
          </div>
        </div>
      )}

      <div className={cn(
        style.iconContainer,
        !isDisabled && 'group-hover:scale-110 group-hover:rotate-3'
      )}>
        <Icon size={style.iconSize} />
      </div>
      
      <div className="space-y-1">
        <div className={style.label}>
          {action.label}
        </div>
        <div className={style.sub}>
          {action.sub}
        </div>
      </div>

      {/* 👉 Arrow зөвхөн active үед */}
      {showArrow && !isDisabled && (
        <ArrowRight
          size={14}
          className="absolute bottom-5 right-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all"
        />
      )}

      {/* background icon */}
      {variant === 'compact' && (
        <Icon
          size={40}
          className={cn(
            "absolute -bottom-2 -right-2 opacity-5 rotate-12",
            action.color
          )}
        />
      )}
    </button>
  );
}