'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/core/auth/AuthContext'
import { MainHeader } from '@/shared/components/MainHeader'
import { LoginForm } from './components/LoginForm'
import { SocialLogin } from './components/SocialLogin'
import { DemoLogin } from './components/DemoLogin'
import { LoginErrorAlert } from './components/LoginErrorAlert'
import { cn } from '@/shared/lib/utils'

const HL_SECTION = 'highlight highlight-variant-13 highlight-violet-300 after:opacity-30 highlight-spread-lg';

function LoginPageContent() {
  const [displayError, setDisplayError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const urlMessage   = searchParams.get('message')
  const { error, clearError } = useAuth()

  useEffect(() => {
    if (urlMessage) setDisplayError(decodeURIComponent(urlMessage))
    else if (error)  setDisplayError(error)
  }, [urlMessage, error])

  const handleErrorDismiss = () => {
    setDisplayError(null)
    clearError()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <MainHeader />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm bg-card border border-border rounded-sm shadow-sm">

          {/* Title */}
          <div className="px-6 pt-6 pb-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t-[3px] border-double border-border" />
              <span className={cn(
                'text-xl font-bold tracking-widest uppercase font-mono shrink-0 text-muted-foreground',
                HL_SECTION,
              )}>
                Нэвтрэх
              </span>
              <div className="flex-1 border-t-[3px] border-double border-border" />
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            {displayError && (
              <LoginErrorAlert error={displayError} onDismiss={handleErrorDismiss} />
            )}

            <LoginForm onError={setDisplayError} />

            {/* Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                  Эсвэл
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <SocialLogin onError={setDisplayError} />
              <DemoLogin />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-border text-center">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.15em] leading-relaxed">
              Нэвтрэх товчийг дарснаар манай{' '}
              <Link href="/terms" className="text-foreground underline decoration-border underline-offset-4 hover:text-foreground transition-colors">
                Нөхцөл
              </Link>
              {' '}болон{' '}
              <Link href="/privacy" className="text-foreground underline decoration-border underline-offset-4 hover:text-foreground transition-colors">
                Бодлого
              </Link>
              -ийг зөвшөөрнө.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-4 h-4 border-2 border-border border-t-foreground rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}