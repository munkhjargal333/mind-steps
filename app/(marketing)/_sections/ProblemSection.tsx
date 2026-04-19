'use client'

const CARDS = [
  {
    num: '01',
    title: 'Бодол давтагддаг',
    desc: 'Өдөр бүр ижил сэтгэл санаа, ижил асуудлууд эргэлдэж байдаг уу? Энэ бол тархины хэв маяг.',
    hl: 'bg-[var(--highlight-mirror)]',
  },
  {
    num: '02',
    title: 'Мэдрэмж автомат болсон',
    desc: 'Яагаад уурлаж, гуниглаж байгаагаа ч ойлгохгүй байдаг уу? Сэтгэл хөдлөл чинь таныг удирдаж байна.',
    hl: 'bg-[var(--highlight-reframe)]',
  },
  {
    num: '03',
    title: 'Өөрчлөлт хүсэж байгаа',
    desc: 'Амьдралдаа утга учир олохыг хүсч байгаа боловч хаанаас эхлэхээ мэдэхгүй байна уу?',
    hl: 'bg-[var(--highlight-relief)]',
  },
]

export function ProblemSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-5xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* Left — chapter intro */}
          <div className="md:col-span-4 space-y-6">
            <div className="inline-block border border-foreground/25 px-3 py-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-foreground/50">
                Шинжилгээ — No. 90
              </span>
            </div>
            <h2 className="font-mono text-3xl md:text-4xl font-black leading-[0.92] tracking-tighter uppercase italic">
              Өнөөдрийн бодлын{' '}
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-[var(--highlight-reframe)] mix-blend-multiply scale-y-[1.1] -rotate-[0.5deg]" />
                <span className="relative z-10">90%</span>
              </span>{' '}
              өчигдрийн давталт.
            </h2>
            <p className="font-mono text-sm text-foreground/55 leading-relaxed italic border-l-[2px] border-foreground/20 pl-4">
              Ижил бодол. Ижил мэдрэмж. Ижил хариу үйлдэл. Бид өөрийнхөө мэдэлгүй "автомат" горимд амьдарсаар байна.
            </p>
          </div>

          {/* Right — numbered cards */}
          <div className="md:col-span-8 space-y-0 border-t border-foreground/15">
            {CARDS.map((c, i) => (
              <div
                key={c.num}
                className="group flex gap-6 py-7 border-b border-foreground/10 hover:bg-foreground/[0.02] transition-colors px-2"
              >
                <span className="font-mono font-black text-[10px] tracking-[0.3em] text-foreground/25 mt-1 w-6 shrink-0">
                  {c.num}
                </span>
                <div className="space-y-2">
                  <h3 className="relative inline font-mono font-black text-base tracking-wide uppercase italic">
                    <span className={`absolute inset-0 -mx-1 -my-0.5 mix-blend-multiply ${c.hl}`} />
                    <span className="relative z-10">{c.title}</span>
                  </h3>
                  <p className="font-mono text-sm leading-relaxed text-foreground/55 italic block mt-1">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}