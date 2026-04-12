'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HomePage } from '@/shared/components/HomePage'
import { ThoughtFlow } from '@/features/journal'
import { useRateLimit } from '@/shared/hooks/useRateLimit'
import { useAuth } from '@/core/auth/AuthContext'
import { useTierContext } from '@/core/providers'
import type { QuickActionType } from '@/types'
import { DailyLimitModal } from '@/features/home'

type View = 'home' | 'flow'

export function HomeContainer() {
  const router = useRouter()
  const [view, setView] = useState<View>('home')
  const [selectedAction, setSelectedAction] = useState<QuickActionType | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)

  const { user } = useAuth()
  const { tier } = useTierContext()

  const userId = user?.id ?? 'guest'
  const userTier = tier === 'pro' ? 'pro' : tier === 'demo' ? 'demo' : 'free'

  const { usageCount, limit, remaining, isLimited, increment } = useRateLimit(userId, userTier)

  function handleSelectAction(type: QuickActionType) {
    if (userTier === 'pro') {
      setSelectedAction(type)
      setView('flow')
      return
    }

    if (isLimited) {
      setShowLimitModal(true)
      return
    }

    setSelectedAction(type)
    setView('flow')
  }

  function handleFlowComplete() {
    // Flow дууссан → increment + нүүр хуудас
    if (userTier !== 'pro') increment()
    setView('home')
    setSelectedAction(null)
  }

  function handleFlowReset() {
    if (userTier !== 'pro') increment()
  }

  function handleBack() {
    // Дунд нь гарвал тоолохгүй
    setView('home')
    setSelectedAction(null)
  }

  return (
    <>
      {view === 'home' && (
        <HomePage
          onSelectAction={handleSelectAction}
          usageCount={usageCount}
          limit={limit}
          remaining={remaining}
          isLimited={isLimited}
          tier={userTier}
        />
      )}

      {view === 'flow' && selectedAction && (
        <ThoughtFlow
          initialAction={selectedAction}
          onBack={handleBack}
          onComplete={handleFlowComplete}
          onReset={handleFlowReset}
        />
      )}

      <DailyLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        userTier={userTier}
        usageCount={usageCount}
        limit={limit}
      />
    </>
  )
}