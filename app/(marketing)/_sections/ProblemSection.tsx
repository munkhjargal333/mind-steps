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
    <section className="border-t-4 border-double border-foreground py-16 md:py-24 bg-card/10">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-10 items-start">

          <div className="md:col-span-5 space-y-5">
            <div className="inline-block px-3 py-1 border border-foreground/20 font-serif text-[10px] font-bold uppercase tracking-widest">
              Шинжилгээ: No. 90
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-black leading-[0.95] tracking-tighter uppercase italic">
              Өнөөдрийн бодлын{' '}
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-[var(--highlight-reframe)] mix-blend-[var(--highlight-blend)] rotate-1" />
                <span className="relative z-10">90%</span>
              </span>{' '}
              өчигдрийн давталт.
            </h2>
            <p className="font-serif text-sm text-foreground/65 leading-relaxed italic border-l-2 border-foreground/20 pl-5">
              Ижил бодол. Ижил мэдрэмж. Ижил хариу үйлдэл.
              Бид өөрийнхөө мэдэлгүй "автомат" горимд амьдарсаар байна.
            </p>
          </div>

          <div className="md:col-span-7 space-y-3">
            {CARDS.map((c) => (
              <div key={c.num} className="p-5 border border-foreground/10 bg-background/40 hover:bg-background transition-all">
                <div className="flex gap-5 items-start">
                  <span className="font-serif font-black text-xs text-foreground/25 tracking-widest mt-0.5 flex-shrink-0 w-6">{c.num}</span>
                  <div className="space-y-1">
                    <h3 className="relative inline font-serif font-black text-sm tracking-wide uppercase italic">
                      <span className={`absolute inset-0 -mx-1 -my-0.5 mix-blend-[var(--highlight-blend)] ${c.hl}`} />
                      <span className="relative z-10">{c.title}</span>
                    </h3>
                    <p className="font-serif text-sm leading-relaxed text-foreground/55 italic block mt-1">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}