import { cn } from '@/shared/lib/utils'
import { Check, X } from 'lucide-react'

interface Feature {
  text: string
  ok: boolean
}

interface Plan {
  id: string
  label: string
  price: string
  sub: string
  color: string
  badge?: string
  description: string
  highlight?: string
  features: Feature[]
}

interface PricingCardProps {
  plan: Plan
  isCurrent: boolean
  onSelect?: () => void
  showTooltip?: boolean
  onToggleTooltip?: () => void
}

export function PricingCard({ 
  plan, 
  isCurrent, 
  onSelect,
  showTooltip = false,
  onToggleTooltip
}: PricingCardProps) {
  const isPro = plan.id === 'pro'

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-3.5 flex flex-col gap-2.5 transition-all',
        isPro
          ? 'border-violet-500/50 bg-violet-50/50 dark:bg-violet-950/20'
          : 'bg-card',
        isCurrent && 'ring-2 ring-orange-500'
      )}
    >
      {plan.badge ? (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span className="text-[9px] font-bold bg-violet-500 text-white px-2 py-0.5 rounded-full">
            {plan.badge}
          </span>
        </div>
      ) : null}

      {/* Price header */}
      <div>
        <p className={cn('text-xs font-bold', plan.color)}>{plan.label}</p>
        <p className="text-base font-black leading-tight">{plan.price}</p>
        <p className="text-[10px] text-muted-foreground">{plan.sub}</p>
      </div>

      <p className="text-[10px] text-muted-foreground leading-snug border-y py-2">
        {plan.description}
      </p>

      {plan.highlight ? (
        <p className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg px-2 py-1.5 font-medium leading-snug">
          {plan.highlight}
        </p>
      ) : null}

      {/* Features */}
      <ul className="space-y-1.5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-1.5">
            {f.ok
              ? <Check size={11} className="text-green-500 mt-0.5 shrink-0" />
              : <X     size={11} className="text-muted-foreground/40 mt-0.5 shrink-0" />
            }
            <span className={cn(
              'text-[10px] leading-tight',
              f.ok ? 'text-foreground' : 'text-muted-foreground/50'
            )}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isCurrent ? (
        <div className="text-center text-[10px] font-semibold text-orange-500 py-1">
          Одоогийн план
        </div>
      ) : isPro && onSelect ? (
        <div className="relative">
          <button
            onClick={onToggleTooltip}
            className="w-full py-2 rounded-xl bg-violet-500/60 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-violet-500/70 transition-colors"
          >
            Pro болох
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 z-10"
              onClick={onToggleTooltip}
            >
              <div className="bg-popover border rounded-xl px-3 py-2.5 shadow-lg text-center">
                <p className="text-[11px] font-semibold mb-0.5">Одоогоор боломжгүй байна.</p>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  QPay төлбөрийн систем одоохондоо тохируулагдаж байна. Та дараа дахин оролдоно уу
                </p>
              </div>
              {/* Arrow */}
              <div className="flex justify-center -mt-px">
                <div className="w-2.5 h-2.5 bg-popover border-b border-r rotate-45 -mt-1.5 shadow-sm" />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
