'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { MainHeader } from '@/shared/components'
import { cn } from '@/shared/lib'

// ─── Data ────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  { num: '1', title: 'Бодол давтагддаг',      desc: 'Өдөр бүр ижил сэтгэл санаа, ижил асуудлууд эргэлдэж байдаг уу? Энэ бол тархины хэв маяг.'             },
  { num: '2', title: 'Мэдрэмж автомат болсон', desc: 'Яагаад уурлаж, гуниглаж байгаагаа ч ойлгохгүй байдаг уу? Сэтгэл хөдлөл чинь таныг удирдаж байна.'   },
  { num: '3', title: 'Өөрчлөлт хүсэж байгаа', desc: 'Амьдралдаа утга учир олохыг хүсч байгаа боловч хаанаас эхлэхээ мэдэхгүй байна уу?'                   },
]

const STEPS = [
  { num: '1', title: 'Бич',              desc: 'Өдрийн давтагдаж байсан бодол, мэдрэмжийг товч тэмдэглэ. 90 секунд хангалттай.'          },
  { num: '2', title: 'Давталтыг ол',     desc: 'MindSteps тэмдэглэлүүдийн хооронд ямар хэв маяг байгааг автоматаар харуулна.'              },
  { num: '3', title: 'Шалтгааныг хар',   desc: 'Яагаад тэр мэдрэмж үүсдэг, ямар хэрэгцээ цаана байгааг ойлгож эхэл.'                     },
  { num: '4', title: 'Өөрчлөгдөж эхэл', desc: 'Хэв маягаа мэдсэн тэр мөчөөс ухамсартай хариу үйлдэл гаргаж эхэлнэ.'                     },
]

const FEATURES = [
  { num: '1', title: 'Ямар бодол давтагдаж байгааг',    desc: 'Тэмдэглэлүүдийг нэгтгэж, давтагдсан хэв маягийг нүдэнд үзүүлнэ.'                  },
  { num: '2', title: 'Яагаад уурлаж, гуниглаж байгааг', desc: 'Сэтгэл хөдлөлийн триггер — тодорхой нөхцөл, хүн, цаг — харагдаж эхэлнэ.'          },
  { num: '3', title: 'Цаана нь ямар хэрэгцээ байгааг',  desc: 'Уур, айдас, гунигийн цаана ямар биелэгдээгүй хэрэгцээ байдгийг тодруулна.'         },
  { num: '4', title: 'Бодол яагаад тойрч байгааг',      desc: 'Шийдэгдээгүй асуудлууд бичигдэх тусам тодорхой болж, тойрох нь зогсдог.'           },
]

// ─── Shared classes ──────────────────────────────────────────────────────────

const SECTION = 'border-b-[3px] border-foreground'
const INNER   = 'max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20'
const NUM = 'font-serif font-black text-3xl text-foreground/15 shrink-0 w-10 mt-1'
const BODY    = 'font-serif text-sm italic text-foreground/50 leading-relaxed'


// HERO / CTA — зузаан marker, amber
const HL_BOLD = 'highlight highlight-variant-20 highlight-amber-400 after:opacity-70';

// STAT тоонууд дээр — нимгэн цэнхэр
const HL_STAT = 'highlight highlight-variant-1 highlight-sky-300 after:opacity-40';

// PROBLEM section list title — ногоон
const HL_PROBLEM = 'highlight highlight-variant-3 highlight-emerald-300 after:opacity-40 highlight-spread-md';

// HOW IT WORKS section list title — цэнхэр
const HL_STEPS = 'highlight highlight-variant-3 highlight-sky-300 after:opacity-40 highlight-spread-md';

// FEATURES section list title — ягаан
const HL_FEATURES = 'highlight highlight-variant-3 highlight-violet-300 after:opacity-40 highlight-spread-md';

// INLINE жижиг тэмдэглэл
const HL_SMALL = 'highlight highlight-variant-13 highlight-cyan-200 after:opacity-30';

// ─── Components ──────────────────────────────────────────────────────────────

