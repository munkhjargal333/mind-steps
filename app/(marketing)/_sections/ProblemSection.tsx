'use client'

import { Brain, Heart, Sparkles, type LucideIcon } from 'lucide-react'
import { ProblemCard } from '../_components/ProblemCard'

export function ProblemSection() {
  return (
    <section className="border-t">
      <div className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Өнөөдрийн бодлын{' '}
              <span className="underline decoration-orange-500 decoration-2 underline-offset-4">
                90%
              </span>{' '}
              өчигдрийн давталт.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Ижил бодол. Ижил мэдрэмж. Ижил хариу үйлдэл.
              Хэрвээ энэ давталт байгааг мэдэхгүй байгаа бол —
              өөрийнхөө талаар тийм ч ихийг мэдэхгүй байна.
            </p>
          </div>

          <div className="space-y-6">
            <ProblemCard
              icon={Brain}
              title="Бодол давтагддаг"
              description="Өдөр бүр ижил сэтгэл санаа, ижил асуудлууд эргэлдэж байдаг уу?"
            />
            <ProblemCard
              icon={Heart}
              title="Мэдрэмж автомат болсон"
              description="Яагаад уурлаж, гуниглаж байгаагаа ч ойлгохгүй байдаг уу?"
            />
            <ProblemCard
              icon={Sparkles}
              title="Өөрчлөлт хүсэж байгаа"
              description="Амьдралдаа утга учир олохыг хүсч байгаа боловч хаанаас эхлэхээ мэдэхгүй байна уу?"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
