'use client'

const FEATURES = [
  {
    title: 'Ямар бодол давтагдаж байгааг',
    desc: 'Тэмдэглэлүүдийг нэгтгэж, гурав ч, арав ч давтагдсан хэв маягийг нүдэнд үзүүлнэ.',
    highlight: 'bg-[var(--highlight-mirror)]',
  },
  {
    title: 'Яагаад уурлаж, гуниглаж байгааг',
    desc: 'Сэтгэл хөдлөлийн триггер — тодорхой нөхцөл, хүн, цаг — харагдаж эхэлнэ.',
    highlight: 'bg-[var(--highlight-reframe)]',
  },
  {
    title: 'Цаана нь ямар хэрэгцээ байгааг',
    desc: 'Уур, айдас, гунигийн цаана ямар биелэгдээгүй хэрэгцээ байдгийг тодруулна.',
    highlight: 'bg-[var(--highlight-relief)]',
  },
  {
    title: 'Бодол яагаад тойрч байгааг',
    desc: 'Шийдэгдээгүй асуудлууд бичигдэх тусам тодорхой болж, тойрох нь зогсдог.',
    highlight: 'bg-[var(--highlight-mirror)]',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-5xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <div className="mb-12 space-y-3 max-w-xl">
          <div className="inline-block border-2 border-foreground px-3 py-1">
            <span className="font-serif text-[9px] font-bold tracking-[0.4em] uppercase">
              Онцлох шинжилгээ
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9]">
            Та юу ойлгож эхлэх вэ?
          </h2>
          <p className="font-serif text-sm italic text-foreground/55 leading-relaxed">
            Зөвхөн тэмдэглэл биш — өөрийнхөө зургийг бүтнээр нь хар.
          </p>
        </div>

        {/* Feature list — editorial table style */}
        <div className="border-t-2 border-foreground">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="group grid md:grid-cols-12 gap-4 md:gap-8 py-7 border-b border-foreground/12 hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="md:col-span-1 shrink-0">
                <span className="font-serif font-black text-[10px] tracking-[0.3em] text-foreground/25">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="md:col-span-5">
                <h3 className="relative inline font-serif font-black text-base md:text-lg tracking-tight italic leading-snug">
                  <span className={`absolute inset-0 -mx-1.5 -my-0.5 -rotate-[0.5deg] scale-y-[1.1] mix-blend-multiply ${feat.highlight}`} />
                  <span className="relative z-10">{feat.title}</span>
                </h3>
              </div>
              <div className="md:col-span-6">
                <p className="font-serif text-sm text-foreground/55 leading-relaxed italic">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-5 border-t border-dashed border-foreground/15 text-center">
          <p className="font-serif text-[9px] uppercase tracking-[0.5em] font-bold opacity-20">
            Confidential Emotional Analysis Report — Ref. 2026
          </p>
        </div>

      </div>
    </section>
  )
}