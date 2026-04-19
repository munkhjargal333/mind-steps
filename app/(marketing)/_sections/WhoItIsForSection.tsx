'use client'

export function WhoItIsForSection() {
  return (
    <section className="border-t-4 border-double border-foreground py-20 bg-card/5">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-0 border border-foreground/10">
          <div className="p-8 md:p-12 space-y-8 md:border-r border-foreground/10 bg-background/40">
            <h3 className="font-mono font-black text-xl uppercase italic text-brand-amber underline underline-offset-8 decoration-2">✓ ЗОРИУЛАГДСАН</h3>
            <ul className="space-y-4 font-mono italic text-lg opacity-80">
              <li>• Амьдралын утга хайж байгаа хүмүүс</li>
              <li>• Өөрийгөө таних хүсэлтэй хэн бүхэнд</li>
              <li>• 16-аас дээш насны ухамсарт иргэд</li>
            </ul>
          </div>
          <div className="p-8 md:p-12 space-y-8 bg-brand-stone/5">
            <h3 className="font-mono font-black text-xl uppercase italic text-muted-foreground underline underline-offset-8 decoration-2">✕ ЗОРИУЛАГДААГҮЙ</h3>
            <ul className="space-y-4 font-mono italic text-lg opacity-60">
              <li>• Сэтгэцийн эмчилгээ хийлгэж байгаа</li>
              <li>• 16 хүрээгүй хүүхдүүд</li>
              <li>• Шуурхай, богино шийдэл хайгчид</li>
            </ul>
          </div>
        </div>

        {/* Анхааруулга */}
        <div className="mt-12 p-8 border-4 border-double border-foreground/20 bg-background text-center space-y-2">
          <p className="font-mono font-black text-[10px] uppercase tracking-[0.5em] text-brand-terracotta">ЧУХАЛ АНХААРУУЛГА</p>
          <p className="font-mono text-sm italic text-muted-foreground max-w-2xl mx-auto">
            MindSteps нь сэтгэцийн эмчилгээний орлуулагч биш. Мэргэжлийн эмчид хандахыг зөвлөж байна.
          </p>
        </div>
      </div>
    </section>
  )
}