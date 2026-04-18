'use client'

import { Eye, Zap, Sparkles, Brain } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const STEPS = [
  { icon: Eye, title: "БИЧ", desc: "Өдрийн давтагдаж байсан бодол, мэдрэмжийг товч тэмдэглэ. 90 секунд хангалттай." },
  { icon: Zap, title: "ДАВТАЛТЫГ ОЛ", desc: "MindSteps тэмдэглэлүүдийн хооронд ямар хэв маяг байгааг автоматаар харуулна." },
  { icon: Sparkles, title: "ШАЛТГААНЫГ ХАР", desc: "Яагаад тэр мэдрэмж үүсдэг, ямар хэрэгцээ цаана байгааг ойлгож эхэл." },
  { icon: Brain, title: "ӨӨРЧЛӨГДӨЖ ЭХЭЛ", desc: "Хэв маягаа мэдсэн тэр мөчөөс автомат биш, ухамсартай хариу үйлдэл гаргаж эхэлнэ." },
]

export function HowItWorksSection() {
  return (
    <section className="border-t-4 border-double border-foreground py-20 bg-card/5">
      <div className="container max-w-5xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline border-b-2 border-foreground pb-4 mb-12 gap-4">
          <h2 className="font-serif font-black text-3xl md:text-5xl tracking-tighter uppercase italic">
            Ажиллах зарчим
          </h2>
          <p className="font-serif italic text-sm md:text-lg text-muted-foreground">
            4 алхам • Нийт 90 секунд
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-4 gap-0 border border-foreground/10">
          {STEPS.map((step, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-8 border-foreground/10 relative group hover:bg-background transition-colors",
                idx !== STEPS.length - 1 && "md:border-r border-b md:border-b-0"
              )}
            >
              {/* Step Number Stamp */}
              <div className="font-serif font-black text-4xl opacity-10 absolute top-4 right-6 group-hover:opacity-20 transition-opacity">
                0{idx + 1}
              </div>

              <div className="space-y-6 relative z-10">
                <div className="inline-block p-3 border-2 border-foreground">
                  <step.icon size={24} strokeWidth={1.5} />
                </div>
                
                <h3 className="font-serif font-black text-lg tracking-widest uppercase italic text-letterpress">
                  {step.title}
                </h3>
                
                <p className="font-serif text-sm leading-relaxed text-muted-foreground italic">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}