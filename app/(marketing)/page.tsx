'use client'

import Link from 'next/link'
import { Sunrise } from 'lucide-react'
import { MainHeader } from '@/components/shared/MainHeader'
import { HeroSection } from './_sections/HeroSection'
import { ProblemSection } from './_sections/ProblemSection'
import { HowItWorksSection } from './_sections/HowItWorksSection'
import { FeaturesSection } from './_sections/FeaturesSection'
import { WhoItIsForSection } from './_sections/WhoItIsForSection'
import { CTASection } from './_sections/CTASection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />

      <main>
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <WhoItIsForSection />
        <CTASection />
      </main>

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
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MindSteps</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
