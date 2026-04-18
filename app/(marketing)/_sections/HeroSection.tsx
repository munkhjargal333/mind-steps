'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

export function HeroSection() {
  return (
    <section className="container max-w-4xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center min-h-[80dvh]">
      <div className="text-center space-y-8 max-w-3xl">
        
        {/* Metadata: Volume / Issue Style */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="h-[1px] w-12 bg-foreground/20" />
          <p className="font-serif text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">
            Volume 1.0 — 2026 Edition
          </p>
          <span className="h-[1px] w-12 bg-foreground/20" />
        </div>

        <div className="space-y-6">
          <p className="font-serif italic text-xl md:text-2xl text-primary leading-relaxed text-letterpress">
            "Ухаалаг тэмдэглэлийн дэвтэр — Сэтгэлзүйн шинэ эрин"
          </p>

          <h1 className="font-serif text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic">
            Өдөр бүр <br />
            <span className="relative inline-block px-4">
              {/* Highlighter Effect */}
              <div className="absolute inset-0 z-0 bg-brand-amber/20 -rotate-1 scale-110 mix-blend-multiply opacity-80" />
              <span className="relative z-10 text-brand-amber">90 секунд.</span>
            </span>
          </h1>

          <p className="font-serif text-lg md:text-xl text-foreground/70 max-w-xl mx-auto italic leading-relaxed pt-4">
            Өөрийгөө таних аялал эхэллээ. Давтагддаг бодол, мэдрэмж, дотоод хэрэгцээгээ дижитал хуудаснаа буулга.
          </p>
        </div>

        {/* Action Buttons: Stamped Style */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link 
            href="/demo" 
            className="group relative px-8 py-3 font-serif font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
          >
            Туршиж үзэх
            <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link 
            href="/login" 
            className="font-serif font-bold uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-foreground transition-all pb-1"
          >
            Нэвтрэх
          </Link>
        </div>

        <div className="pt-12">
          <p className="font-serif text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
            Бүртгэл шаардахгүй · Үнэгүй · Танд зориулав
          </p>
        </div>
      </div>
    </section>
  )
}