'use client'

import Link from 'next/link'
import { Sunrise } from 'lucide-react'
import { MainHeader } from '@/shared/components/MainHeader'
import { HeroSection } from './_sections/HeroSection'
import { ProblemSection } from './_sections/ProblemSection'
import { HowItWorksSection } from './_sections/HowItWorksSection'
import { FeaturesSection } from './_sections/FeaturesSection'
import { WhoItIsForSection } from './_sections/WhoItIsForSection'
import { CTASection } from './_sections/CTASection'

export default function LandingPage() {
  return (
    <div className="h-dvh overflow-hidden bg-background flex flex-col">
      <MainHeader />

      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth">

        {/* Snap sections */}
        <div className="h-dvh w-full snap-start">
          <HeroSection />
        </div>

        <div className="h-dvh w-full snap-start">
          <ProblemSection />
        </div>

        <div className="h-dvh w-full snap-start">
          <HowItWorksSection />
        </div>

        <div className="h-dvh w-full snap-start">
          <FeaturesSection />
        </div>

        <div className="h-dvh w-full snap-start">
          <WhoItIsForSection />
        </div>

        {/* CTA - snap хэвээр */}
        <div className="min-h-dvh w-full snap-start flex items-center">
          <CTASection />
        </div>

        {/* Footer - snap биш (IMPORTANT) */}
        <footer className="border-t bg-background">
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              <div className="flex items-center gap-2">
                <Sunrise className="w-5 h-5 text-orange-500" aria-hidden="true" />
                <span className="font-semibold">MindSteps</span>
              </div>

              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link href="/upgrade" className="hover:text-foreground transition-colors">Upgrade</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/join" className="hover:text-foreground transition-colors">Join</Link>
              </div>

              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} MindSteps
              </p>

            </div>
          </div>
        </footer>

      </main>
    </div>
  )
}