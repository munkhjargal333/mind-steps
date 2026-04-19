'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTierContext } from '@/core/providers'
import {
  ArrowLeft, Check, X, QrCode, RefreshCw,
  Loader2, ShieldCheck, Zap, ChevronRight
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { AppLogo } from '@/shared/components/AppLogo'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import Link from 'next/link'

// ─────────────────────────────────────
// PLAN DATA
// ─────────────────────────────────────
const PLANS = [
  {
    id: 'demo',
    label: 'Demo',
    price: 'Үнэгүй',
    priceSub: '',
    tagline: 'Туршиж үзэх',
    description: '2 минутын дотор өөрийгөө ойлгож үзэх',
    features: [
      { text: '5 тэмдэглэл',          ok: true  },
      { text: 'AI шинжилгээ',          ok: true  },
      { text: 'Gemini AI 2.5',         ok: true  },
      { text: 'Түүх хадгалах',         ok: false },
      { text: 'Давтамж илрүүлэх',      ok: false },
      { text: 'Паттерн шинжилгээ',     ok: false },
      { text: 'Хувийн зөвлөгөө',       ok: false },
    ],
  },
  {
    id: 'free',
    label: 'Free',
    price: 'Үнэгүй',
    priceSub: '',
    tagline: 'Өдөр тутам',
    description: 'Өөрийгөө ажиглах зуршил үүсгэнэ',
    features: [
      { text: 'Өдөрт 7 тэмдэглэл',  ok: true  },
      { text: 'AI шинжилгээ',          ok: true  },
      { text: 'Gemini AI 2.5-pro',         ok: true  },
      { text: 'Түүх хадгалах',         ok: true  },
      { text: 'Давтамж илрүүлэх',      ok: true  },
      { text: 'Паттерн шинжилгээ',     ok: false },
      { text: 'Хувийн зөвлөгөө',       ok: false },
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '29,900₮',
    priceSub: '/ сард',
    tagline: 'Хязгааргүй',
    description: 'Дотоод өөрчлөлт эхлүүлэх гүн шинжилгээ',
    features: [
      { text: 'Хязгааргүй тэмдэглэл', ok: true  },
      { text: 'AI шинжилгээ',          ok: true  },
      { text: 'Gemini AI 3.0',         ok: true  },
      { text: 'Давтамж илрүүлэх',      ok: true  },
      { text: 'Өсөлт tracking',        ok: true  },
      { text: 'Паттерн шинжилгээ',     ok: true  },
      { text: 'Хувийн зөвлөгөө',       ok: true  },
    ],
  },
] as const

// Desktop comparison row labels
const FEATURE_LABELS = [
  'Өдөрт тэмдэглэл',
  'AI шинжилгээ',
  'AI загвар',
  'Түүх хадгалах',
  'Давтамж илрүүлэх',
  'Паттерн шинжилгээ',
  'Хувийн зөвлөгөө',
]

// Typed values for the comparison table
const TABLE_VALUES: Record<string, (string | boolean)[]> = {
  demo: ['3',          true,  'Gemini 2.5', false, false, false, false],
  free: ['3–5',        true,  'Gemini 2.5', true,  true,  false, false],
  pro:  ['Хязгааргүй', true,  'Gemini 3.0', true,  true,  true,  true ],
}

// ─────────────────────────────────────
// QPAY BOTTOM SHEET
// ─────────────────────────────────────
type PayState = 'loading' | 'qr' | 'checking' | 'success' | 'error'

function QPaySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [payState, setPayState] = useState<PayState>('loading')
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [qrImage,   setQrImage]   = useState<string | null>(null)
  const [bankUrls,  setBankUrls]  = useState<any[]>([])
  const [error,     setError]     = useState<string | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (open && !fetchedRef.current) {
      fetchedRef.current = true
      createInvoice()
    }
    if (!open) {
      fetchedRef.current = false
      setPayState('loading')
      setInvoiceId(null)
      setQrImage(null)
      setBankUrls([])
      setError(null)
    }
  }, [open])

  async function createInvoice() {
    setPayState('loading')
    setError(null)
    try {
      const res  = await fetch('/api/qpay/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Invoice үүсгэхэд алдаа гарлаа')
      setInvoiceId(data.invoice_id)
      setQrImage(data.qr_image)
      setBankUrls(data.urls ?? [])
      setPayState('qr')
    } catch (err: any) {
      setError(err.message)
      setPayState('error')
    }
  }

  async function checkPayment() {
    if (!invoiceId) return
    setPayState('checking')
    try {
      const res  = await fetch('/api/qpay/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId, plan: 'pro' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.paid) {
        setPayState('success')
        setTimeout(() => router.push('/home'), 2000)
      } else {
        setPayState('qr')
        setError('Төлбөр баталгаажаагүй байна. QPay аппаар шалгана уу.')
      }
    } catch (err: any) {
      setError(err.message)
      setPayState('qr')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Sheet panel */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t bg-card shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          'max-h-[90dvh] overflow-y-auto',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        {/* Drag handle */}
        <div className="sticky top-0 bg-card pt-3 pb-2 flex justify-center z-10">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-10 space-y-5">

          {/* Sheet header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <QrCode size={16} className="text-violet-500" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">QPay төлбөр</p>
                <p className="text-[11px] text-muted-foreground">Pro · 1 сар</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-violet-600 dark:text-violet-400">9,900₮</span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Success */}
          {payState === 'success' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-20 h-20 rounded-3xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ShieldCheck size={36} className="text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xl mb-1">Амжилттай!</p>
                <p className="text-sm text-muted-foreground">Pro план идэвхжлээ. Нүүр рүү шилжиж байна...</p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {payState === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <Loader2 size={32} className="text-violet-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Invoice үүсгэж байна...</p>
            </div>
          )}

          {/* Error */}
          {payState === 'error' && (
            <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-5 text-center space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              <button onClick={createInvoice} className="text-xs font-semibold text-red-500 underline underline-offset-4">
                Дахин оролдох
              </button>
            </div>
          )}

          {/* QR */}
          {payState === 'qr' && (
            <>
              {qrImage && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-3xl border shadow-md">
                    <img
                      src={`data:image/png;base64,${qrImage}`}
                      alt="QPay QR"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground">
                QPay аппаа нээж QR кодыг скан хийн төлнө үү
              </p>

              {error && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3">
                  <p className="text-xs text-center text-amber-700 dark:text-amber-300">{error}</p>
                </div>
              )}

              {bankUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {bankUrls.slice(0, 8).map((url, i) => (
                    <a
                      key={i}
                      href={url.link}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border bg-background hover:bg-muted active:scale-95 transition-all"
                    >
                      {url.logo && (
                        <img src={url.logo} alt={url.name} className="w-8 h-8 rounded-xl object-contain" />
                      )}
                      <span className="text-[9px] text-muted-foreground leading-tight text-center line-clamp-1">
                        {url.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Confirm button */}
          {(payState === 'qr' || payState === 'checking') && (
            <button
              onClick={checkPayment}
              disabled={payState === 'checking'}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-violet-500 hover:bg-violet-600 active:scale-[0.98] text-white font-bold transition-all disabled:opacity-60 text-sm"
            >
              {payState === 'checking'
                ? <><Loader2 size={16} className="animate-spin" />Шалгаж байна...</>
                : <><RefreshCw size={16} />Төлбөр шалгах</>
              }
            </button>
          )}

          <p className="text-[10px] text-center text-muted-foreground/40">
            QPay sandbox · Жинхэнэ төлбөр авахгүй
          </p>
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────
// UPGRADE PAGE
// ─────────────────────────────────────
export default function UpgradePage() {
  const router = useRouter()
  const { tier } = useTierContext()
  const [qpayOpen, setQpayOpen] = useState(false)

  const proPlan  = PLANS[2]
  const freePlans = PLANS.slice(0, 2)

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">

        {/* ── Sticky header ── */}
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
          <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Буцах</span>
            </button>
            <Link href="/" className="transition-opacity hover:opacity-80">
              <AppLogo />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="container max-w-3xl mx-auto px-4 py-8 md:py-12">

          {/* ── Title ── */}
          <div className="text-center mb-8 space-y-1.5">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Одоогийн план:{' '}
              <span className="text-primary font-semibold normal-case tracking-normal">{tier}</span>
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Планаа сонгох</h1>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━
              MOBILE LAYOUT
          ━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="md:hidden space-y-3">

            {/* Pro — large hero card */}
            <div className="relative rounded-3xl border-2 border-violet-400/60 bg-gradient-to-b from-violet-50/80 to-transparent dark:from-violet-950/40 dark:to-transparent overflow-hidden">
              {/* Top accent line */}
              <div className="h-1 w-full bg-gradient-to-r from-violet-400 via-violet-500 to-violet-400" />

              <div className="p-5">
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-500 bg-violet-100 dark:bg-violet-900/40 px-2.5 py-1 rounded-full">
                    <Zap size={9} />
                    Шилдэг
                  </span>
                  {tier === 'pro' && (
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Одоогийн план
                    </span>
                  )}
                </div>

                {/* Price row */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-0.5">Pro</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight">9,900₮</span>
                      <span className="text-xs text-muted-foreground mb-1">/ сард</span>
                    </div>
                  </div>
                  {tier !== 'pro' && (
                    <button
                      onClick={() => setQpayOpen(true)}
                      className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 active:scale-95 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-md shadow-violet-200 dark:shadow-violet-900/30 text-sm"
                    >
                      Pro болох
                      <ChevronRight size={15} />
                    </button>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{proPlan.description}</p>

                {/* Feature grid 2-col */}
                <div className="grid grid-cols-2 gap-2">
                  {proPlan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={12} className="text-green-500 shrink-0" />
                      <span className="text-xs text-foreground">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Demo & Free — side by side smaller */}
            <div className="grid grid-cols-2 gap-3">
              {freePlans.map((plan) => {
                const isCurrent = tier === plan.id
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'rounded-2xl border bg-card p-4 space-y-3',
                      isCurrent && 'ring-2 ring-primary'
                    )}
                  >
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{plan.label}</p>
                      <p className="text-xl font-black mt-0.5">{plan.price}</p>
                      <p className="text-[10px] text-muted-foreground">{plan.tagline}</p>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">{plan.description}</p>
                    {isCurrent ? (
                      <div className="text-[10px] font-semibold text-primary bg-primary/8 rounded-xl py-1.5 text-center">
                        Одоогийн план
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {plan.features.filter(f => f.ok).slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check size={10} className="text-green-500 shrink-0" />
                            <span className="text-[10px] text-muted-foreground">{f.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━
              DESKTOP LAYOUT — comparison table
          ━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="hidden md:block rounded-3xl border overflow-hidden">

            {/* Plan header row */}
            <div className="grid grid-cols-4 border-b">
              {/* Empty label col */}
              <div className="px-6 py-5 border-r bg-muted/20" />

              {PLANS.map((plan) => {
                const isCurrent = tier === plan.id
                const isPro = plan.id === 'pro'
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'px-5 py-5 border-r last:border-r-0 relative flex flex-col',
                      isPro && 'bg-violet-50/60 dark:bg-violet-950/25'
                    )}
                  >
                    {isPro && (
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-400 to-violet-500" />
                    )}
                    {isPro && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-violet-500 bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded-full w-fit mb-2">
                        <Zap size={8} /> Шилдэг
                      </span>
                    )}
                    <p className={cn('text-xs font-bold uppercase tracking-wider mb-1', isPro ? 'text-violet-500' : 'text-muted-foreground')}>
                      {plan.label}
                    </p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-xl font-black">{plan.price}</span>
                      {plan.priceSub && <span className="text-xs text-muted-foreground">{plan.priceSub}</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-4 leading-snug flex-1">{plan.description}</p>
                    {isCurrent ? (
                      <div className="text-[10px] font-semibold text-primary bg-primary/10 rounded-xl py-1.5 text-center">
                        Одоогийн план
                      </div>
                    ) : isPro ? (
                      <button
                        onClick={() => setQpayOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Pro болох
                      </button>
                    ) : null}
                  </div>
                )
              })}
            </div>

            {/* Feature rows */}
            {FEATURE_LABELS.map((label, fi) => (
              <div key={fi} className="grid grid-cols-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                <div className="px-6 py-3.5 text-sm text-muted-foreground border-r flex items-center">
                  {label}
                </div>
                {(['demo', 'free', 'pro'] as const).map((planId) => {
                  const val   = TABLE_VALUES[planId][fi]
                  const isPro = planId === 'pro'
                  return (
                    <div
                      key={planId}
                      className={cn(
                        'px-5 py-3.5 flex items-center justify-center border-r last:border-r-0',
                        isPro && 'bg-violet-50/40 dark:bg-violet-950/15'
                      )}
                    >
                      {typeof val === 'boolean' ? (
                        val
                          ? <Check size={15} className="text-green-500" />
                          : <X size={14} className="text-muted-foreground/25" />
                      ) : (
                        <span className={cn(
                          'text-xs font-medium',
                          isPro ? 'text-violet-600 dark:text-violet-400' : 'text-foreground/80'
                        )}>
                          {val}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* ── Trust strip ── */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
            {['QPay-р аюулгүй', 'Хэдийд ч цуцлах', 'Нуугдсан хураамжгүй'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={10} className="text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </main>
      </div>

      {/* QPay bottom sheet — outside main flow so it covers everything */}
      <QPaySheet open={qpayOpen} onClose={() => setQpayOpen(false)} />
    </>
  )
}