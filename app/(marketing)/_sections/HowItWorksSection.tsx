'use client'

import { cn } from '@/shared/lib/utils'

const STEPS = [
  { num: '01', title: 'Бич',              desc: 'Өдрийн давтагдаж байсан бодол, мэдрэмжийг товч тэмдэглэ. 90 секунд хангалттай.' },
  { num: '02', title: 'Давталтыг ол',     desc: 'MindSteps тэмдэглэлүүдийн хооронд ямар хэв маяг байгааг автоматаар харуулна.' },
  { num: '03', title: 'Шалтгааныг хар',   desc: 'Яагаад тэр мэдрэмж үүсдэг, ямар хэрэгцээ цаана байгааг ойлгож эхэл.' },
  { num: '04', title: 'Өөрчлөгдөж эхэл', desc: 'Хэв маягаа мэдсэн тэр мөчөөс ухамсартай хариу үйлдэл гаргаж эхэлнэ.' },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-5xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <div className="flex justify-between items-baseline border-b-2 border-foreground pb-3 mb-12 gap-4">
          <h2 className="font-mono font-black text-2xl md:text-3xl tracking-tighter uppercase italic">
            Ажиллах зарчим
          </h2>
          <span className="font-mono italic text-[10px] text-foreground/40 uppercase tracking-widest whitespace-nowrap">
            4 алхам — 90 сек
          </span>
        </div>

        {/* Steps — newspaper column grid */}
        <div className="grid md:grid-cols-4 border border-foreground/12">
          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className={cn(
                'p-6 md:p-7 relative group hover:bg-foreground/[0.025] transition-colors',
                idx !== STEPS.length - 1 && 'border-b md:border-b-0 md:border-r border-foreground/12'
              )}
            >
              {/* Ghost number */}
              <span className="font-mono font-black text-[4.5rem] leading-none text-foreground/[0.04] absolute top-1 right-3 select-none group-hover:text-foreground/[0.07] transition-colors">
                {step.num}
              </span>

              <div className="space-y-4 relative z-10">
                <div className="inline-block border border-foreground/18 px-2 py-0.5">
                  <span className="font-mono font-black text-[9px] tracking-[0.3em] text-foreground/30">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-mono font-black text-sm tracking-wide uppercase italic leading-tight">
                  {step.title}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-foreground/50 italic">
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