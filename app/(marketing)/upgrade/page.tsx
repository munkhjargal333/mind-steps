'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useThoughtContext } from '@/contexts/context'
import { ArrowLeft, Info } from 'lucide-react'
import { PLANS } from '@/data/constants'
import { PricingCard } from '@/features/journal/components/upgrade/PricingCard'
import { QPayPayment } from '@/features/journal/components/upgrade/QPayPayment'

export default function UpgradePage() {
  const router = useRouter()
  const { tier } = useThoughtContext()
  
  const [showTooltip, setShowTooltip] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const handleUpgradeSuccess = () => {
    // Handle success state if needed
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-3 py-5">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-xl border bg-card hover:bg-muted transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-base font-bold leading-tight">Планаа сонгох</h1>
            <p className="text-[11px] text-muted-foreground">
              Одоогийн план: <span className="text-orange-500 font-semibold">{tier}</span>
            </p>
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PLANS.map((plan) => {
            const isCurrent = tier === plan.id
            
            return (
              <PricingCard
                key={plan.id}
                plan={plan}
                isCurrent={isCurrent}
                showTooltip={showTooltip && plan.id === 'pro'}
                onToggleTooltip={() => setShowTooltip(!showTooltip)}
              />
            )
          })}
        </div>

        {/* ── QPay Payment ── */}
        {showPayment && (
          <QPayPayment
            plan="pro"
            amount="9,900₮"
            onSuccess={handleUpgradeSuccess}
          />
        )}

        <p className="text-[10px] text-center text-muted-foreground/40 mt-6">
          QPay sandbox горимд ажиллаж байна • Жинхэнэ төлбөр авахгүй
        </p>
      </div>
    </div>
  )
}