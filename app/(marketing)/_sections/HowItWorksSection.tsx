'use client'

import { cn } from '@/shared/lib/utils'

const STEPS = [
  { num: '01', title: 'Бич',             desc: 'Өдрийн давтагдаж байсан бодол, мэдрэмжийг товч тэмдэглэ. 90 секунд хангалттай.' },
  { num: '02', title: 'Давталтыг ол',    desc: 'MindSteps тэмдэглэлүүдийн хооронд ямар хэв маяг байгааг автоматаар харуулна.' },
  { num: '03', title: 'Шалтгааныг хар',  desc: 'Яагаад тэр мэдрэмж үүсдэг, ямар хэрэгцээ цаана байгааг ойлгож эхэл.' },
  { num: '04', title: 'Өөрчлөгдөж эхэл', desc: 'Хэв маягаа мэдсэн тэр мөчөөс ухамсартай хариу үйлдэл гаргаж эхэлнэ.' },
]

export function HowItWorksSection() {
  return (
    <section className="border-t-4 border-double border-foreground py-16 bg-card/5">
      <div className="container max-w-5xl mx-auto px-4">

        <div className="flex flex-col md:flex-row justify-between items-baseline border-b-2 border-foreground pb-3 mb-10 gap-3">
          <h2 className="font-serif font-black text-2xl md:text-4xl tracking-tighter uppercase italic">
            Ажиллах зарчим
          </h2>
          <p className="font-serif italic text-xs text-foreground/45">
            4 алхам — нийт 90 секунд
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-0 border border-foreground/10">
          {STEPS.map((step, idx) => (
            <div
              key={step.num}
              className={cn(
                'p-6 relative group hover:bg-background/60 transition-colors border-foreground/10',
                idx !== STEPS.length - 1 && 'md:border-r border-b md:border-b-0'
              )}
            >
              <div className="font-serif font-black text-5xl opacity-[0.05] absolute top-2 right-3 select-none leading-none group-hover:opacity-[0.10] transition-opacity">
                {step.num}
              </div>
              <div className="space-y-4 relative z-10">
                <div className="font-serif font-black text-[10px] tracking-[0.3em] text-foreground/30 border border-foreground/15 inline-block px-2 py-0.5">
                  {step.num}
                </div>
                <h3 className="font-serif font-black text-sm tracking-wide uppercase italic">
                  {step.title}
                </h3>
                <p className="font-serif text-xs leading-relaxed text-foreground/50 italic">
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