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

const HL_BOLD = 'highlight highlight-variant-20'

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
    <div className="min-h-screen flex flex-col bg-background text-foreground font-serif relative selection:bg-amber-500/20">
      
      <div className="border-b border-foreground/10 py-1 z-10 bg-background/80 backdrop-blur-sm sticky top-0">
        <MainHeader />
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        {/* CONTAINER: Хайрцагны өргөн болон padding-ийг багасгасан */}
        <div className="w-full max-w-[360px] bg-background border-[3px] border-double border-foreground/20 p-6 md:p-8 shadow-sm relative">
          
          {/* Header хэсэг - Текст жижигэрсэн */}
          <div className="text-center border-b border-foreground/10 pb-5 mb-6">
            <h1 className="font-serif text-lg md:text-xl font-black uppercase italic tracking-tighter">
              <span className={`${HL_BOLD} highlight-amber-400/30 px-2`}>Нэвтрэх</span>
            </h1>
          </div>

          {/* Хоорондын зай space-y-5 */}
          <div className="space-y-5">
            {displayError && (
              <LoginErrorAlert error={displayError} onDismiss={handleErrorDismiss} />
            )}

            {/* LoginForm доторх input болон button-г жижигсгэхийн тулд 
                тухайн component-ийнх нь py- болон text- хэмжээг шалгаарай */}
            <LoginForm onError={setDisplayError} />

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-foreground/15" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 font-serif text-[8px] font-bold uppercase tracking-widest text-foreground/40 italic">
                  Эсвэл
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <SocialLogin onError={setDisplayError} />
              <DemoLogin />
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-foreground/5 text-center">
            <p className="font-serif text-[8px] text-foreground/40 uppercase tracking-[0.15em] leading-relaxed">
              Нэвтрэх товчийг дарснаар манай{' '}
              <Link href="/terms" className="text-foreground/70 underline decoration-foreground/20 underline-offset-4 hover:text-foreground transition-all">Нөхцөл</Link>
              {' '}болон{' '}
              <Link href="/privacy" className="text-foreground/70 underline decoration-foreground/20 underline-offset-4 hover:text-foreground transition-all">Бодлого</Link>
              -ийг зөвшөөрнө.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none mix-blend-multiply opacity-[0.012] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-0" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background font-serif">
          <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}