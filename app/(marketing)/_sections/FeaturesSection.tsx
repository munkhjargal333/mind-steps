'use client'

import { Brain, Heart, Sparkles, BookOpen } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const FEATURES = [
  { 
    icon: Brain, 
    title: "Ямар бодол давтагдаж байгааг", 
    desc: "Тэмдэглэлүүдийг нэгтгэж, гурав ч, арав ч давтагдсан хэв маягийг нүдэнд үзүүлнэ.",
    highlight: "bg-loneliness/10" 
  },
  { 
    icon: Heart, 
    title: "Яагаад уурлаж, гуниглаж байгааг", 
    desc: "Сэтгэл хөдлөлийн триггер — тодорхой нөхцөл, хүн, цаг — харагдаж эхэлнэ.",
    highlight: "bg-brand-amber/10" 
  },
  { 
    icon: Sparkles, 
    title: "Цаана нь ямар хэрэгцээ байгааг", 
    desc: "Уур, айдас, гунигийн цаана ямар биелэгдээгүй хэрэгцээ байдгийг тодруулна.",
    highlight: "bg-brand-terracotta/10" 
  },
  { 
    icon: BookOpen, 
    title: "Бодол яагаад тойрч байгааг", 
    desc: "Шийдэгдээгүй асуудлууд бичигдэх тусам тодорхой болж, тойрох нь зогсдог.",
    highlight: "bg-self-doubt/10" 
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 border-t-4 border-double border-foreground">
      <div className="container max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-20 space-y-4">
          <div className="inline-block px-4 py-1 border-2 border-foreground font-serif text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
            Онцлох шинжилгээ
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
            Та юу ойлгож эхлэх вэ?
          </h2>
          <p className="font-serif text-lg md:text-xl italic text-muted-foreground max-w-2xl mx-auto">
            Зөвхөн тэмдэглэл биш — өөрийнхөө зургийг бүтнээр нь хар.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="flex gap-6 items-start group">
              <div className="flex-shrink-0 mt-1">
                <feat.icon className="w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h3 className="relative inline-block font-serif font-black text-xl tracking-tight italic leading-none">
                  {/* Highlighter effect on Title */}
                  <div className={cn("absolute inset-0 -mx-2 -rotate-1 scale-y-110 mix-blend-multiply transition-transform group-hover:rotate-0", feat.highlight)} />
                  <span className="relative z-10">{feat.title}</span>
                </h3>
                <p className="font-serif text-base text-muted-foreground leading-relaxed italic">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Editorial Note */}
        <div className="mt-24 pt-8 border-t border-dashed border-foreground/20 text-center">
          <p className="font-serif text-[10px] uppercase tracking-[0.5em] font-bold opacity-30">
            Confidential Emotional Analysis Report — Ref. 2026
          </p>
        </div>
      </div>
    </section>
  )
}