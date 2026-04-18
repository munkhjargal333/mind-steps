'use client'

import { Brain, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export function ProblemSection() {
  return (
    <section className="border-t-4 border-double border-foreground py-20 md:py-32 bg-card/10">
      <div className="container max-w-5xl mx-auto px-4">
        
        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Headline & Lead */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-block px-3 py-1 border border-foreground/20 font-serif text-[10px] font-bold uppercase tracking-widest mb-4">
              ШИНЖИЛГЭЭ: No. 90
            </div>
            
            <h2 className="font-serif text-4xl md:text-5xl font-black leading-[0.95] tracking-tighter uppercase italic">
              Өнөөдрийн бодлын{' '}
              <span className="relative">
                <span className="relative z-10 text-brand-terracotta italic">90%</span>
                <div className="absolute -inset-1 bg-brand-terracotta/10 rotate-2 mix-blend-multiply" />
              </span>{' '}
              өчигдрийн давталт.
            </h2>
            
            <p className="font-serif text-lg text-foreground/80 leading-relaxed italic border-l-2 border-brand-terracotta/30 pl-6">
              Ижил бодол. Ижил мэдрэмж. Ижил хариу үйлдэл. Бид өөрийнхөө мэдэлгүй "автомат" горимд амьдарсаар байна.
            </p>
          </div>

          {/* Right Side: Investigation Cards (Stamped Style) */}
          <div className="md:col-span-7 space-y-4">
            <EditorialCard
              icon={Brain}
              title="БОДОЛ ДАВТАГДДАГ"
              description="Өдөр бүр ижил сэтгэл санаа, ижил асуудлууд эргэлдэж байдаг уу? Энэ бол тархины хэв маяг."
              color="text-brand-stone"
            />
            <EditorialCard
              icon={Heart}
              title="МЭДРЭМЖ АВТОМАТ БОЛСОН"
              description="Яагаад уурлаж, гуниглаж байгаагаа ч ойлгохгүй байдаг уу? Сэтгэл хөдлөл чинь таныг удирдаж байна."
              color="text-brand-amber"
            />
            <EditorialCard
              icon={Sparkles}
              title="ӨӨРЧЛӨЛТ ХҮСЭЖ БАЙГАА"
              description="Амьдралдаа утга учир олохыг хүсч байгаа боловч хаанаас эхлэхээ мэдэхгүй байна уу?"
              color="text-brand-terracotta"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

// ── EditorialCard (Internal Helper) ──────────────────────────────────────

function EditorialCard({ icon: Icon, title, description, color }: any) {
  return (
    <div className="group p-6 border border-foreground/10 bg-background/40 hover:bg-background transition-all relative overflow-hidden">
      <div className="flex gap-6 items-start relative z-10">
        <div className={cn("p-3 border-2 border-current", color)}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h3 className={cn("font-serif font-black text-sm tracking-[0.2em] uppercase", color)}>
            {title}
          </h3>
          <p className="font-serif text-sm leading-relaxed text-muted-foreground italic">
            {description}
          </p>
        </div>
      </div>
      {/* Subtle paper grain inside each card */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
    </div>
  )
}