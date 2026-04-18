'use client'

import { Brain, Heart, Sparkles, BookOpen } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const FEATURES = [
  {
    icon: Brain,
    title: 'Ямар бодол давтагдаж байгааг',
    desc: 'Тэмдэглэлүүдийг нэгтгэж, гурав ч, арав ч давтагдсан хэв маягийг нүдэнд үзүүлнэ.',
    highlight: 'bg-loneliness/20',
  },
  {
    icon: Heart,
    title: 'Яагаад уурлаж, гуниглаж байгааг',
    desc: 'Сэтгэл хөдлөлийн триггер — тодорхой нөхцөл, хүн, цаг — харагдаж эхэлнэ.',
    highlight: 'bg-brand-amber/20',
  },
  {
    icon: Sparkles,
    title: 'Цаана нь ямар хэрэгцээ байгааг',
    desc: 'Уур, айдас, гунигийн цаана ямар биелэгдээгүй хэрэгцээ байдгийг тодруулна.',
    highlight: 'bg-brand-terracotta/20',
  },
  {
    icon: BookOpen,
    title: 'Бодол яагаад тойрч байгааг',
    desc: 'Шийдэгдээгүй асуудлууд бичигдэх тусам тодорхой болж, тойрох нь зогсдог.',
    highlight: 'bg-self-doubt/20',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 border-t-4 border-double border-foreground">
      <div className="container max-w-5xl mx-auto px-4">

        <div className="text-center mb-14 space-y-3">
          <div className="inline-block px-3 py-1 border-2 border-foreground font-serif text-[10px] font-bold tracking-[0.4em] uppercase">
            Онцлох шинжилгээ
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            Та юу ойлгож эхлэх вэ?
          </h2>
          <p className="font-serif text-sm md:text-base italic text-muted-foreground max-w-xl mx-auto">
            Зөвхөн тэмдэглэл биш — өөрийнхөө зургийг бүтнээр нь хар.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="flex gap-5 items-start group">
              <div className="flex-shrink-0 mt-0.5">
                <feat.icon className="w-5 h-5 opacity-35 group-hover:opacity-90 transition-opacity" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                {/* Highlight — thicker, more visible */}
                <h3 className="relative inline font-serif font-black text-base tracking-tight italic leading-snug">
                  <span
                    className={cn(
                      'absolute inset-0 -mx-1.5 -my-0.5 -rotate-[0.6deg] scale-y-[1.15] mix-blend-multiply',
                      feat.highlight
                    )}
                  />
                  <span className="relative z-10">{feat.title}</span>
                </h3>
                <p className="font-serif text-sm text-muted-foreground leading-relaxed italic">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-6 border-t border-dashed border-foreground/15 text-center">
          <p className="font-serif text-[10px] uppercase tracking-[0.5em] font-bold opacity-25">
            Confidential Emotional Analysis Report — Ref. 2026
          </p>
        </div>
      </div>
    </section>
  )
}