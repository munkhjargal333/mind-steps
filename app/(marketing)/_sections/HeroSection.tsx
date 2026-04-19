import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative border-b-[3px] border-foreground min-h-[calc(100dvh-53px)] flex flex-col justify-center">

      {/* Thin column rules */}
      <div className="absolute inset-y-0 left-[33.333%] w-px bg-foreground/6 hidden md:block pointer-events-none" />
      <div className="absolute inset-y-0 left-[66.666%] w-px bg-foreground/6 hidden md:block pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full">

        {/* Dateline */}
        <div className="flex items-center gap-5 mb-12">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-foreground/35">Vol. I — 2026</span>
          <span className="flex-1 h-px bg-foreground/15" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-foreground/35">Улаанбаатар</span>
        </div>

        {/* Main layout */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-0 items-end">

          {/* Pull quote */}
          <div className="md:col-span-3 md:pr-8 md:border-r border-foreground/12 self-start">
            <p className="font-mono text-xs italic leading-relaxed text-foreground/45 border-l-2 border-foreground/20 pl-4">
              "Өдрийн давтагдаж байсан бодол, мэдрэмжийг 90 секундэд буулга."
            </p>
          </div>

          {/* Headline */}
          <div className="md:col-span-9 md:pl-10">
            <h1 className="font-mono font-black leading-[0.86] tracking-[-0.03em] uppercase italic">
              <span className="block text-[clamp(3.2rem,9.5vw,7.5rem)]">Өдөр бүр</span>
              <span className="block text-[clamp(3.2rem,9.5vw,7.5rem)]">
                <span className="highlight highlight-variant-20 highlight-[brand-amber] after:opacity-40">
                  90 секунд.
                </span>
              </span>
            </h1>
          </div>
        </div>

        {/* Subhead bar */}
        <div className="mt-10 md:mt-14 pt-6 border-t-2 border-foreground grid md:grid-cols-12 gap-6 items-center">
          <p className="md:col-span-7 font-mono text-sm md:text-base italic text-foreground/60 leading-relaxed">
            Өөрийгөө таних аялал эхэллээ. Давтагддаг бодол, мэдрэмж, дотоод хэрэгцээгээ дижитал хуудаснаа буулга.
          </p>
          <div className="md:col-span-5 flex items-center gap-5 md:justify-end flex-wrap">
            <Link href="/demo" className="font-mono font-black text-sm uppercase tracking-widest px-8 py-3 border-2 border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-all">
              Туршиж үзэх
            </Link>
            <Link href="/login" className="font-mono font-bold text-xs uppercase tracking-widest border-b-2 border-foreground/30 hover:border-foreground pb-0.5 transition-all">
              Нэвтрэх
            </Link>
          </div>
        </div>

        {/* Kicker */}
        <div className="mt-6 flex items-center gap-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold text-foreground/25">Бүртгэл шаардахгүй</span>
          <span className="text-foreground/15">·</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold text-foreground/25">Үнэгүй</span>
          <span className="text-foreground/15">·</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold text-foreground/25">Танд зориулав</span>
        </div>

      </div>
    </section>
  )
}