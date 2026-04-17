
import { Lock } from 'lucide-react';
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
  className = '',
}: QuickActionButtonProps) {
  const Icon = action.icon;
  const isDisabled = disabled || !onSelect;

  return (
    <button
      onClick={() => {
        if (isDisabled) {
          onUpgrade?.();
          return;
        }
        onSelect?.(action.type);
      }}
      className={cn(
        'group relative flex flex-col text-left transition-all duration-200 overflow-hidden',
        'rounded-2xl border',

        variant === 'default' && 'p-4 items-center justify-center text-center',
        variant === 'compact' && cn('p-4 min-h-[140px] items-start justify-between', className),

        // Active state
        !isDisabled && [
          action.bg,
          'border-transparent',
          'hover:shadow-sm hover:scale-[1.02] active:scale-[0.97]',
          'hover:border-current/10',
        ],

        // Disabled state
        isDisabled && [
          'bg-muted/20 border-dashed border-border/50',
          'opacity-50 grayscale cursor-not-allowed',
        ],
      )}
    >
      {/* Pro lock badge */}
      {isDisabled && (
        <div className="absolute top-2.5 right-2.5 group/lock z-10">
          <div className="flex items-center gap-1 text-[9px] font-semibold bg-background/80 backdrop-blur-sm text-foreground/60 px-2 py-1 rounded-full border border-border/60">
            <Lock size={8} strokeWidth={2.5} />
            Pro
          </div>
          <div className="pointer-events-none absolute top-full right-0 mt-1.5 w-36 rounded-xl bg-popover border border-border/60 px-2.5 py-2 text-[11px] leading-snug text-popover-foreground opacity-0 group-hover/lock:opacity-100 transition-opacity duration-150 shadow-sm z-50">
            <p className="font-medium mb-0.5">Pro онцлог</p>
            <p className="text-muted-foreground text-[10px]">Нэвтрэх боломжийг нээхийн тулд дарна уу</p>
          </div>
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          'rounded-xl transition-transform duration-200',
          variant === 'default' && 'p-2.5 mb-3',
          variant === 'compact' && 'p-2 mb-auto',
          'bg-background/50 dark:bg-black/20',
          action.color,
          !isDisabled && 'group-hover:scale-110 group-hover:-rotate-3',
        )}
      >
        <Icon size={variant === 'compact' ? 20 : 18} strokeWidth={1.75} />
      </div>

      {/* Label + sub */}
      <div className={cn('space-y-0.5', variant === 'default' && 'mt-0', variant === 'compact' && 'mt-3')}>
        <p
          className={cn(
            'font-semibold leading-tight',
            variant === 'default' ? 'text-[13px]' : 'text-[13px]',
            action.color,
          )}
        >
          {action.label}
        </p>
        <p className="text-[11px] text-muted-foreground/70 leading-snug">
          {action.sub}
        </p>
      </div>

      {/* Background ghost icon (compact only) */}
      {variant === 'compact' && (
        <Icon
          size={44}
          strokeWidth={1}
          className={cn(
            'absolute -bottom-3 -right-3 opacity-[0.06] rotate-12 pointer-events-none',
            action.color,
          )}
        />
      )}
    </button>
  );
}