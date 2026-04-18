'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThoughtFlow } from '@/features/journal'
import { useRateLimit } from '@/shared/hooks/useRateLimit'
import { useAuth } from '@/core/auth/AuthContext'
import { useTierContext } from '@/core/providers'
import { DailyLimitModal } from '@/features/home'
import type { QuickActionType, Tier } from '@/core/api/types'

interface Props {
  mode: 'demo' | 'authed'
  onBack?: () => void
}

export function ActionContainer({ mode, onBack: onExternalBack }: Props) {
  const router = useRouter()
  const [showLimitModal, setShowLimitModal] = useState(false)

  const { user }          = useAuth()
  const { tier: ctxTier } = useTierContext()

  const tier: Tier = mode === 'demo' ? 'demo' : ctxTier === 'pro' ? 'pro' : 'free'
  const userId     = mode === 'demo' ? 'guest' : (user?.id ?? 'unknown')
  const isPro      = tier === 'pro'

  const { usageCount, limit, isLimited, increment } = useRateLimit(userId, tier)

  function handleSelectAction(type: QuickActionType): boolean {
    if (!isPro && isLimited) {
      setShowLimitModal(true)
      return false
    }
    if (!isPro) increment()
    return true
  }

  function handleUpgrade() {
    setShowLimitModal(false)
    router.push('/upgrade')
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ThoughtFlow
        onBack={onExternalBack}
        onSelectAction={handleSelectAction}
        onComplete={() => {}}
        onReset={() => {}}
      />

      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={handleUpgrade}
        userTier={tier}
        usageCount={usageCount}
        limit={limit}
      />
    </div>
  )
}