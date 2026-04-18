'use client'

import Link from 'next/link'
import { MainHeader } from '@/shared/components/MainHeader'
import { HeroSection } from './_sections/HeroSection'
import { ProblemSection } from './_sections/ProblemSection'
import { HowItWorksSection } from './_sections/HowItWorksSection'
import { FeaturesSection } from './_sections/FeaturesSection'
import { WhoItIsForSection } from './_sections/WhoItIsForSection'
import { CTASection } from './_sections/CTASection'
import { AppLogo } from '@/shared/components/AppLogo'


export default function LandingPage() {
  return (
    // overflow-hidden-ийг авч хаяад scroll-ыг чөлөөтэй болгоно
    <div className="min-h-dvh bg-background text-foreground font-serif selection:bg-brand-amber/30 flex flex-col relative">
      
      {/* 1. Masthead - Fixed биш, scroll-той хамт явна */}
      <div className="border-b-4 border-double border-foreground py-2 z-50 bg-background">
         <MainHeader />
      </div>

      {/* snap-y хэвээрээ, гэхдээ контейнер нь scroll-оо өөрөө зохицуулна */}
      <main className="flex-1 snap-y md:snap-mandatory scroll-smooth">
        
        {/* Hero Section - Энэ бол нүүр хуудас тул h-dvh байж болно */}
        <section className="min-h-[calc(100dvh-80px)] w-full snap-start">
          <HeroSection />
        </section>

        <SectionWrapper title="ӨНӨӨГИЙН АСУУДАЛ" subtitle="Editorial No. 01">
          <ProblemSection />
        </SectionWrapper>

        <SectionWrapper title="АЖИЛЛАХ ЗАРЧИМ" subtitle="Technical Review">
          <HowItWorksSection />
        </SectionWrapper>

        <SectionWrapper title="ҮНДСЭН БОЛОМЖУУД" subtitle="Feature Highlights">
          <FeaturesSection />
        </SectionWrapper>

        <SectionWrapper title="ХЭНД ЗОРУУЛАВ?" subtitle="Target Audience">
          <WhoItIsForSection />
        </SectionWrapper>

        {/* CTA - Сунадаг байхаар */}
        <div className="min-h-[60dvh] flex items-center justify-center snap-start bg-brand-stone/5 border-t-2 border-dashed border-foreground/20 py-20">
          <CTASection />
        </div>

        {/* 2. Footer */}
        <footer className="border-t-4 border-double border-foreground bg-card/30 snap-start">
          <div className="container max-w-5xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AppLogo />
                </div>
                <p className="font-serif text-sm italic text-muted-foreground">
                  © {new Date().getFullYear()} MindSteps Gazette.
                </p>
              </div>
              <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest items-center">
                <Link href="/terms">Terms</Link>
                <Link href="/privacy">Privacy</Link>
              </div>
              <div className="md:text-right text-[10px] font-bold uppercase opacity-50">
                ESTD. 2024 — ULAANBAATAR
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Paper Texture */}
      <div className="fixed inset-0 pointer-events-none mix-blend-multiply opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-[100]" />
    </div>
  )
}

// ── Шинэчлэгдсэн SectionWrapper ──────────────────────────────────────
// h-dvh-ийг min-h-dvh болгож, overflow-hidden-ийг авлаа.

function SectionWrapper({ children, title, subtitle }: { children: React.ReactNode, title?: string, subtitle?: string }) {
  return (
    <section className="min-h-dvh w-full snap-start relative flex flex-col border-b border-foreground/10 py-12 md:py-16">
      {title && (
        <div className="container max-w-5xl mx-auto px-4 mb-8">
          <div className="flex justify-between items-end border-b-2 border-foreground pb-2">
            <h2 className="font-serif font-black text-2xl md:text-4xl tracking-tighter uppercase italic text-letterpress">
              {title}
            </h2>
            {subtitle && (
              <span className="font-serif text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-40 pb-1">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      )}
      {/* overflow-hidden-ийг авснаар контент доошоо чөлөөтэй сунана */}
      <div className="flex-1 h-full">
        {children}
      </div>
    </section>
  )
}