function SectionBreak({ num, title }: { num: string; title: string }) {
  return (
    <div className="border-y-2 border-foreground bg-foreground/[0.02]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
        <span className="font-serif font-black text-[10px] uppercase tracking-[0.4em] italic">{title}</span>
        <span className="font-serif font-black text-[9px] uppercase tracking-[0.45em] text-foreground/30">№ {num}</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-dvh bg-background text-foreground selection:bg-amber-500/30 flex flex-col">

      {/* HEADER */}
      <MainHeader />

      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────── */}

        <section className={SECTION}>
          <div className={INNER}>
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-12 space-y-10">
                {/* HEADLINE */}
                <h1 className="font-serif font-black leading-[0.85] tracking-[-0.03em] uppercase italic">
                  <span className="block text-[clamp(3rem,8vw,7rem)] text-stone-100">Ухаалаг</span>
                  <span className="block text-[clamp(3rem,8vw,7rem)]">
                    <span className={HL_BOLD}>Тэмдэглэлийн дэвтэр</span>
                  </span>
                </h1>

                {/* DESCRIPTION */}
                <p className="max-w-xl font-serif text-sm md:text-base italic text-stone-400 leading-relaxed">
                  Давтагддаг бодол, мэдрэмж, дотоод хэрэгцээгээ дижитал хуудаснаа буулгаж,{' '}
                  <span className={HL_SMALL}>өөрийгөө таних аяллаа эхлүүл.</span>
                </p>

                {/* BUTTONS - Энд хэмжээг стандарт болгож жижигсгэв */}
                <div className="flex items-center gap-4">
                  <Link
                    href="/demo"
                    className={cn(
                      'flex items-center gap-2.5 px-5 py-3.5 rounded-sm border font-serif',
                      'text-xs font-bold tracking-wide transition-all duration-150',
                      'bg-foreground text-background border-foreground hover:bg-foreground/90 active:scale-[0.98]',
                    )}
                  >
                    Туршиж үзэх
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                       'flex items-center gap-2.5 px-5 py-3.5 rounded-sm border font-serif',
                      'text-xs font-bold tracking-wide transition-all duration-150',
                      'bg-transparent text-foreground border-border hover:bg-muted active:scale-[0.98]',
                    )}
                  >
                    Нэвтрэх
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ──────────────────────────────────── */}
        <SectionBreak num="01" title="Өнөөдрийн асуудал" />
        <section className={SECTION}>
          <div className={INNER}>
            <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
              <div className="md:col-span-5 space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight uppercase italic">
                  Өнөөдрийн бодлын{' '}
                  {/* HL_STAT — нимгэн цэнхэр тоон дээр */}
                  <span className={`${HL_STAT}`}>90%</span>{' '}
                  нь өчигдрийн давталт.
                </h2>
                <p className="font-serif text-sm text-foreground/50 leading-relaxed italic border-l-2 border-foreground/15 pl-4">
                  Ижил мэдрэмж, ижил хариу үйлдэл. Бид өөрийнхөө мэдэлгүй <span className={`${HL_SMALL}`}>автомат горимд амьдарсаар байна</span>.
                </p>
              </div>
              <div className="md:col-span-7 border-t border-foreground/12">
                {PROBLEMS.map((item) => (
                  <div key={item.num} className="flex gap-6 py-6 border-b border-foreground/10 hover:bg-foreground/[0.01] transition-colors">
                    <span className={NUM}>{item.num}</span>
                    <div className="space-y-1.5">
                      {/* HL_PROBLEM — ногоон problem title-уудад */}
                      <h3 className={`font-serif font-black text-sm uppercase italic tracking-wide ${HL_PROBLEM}`}>
                        {item.title}
                      </h3>
                      <p className={BODY}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <SectionBreak num="02" title="Ажиллах зарчим" />
        <section className={SECTION}>
          <div className={INNER}>
            <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
              <div className="md:col-span-5 space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight uppercase italic">
                  Нийт <span className={`${HL_STAT}`}>4 алхам</span>
                </h2>
                <p className="font-serif text-sm text-foreground/50 leading-relaxed italic border-l-2 border-foreground/15 pl-4">
                  Төвөгтэй систем биш, ердөө л өөртөө гаргах 90 секунд.
                </p>
              </div>
              <div className="md:col-span-7 border-t border-foreground/12">
                {STEPS.map((step) => (
                  <div key={step.num} className="flex gap-6 py-6 border-b border-foreground/10 hover:bg-foreground/[0.01] transition-colors">
                    <span className={NUM}>{step.num}</span>
                    <div className="space-y-1.5">
                      {/* HL_STEPS — цэнхэр алхам title-уудад */}
                      <h3 className={`font-serif font-black text-sm uppercase italic tracking-wide ${HL_STEPS}`}>
                        {step.title}
                      </h3>
                      <p className={BODY}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <SectionBreak num="03" title="Боломжууд" />
        <section className={SECTION}>
          <div className={INNER}>
            <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
              <div className="md:col-span-5 space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight uppercase italic">
                  Та юу ойлгож <span className={`${HL_STAT}`}>эхлэх вэ?</span>
                </h2>
                <p className="font-serif text-sm text-foreground/50 leading-relaxed italic border-l-2 border-foreground/15 pl-4">
                  Бичвэрүүдээс тань систем автоматаар таны дотоод хэв маягийг олж харуулна.
                </p>
              </div>
              <div className="md:col-span-7 border-t border-foreground/12">
                {FEATURES.map((feat) => (
                  <div key={feat.num} className="flex gap-6 py-6 border-b border-foreground/10 hover:bg-foreground/[0.01] transition-colors">
                    <span className={NUM}>{feat.num}</span>
                    <div className="space-y-1.5">
                      {/* HL_FEATURES — ягаан features title-уудад */}
                      <h3 className={`font-serif font-black text-sm uppercase italic tracking-wide ${HL_FEATURES}`}>
                        {feat.title}
                      </h3>
                      <p className={BODY}>{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="font-serif font-black text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] uppercase italic mb-12">
              
              {/* HL_BOLD — thick marker on the CTA headline */}
              <span className={`${HL_BOLD} highlight-amber-400`}>Өөрийгөө ойлгоход{' '}90 секунд хангалттай.</span>{' '}
              
            </h2>
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/demo"
                className={cn(
                  'flex items-center gap-2.5 px-6 py-3.5 rounded-sm border font-serif',
                  'text-xs font-bold tracking-wide transition-all duration-150',
                  'bg-foreground text-background border-foreground hover:bg-foreground/90 active:scale-[0.98]',
                )}
              >
                Одоо эхлэх
              </Link>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                Бүртгэл үнэгүй · Цаг алдахгүй
              </p>
            </div>
          </div>
        </section>



      </main>

      <footer className="border-t-[3px] border-foreground py-8">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-30">
          <span>© 2026 MindSteps</span>
          <div className="flex gap-8">
            <Link href="/terms">Нөхцөл</Link>
            <Link href="/privacy">Нууцлал</Link>
          </div>
          <span>Ulaanbaatar</span>
        </div>
      </footer>
    </div>
  )
}