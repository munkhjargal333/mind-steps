'use client'

import { useState } from 'react'
import { ActionSelector } from '@/shared/components/ActionSelector'
import { ThoughtFlow } from '@/features/journal'
import { useRateLimit } from '@/shared/hooks/useRateLimit'
import { useAuth } from '@/core/auth/AuthContext'
import { useTierContext } from '@/core/providers'
import { DailyLimitModal } from '@/features/home'
import type { QuickActionType, Tier } from '@/core/api/types'

type View = 'home' | 'flow'

interface Props {
  mode: 'demo' | 'authed'
  onBack?: () => void  // гадна view рүү буцах (жишээ: home page)
}

export function ActionContainer({ mode, onBack: onExternalBack }: Props) {
  const [view, setView]                     = useState<View>('home')
  const [selectedAction, setSelectedAction] = useState<QuickActionType | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  // authed mode-д л context шаардлагатай
  const { user }  = useAuth()
  const { tier: ctxTier } = useTierContext()

  const tier: Tier   = mode === 'demo' ? 'demo' : ctxTier === 'pro' ? 'pro' : 'free'
  const userId       = mode === 'demo' ? 'guest' : (user?.id ?? 'unknown')
  const isPro        = tier === 'pro'

  const { usageCount, limit, remaining, isLimited, increment } = useRateLimit(userId, tier)

  function handleSelectAction(type: QuickActionType) {
    if (!isPro && isLimited) {
      setShowLimitModal(true)
      return
    }
    setSelectedAction(type)
    setView('flow')
  }

  function handleFlowComplete() {
    if (!isPro) increment()
    setView('home')
    setSelectedAction(null)
  }

  function handleBack() {
    if (view === 'home' && onExternalBack) {
      onExternalBack()
      return
    }
    setView('home')
    setSelectedAction(null)
  }

  return (
    <>
      {view === 'home' && (
        <ActionSelector
          tier={tier}
          onSelectAction={handleSelectAction}
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
        />
      )}

      {view === 'flow' && selectedAction && (
        <ThoughtFlow
          initialAction={selectedAction}
          onBack={handleBack}
          onComplete={handleFlowComplete}
          onReset={() => { if (!isPro) increment() }}
        />
      )}

      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        userTier={tier}
        usageCount={usageCount}
        limit={limit}
      />
    </>
  )
}