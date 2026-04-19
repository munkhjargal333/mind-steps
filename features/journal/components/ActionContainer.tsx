'use client'

import { useState } from 'react'
import { ActionSelector } from '../components/ActionSelector'
import { ThoughtFlow } from '@/features/journal'
import { useRateLimit } from '@/shared/hooks/useRateLimit'
import { useAuth } from '@/core/auth/AuthContext'
import { useTierContext } from '@/core/providers'
import { DailyLimitModal } from '@/features/home'
import type { QuickActionType, Tier } from '@/core/api/types'

type View = 'selector' | 'flow'

interface Props {
  mode: 'demo' | 'authed'
  onBack?: () => void
}

export function ActionContainer({ mode, onBack: onExternalBack }: Props) {
  const [view, setView]                     = useState<View>('selector')
  const [selectedAction, setSelectedAction] = useState<QuickActionType | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const { user }          = useAuth()
  const { tier: ctxTier } = useTierContext()

  const tier: Tier = mode === 'demo' ? 'demo' : ctxTier === 'pro' ? 'pro' : 'free'
  const userId     = mode === 'demo' ? 'guest' : (user?.id ?? 'unknown')
  const isPro      = tier === 'pro'

  const { usageCount, limit, remaining, isLimited, increment } = useRateLimit(userId, tier)

  function handleSelectAction(type: QuickActionType) {
    if (!isPro && isLimited) {
      setShowLimitModal(true)
      return
    }
    setSelectedAction(type)
    setView('flow')
  }

  // API амжилттай болсон үед л тоог нэмнэ
  function handleApiSuccess() {
    if (!isPro) increment()
  }

  // Дуусгах (complete) — dashboard-д буцна
  function handleFlowComplete(_didExpand: boolean) {
    setView('selector')
    setSelectedAction(null)
  }

  // Дахин хийх (reset) — selector рүү буцна, тоо нэмэхгүй
  function handleFlowReset() {
    setView('selector')
    setSelectedAction(null)
  }

  function handleBack() {
    if (view === 'selector') {
      onExternalBack?.()
      return
    }
    setView('selector')
    setSelectedAction(null)
  }

  return (
    <>
      {view === 'selector' && (
        <ActionSelector
          tier={tier}
          onSelectAction={handleSelectAction}
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
          onBack={onExternalBack}
        />
      )}

      {view === 'flow' && selectedAction && (
        <ThoughtFlow
          initialAction={selectedAction}
          onBack={handleBack}
          onComplete={handleFlowComplete}
          onReset={handleFlowReset}
          onApiSuccess={handleApiSuccess}
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
