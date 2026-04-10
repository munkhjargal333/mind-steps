'use client'

import { WhoItem } from '../_components/WhoItem'

export function WhoItIsForSection() {
  return (
    <section className="border-t bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-3 md:mb-4">
            Хэнд зориулсан
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Энэ систем танд тохирох уу?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">✓ Зориулагдсан</h3>
            <WhoItem variant="for" text="Амьдралын утга хайж байгаа хүмүүс" />
            <WhoItem variant="for" text="Өөрийгөө таних хүсэлтэй" />
            <WhoItem variant="for" text="Зан төлөв, бодлын хэв маягаа үнэхээр ойлгомоор байгаа" />
            <WhoItem variant="for" text="16-аас дээш насны хүмүүс" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-muted-foreground">
              ✕ Зориулагдаагүй
            </h3>
            <WhoItem variant="not" text="Сэтгэцийн эмчилгээ хийлгэж байгаа" />
            <WhoItem variant="not" text="16 хүрээгүй хүүхдүүд" />
            <WhoItem variant="not" text="Шуурхай, богино хугацаанд бүхнийг шийдэхийг хүсэж байгаа" />
            <WhoItem variant="not" text="Хүчтэй сэтгэл хөдлөлийн хямрал дунд байгаа" />
          </div>
        </div>

        <div className="mt-8 md:mt-12 p-4 md:p-6 border rounded-lg bg-background">
          <p className="text-xs md:text-sm text-muted-foreground text-center leading-relaxed">
            <strong className="text-foreground">Чухал анхааруулга:</strong>
            <br />
            MindSteps нь сэтгэцийн эмчилгээний орлуулагч биш. Хэрэв та ноцтой сэтгэл санааны
            хямралтай тулгарч байгаа бол мэргэжлийн эмч, сэтгэл зүйчид хандахыг зөвлөж байна.
          </p>
        </div>
      </div>
    </section>
  )
}
