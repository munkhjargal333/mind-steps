import { cn } from '@/shared/lib/utils'
import { Check, X, Zap } from 'lucide-react'

export const PLANS = [
  {
    id: 'demo',
    label: 'Demo',
    price: 'Үнэгүй',
    sub: 'Туршиж үзэх',
    color: 'text-muted-foreground',
    badge: '',
    description: '2 минутын дотор өөрийгөө ойлгож үзэх',
    highlight: '',
    features: [
      { text: '3 хүртэлх тэмдэглэл',   ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ', ok: true  },
      { text: 'Gemini AI 2.5',           ok: true  },
      { text: 'Түүх хадгалах',           ok: false },
      { text: 'Давтамж илрүүлэх',        ok: false },
      { text: 'Паттерн шинжилгээ',       ok: false },
    ],
  },
  {
    id: 'free',
    label: 'Free',
    price: 'Үнэгүй',
    sub: 'Өдөр тутам',
    color: 'text-primary',
    badge: '',
    description: 'Өөрийгөө ажиглах зуршил үүсгэнэ',
    highlight: '',
    features: [
      { text: 'Өдөрт 3–5 тэмдэглэл',    ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ', ok: true  },
      { text: 'Gemini AI 2.5',           ok: true  },
      { text: 'Түүх хадгалах',           ok: true  },
      { text: 'Давтамж илрүүлэх',        ok: true  },
      { text: 'Өсөлт tracking',          ok: false },
      { text: 'Паттерн шинжилгээ',       ok: false },
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '9,900₮',
    sub: 'сард',
    color: 'text-violet-500',
    badge: 'Шилдэг',
    description: 'Өөрийгөө гүн ойлгож, дотоод өөрчлөлт эхлүүлнэ',
    highlight: 'Давтагддаг бодлуудаа олж харна',
    features: [
      { text: 'Хязгааргүй тэмдэглэл',   ok: true  },
      { text: 'Тэмдэглэлийн шинжилгээ', ok: true  },
      { text: 'Gemini AI 3.0',           ok: true  },
      { text: 'Давтамж илрүүлэх',        ok: true  },
      { text: 'Өсөлт tracking',          ok: true  },
      { text: 'Паттерн шинжилгээ',       ok: true  },
      { text: 'Зөвлөмж, зөвлөгөө',      ok: true  },
    ],
  },
] as const

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
  features: readonly Feature[]
}

interface PricingCardProps {
  plan: Plan
  isCurrent: boolean
  onSelect?: () => void
}

export function PricingCard({ plan, isCurrent, onSelect }: PricingCardProps) {
  const isPro = plan.id === 'pro'

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-4 flex flex-col gap-3 transition-all',
        isPro
          ? 'border-violet-400/60 bg-gradient-to-b from-violet-50/60 to-violet-50/20 dark:from-violet-950/30 dark:to-violet-950/10 shadow-sm shadow-violet-200/50 dark:shadow-violet-900/20'
          : 'bg-card hover:bg-muted/30',
        isCurrent && 'ring-2 ring-primary'
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-violet-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
            <Zap className="w-2.5 h-2.5" />
            {plan.badge}
          </span>
        </div>
      )}

      {/* Price header */}
      <div className="mt-1">
        <p className={cn('text-xs font-bold uppercase tracking-wider mb-0.5', plan.color)}>
          {plan.label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black">{plan.price}</span>
          {plan.id === 'pro' && (
            <span className="text-[10px] text-muted-foreground">{plan.sub}</span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[10px] text-muted-foreground leading-snug border-y border-dashed py-2.5">
        {plan.description}
      </p>

      {/* Highlight */}
      {plan.highlight && (
        <p className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl px-2.5 py-1.5 font-medium leading-snug">
          ✦ {plan.highlight}
        </p>
      )}

      {/* Features */}
      <ul className="space-y-1.5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-1.5">
            {f.ok
              ? <Check size={10} className="text-green-500 mt-0.5 shrink-0" />
              : <X size={10} className="text-muted-foreground/30 mt-0.5 shrink-0" />
            }
            <span className={cn(
              'text-[10px] leading-tight',
              f.ok ? 'text-foreground' : 'text-muted-foreground/40'
            )}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="pt-1">
        {isCurrent ? (
          <div className="text-center text-[10px] font-semibold text-primary py-2 bg-primary/8 rounded-xl">
            Одоогийн план
          </div>
        ) : isPro && onSelect ? (
          <button
            onClick={onSelect}
            className="w-full py-2 rounded-xl bg-violet-500 hover:bg-violet-600 active:scale-[0.98] text-white text-[11px] font-bold transition-all"
          >
            Pro болох
          </button>
        ) : null}
      </div>
    </div>
  )
}