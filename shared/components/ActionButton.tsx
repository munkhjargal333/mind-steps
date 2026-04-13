// shared/components/ActionButton.tsx
// ─────────────────────────────────────────────────────────────────────────────
// ActionCard (journal, CSS module) + QuickActionButton (journal, Tailwind)
// хоёуланг нэгтгэсэн нэг дахин ашиглах боломжтой component.
//
// ХУУЧИН хэрэглээ:
//   <ActionCard label="..." locked ... />          → CSS module
//   <QuickActionButton action={...} variant="compact" /> → Tailwind
//
// ШИНЭ хэрэглээ:
//   <ActionButton action={cfg} onSelect={fn} />              → default grid card
//   <ActionButton action={cfg} variant="row" onSelect={fn} /> → horizontal list row
//   <ActionButton action={cfg} locked onUpgrade={fn} />
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ActionConfig } from '@/shared/constants';
import type { QuickActionType } from '@/core/api/types';

interface ActionButtonProps {
  action: ActionConfig;
  /** "card" (default) = vertical grid tile; "row" = horizontal list item */
  variant?: 'card' | 'row';
  locked?: boolean;
  onSelect?: (type: QuickActionType) => void;
  onUpgrade?: () => void;
  className?: string;
}

export function ActionButton({
  action,
  variant = 'card',
  locked = false,
  onSelect,
  onUpgrade,
  className,
}: ActionButtonProps) {
  const Icon = action.icon;
  const isDisabled = locked || !onSelect;

  function handleClick() {
    if (isDisabled) { onUpgrade?.(); return; }
    onSelect?.(action.type);
  }

  // ── ROW variant (хуучин ActionCard-ын layout) ──────────────────────────────
  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'group flex items-center gap-3 w-full px-4 py-3 rounded-2xl border transition-all text-left',
          isDisabled
            ? 'border-dashed border-border opacity-60 grayscale cursor-not-allowed'
            : [action.bg, 'hover:border-border hover:shadow-sm active:scale-[0.98]'],
          className,
        )}
      >
        <span
          className={cn(
            'shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-transform',
            !isDisabled && 'group-hover:scale-110 group-hover:rotate-3',
            action.color,
          )}
          style={{ background: 'rgba(255,255,255,0.7)' }}
        >
          <Icon size={18} />
        </span>

        <span className="flex-1 min-w-0">
          <span className={cn('block text-sm font-bold leading-tight', action.color)}>
            {action.label}
          </span>
          <span className="block text-[11px] text-muted-foreground/80 leading-snug mt-0.5">
            {action.sub}
          </span>
        </span>

        {isDisabled
          ? <Lock size={13} className="shrink-0 text-muted-foreground" />
          : <ChevronRight size={14} className="shrink-0 text-muted-foreground/40 group-hover:translate-x-0.5 transition-transform" />
        }
      </button>
    );
  }

  // ── CARD variant (хуучин QuickActionButton, variant="compact") ─────────────
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all text-center overflow-hidden min-h-[140px]',
        isDisabled
          ? 'bg-muted/30 border-dashed border-border opacity-60 grayscale cursor-not-allowed'
          : [action.bg, 'hover:border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.95]'],
        className,
      )}
    >
      {/* Lock badge */}
      {isDisabled && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
          <Lock size={10} />
          Pro
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          'p-2.5 rounded-xl mb-3 transition-transform shadow-sm',
          'bg-white/90 dark:bg-black/20',
          action.color,
          !isDisabled && 'group-hover:scale-110 group-hover:rotate-3',
        )}
      >
        <Icon size={22} />
      </div>

      {/* Label */}
      <div className="space-y-1">
        <div className={cn('text-sm font-bold leading-tight', action.color)}>
          {action.label}
        </div>
        <div className="text-[10px] text-muted-foreground/80 leading-snug font-medium">
          {action.sub}
        </div>
      </div>

      {/* Arrow — active үед л харагдана */}
      {!isDisabled && (
        <ArrowRight
          size={14}
          className="absolute bottom-5 right-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-1 transition-all"
        />
      )}

      {/* Background ghost icon */}
      <Icon
        size={40}
        className={cn('absolute -bottom-2 -right-2 opacity-5 rotate-12', action.color)}
      />
    </button>
  );
}