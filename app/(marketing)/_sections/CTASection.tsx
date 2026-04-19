'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 md:py-40 bg-background">
      <div className="container max-w-4xl mx-auto px-4 text-center space-y-12">
        <p className="font-mono font-black text-sm uppercase tracking-[0.5em] text-brand-amber italic">Эхлэх цаг нь болсон</p>
        
        <h2 className="font-mono text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
          Өөрийгөө ойлгоход<br />
          <span className="relative inline-block mt-4">
            <span className="relative z-10">90 секунд</span>
            <div className="absolute inset-x-0 bottom-2 h-[40%] z-0 bg-brand-amber/30 -rotate-1 mix-blend-multiply" />
          </span>
          <br />хангалттай.
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-10">
          <Link href="/demo" className="px-10 py-4 font-mono font-black text-lg uppercase tracking-widest border-4 border-foreground hover:bg-foreground hover:text-background transition-all">
            Туршиж үзэх <ArrowRight className="inline-block w-5 h-5 ml-3" />
          </Link>
          <Link href="/login" className="font-mono font-bold uppercase text-sm border-b-2 border-foreground/20 hover:border-foreground pb-1">Нэвтрэх</Link>
        </div>
      </div>
    </section>
  )
}