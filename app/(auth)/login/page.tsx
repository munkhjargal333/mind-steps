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
    <div className="min-h-screen flex flex-col bg-background text-foreground font-serif relative selection:bg-brand-amber/30">
      
      {/* Header хэсэг */}
      <div className="border-b-4 border-double border-foreground py-2 z-10 bg-background relative">
        <MainHeader />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md bg-card/40 border-4 border-double border-foreground p-8 md:p-10 relative">
          
          {/* Маягтын толгой */}
          <div className="text-center border-b-2 border-foreground pb-6 mb-8 space-y-3">
            <h1 className="font-serif text-4xl font-black uppercase italic tracking-tighter">
              Нэвтрэх
            </h1>
          </div>

          <div className="space-y-8">
            {displayError && (
              <LoginErrorAlert error={displayError} onDismiss={handleErrorDismiss} />
            )}

            <LoginForm onError={setDisplayError} />

            {/* Editorial Separator */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-foreground/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 font-serif text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
                  Эсвэл өөр замаар
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <SocialLogin onError={setDisplayError} />
              <DemoLogin />
            </div>
          </div>

          {/* Footer Terms */}
          <div className="mt-10 pt-6 border-t border-foreground/10 text-center">
            <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
              Нэвтрэх товчийг дарснаар та манай{' '}
              <Link href="/terms" className="text-foreground underline decoration-1 underline-offset-4 hover:bg-foreground hover:text-background transition-colors">Үйлчилгээний нөхцөл</Link>
              {' '}болон{' '}
              <Link href="/privacy" className="text-foreground underline decoration-1 underline-offset-4 hover:bg-foreground hover:text-background transition-colors">Нууцлалын бодлого</Link>
              -ийг зөвшөөрч буйд тооцно.
            </p>
          </div>

        </div>
      </div>

      {/* Global Paper Texture */}
      <div className="fixed inset-0 pointer-events-none mix-blend-multiply opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-0" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background font-serif">
          <div className="flex flex-col items-center gap-4">
            <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-none animate-spin" />
            <p className="text-xs uppercase tracking-widest font-bold">Хуудсыг бэлтгэж байна...</p>
          </div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}