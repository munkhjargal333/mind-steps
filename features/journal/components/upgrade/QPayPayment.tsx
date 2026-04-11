'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, RefreshCw, Loader2, ShieldCheck, Info } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

type PayState = 'idle' | 'loading' | 'qr' | 'checking' | 'success' | 'error'

interface QPayPaymentProps {
  plan: string
  amount: string
  onSuccess?: () => void
}

export function QPayPayment({ plan, amount, onSuccess }: QPayPaymentProps) {
  const router = useRouter()
  
  const [payState, setPayState] = useState<PayState>('loading')
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [qrText, setQrText] = useState<string | null>(null)
  const [bankUrls, setBankUrls] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleCreateInvoice() {
    setPayState('loading')
    setError(null)
    try {
      const res = await fetch('/api/qpay/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Invoice үүсгэхэд алдаа гарлаа')
      setInvoiceId(data.invoice_id)
      setQrImage(data.qr_image)
      setQrText(data.qr_text)
      setBankUrls(data.urls ?? [])
      setPayState('qr')
    } catch (err: any) {
      setError(err.message)
      setPayState('error')
    }
  }

  async function handleCheckPayment() {
    if (!invoiceId) return
    setPayState('checking')
    try {
      const res = await fetch('/api/qpay/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId, plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.paid) {
        setPayState('success')
        onSuccess?.()
        setTimeout(() => router.push('/home'), 2000)
      } else {
        setPayState('qr')
        setError('Төлбөр баталгаажаагүй байна. Та QPay аппаар шалгана уу.')
      }
    } catch (err: any) {
      setError(err.message)
      setPayState('qr')
    }
  }

  // Auto-create invoice on mount
  useState(() => {
    handleCreateInvoice()
  })

  if (payState === 'success') {
    return (
      <div className="rounded-2xl border bg-card p-5 space-y-4 mt-4 animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <ShieldCheck size={28} className="text-green-500" />
          </div>
          <p className="font-bold">Амжилттай!</p>
          <p className="text-xs text-muted-foreground text-center">
            Pro план идэвхжлээ. Нүүр хуудас руу шилжиж байна...
          </p>
        </div>
      </div>
    )
  }

  if (payState === 'error') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-center space-y-2 mt-4">
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => { setPayState('idle'); setError(null) }}
          className="text-xs text-muted-foreground underline"
        >
          Дахин оролдох
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-card p-5 space-y-4 mt-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <QrCode size={16} className="text-violet-500" />
        <p className="font-semibold text-sm">QPay-р төлөх</p>
        <span className="ml-auto text-xs text-muted-foreground">{amount}</span>
      </div>

      {qrImage && (
        <div className="flex justify-center">
          <div className="p-3 bg-white rounded-2xl border">
            <img
              src={`data:image/png;base64,${qrImage}`}
              alt="QPay QR"
              className="w-40 h-40 object-contain"
            />
          </div>
        </div>
      )}

      <p className="text-[11px] text-center text-muted-foreground">
        QPay аппаа нээж QR кодыг скан хийн төлнө үү
      </p>

      {error && (
        <p className="text-[11px] text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl py-2 px-3">
          {error}
        </p>
      )}

      {bankUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {bankUrls.slice(0, 6).map((url, i) => (
            <a
              key={i}
              href={url.link}
              className="flex flex-col items-center gap-1 p-2 rounded-xl border hover:bg-muted transition-colors text-center"
            >
              {url.logo && (
                <img src={url.logo} alt={url.name} className="w-7 h-7 rounded-lg object-contain" />
              )}
              <span className="text-[9px] text-muted-foreground leading-tight">{url.name}</span>
            </a>
          ))}
        </div>
      )}

      <button
        onClick={handleCheckPayment}
        disabled={payState === 'checking'}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors disabled:opacity-60"
      >
        {payState === 'checking'
          ? <Loader2 size={15} className="animate-spin" />
          : <RefreshCw size={15} />
        }
        {payState === 'checking' ? 'Шалгаж байна...' : 'Төлбөр шалгах'}
      </button>
    </div>
  )
}
