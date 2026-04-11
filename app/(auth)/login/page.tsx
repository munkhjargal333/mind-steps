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

function LoginPageContent() {
  const [displayError, setDisplayError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const urlMessage = searchParams.get('message')
  const { error, clearError } = useAuth()

  useEffect(() => {
    if (urlMessage) {
      setDisplayError(decodeURIComponent(urlMessage))
    } else if (error) {
      setDisplayError(error)
    }
  }, [urlMessage, error])

  const handleErrorDismiss = () => {
    setDisplayError(null)
    clearError()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <MainHeader />

        <div className="bg-card border rounded-lg p-8 space-y-6">
          {displayError && (
            <LoginErrorAlert error={displayError} onDismiss={handleErrorDismiss} />
          )}

          <LoginForm onError={setDisplayError} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Эсвэл</span>
            </div>
          </div>

          <SocialLogin onError={setDisplayError} />

          <DemoLogin />
        </div>

        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            Нэвтрэх товчийг дарснаар та манай{' '}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Үйлчилгээний нөхцөл
            </Link>
            {' '}болон{' '}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Нууцлалын бодлого
            </Link>
            -тай зөвшөөрч байна.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Ачаалж байна...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}
