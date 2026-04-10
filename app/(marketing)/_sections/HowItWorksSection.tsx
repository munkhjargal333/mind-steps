'use client'

import { Eye, Zap, Sparkles, Brain } from 'lucide-react'
import { HowItWorksCard } from '../_components/HowItWorksCard'

export function HowItWorksSection() {
  return (
    <section className="border-t bg-muted/30">
      <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Хэрхэн ажилладаг вэ?</h2>
          <p className="text-muted-foreground text-base">
            Өдөр бүр 4 алхам. Нийт 90 секунд.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <HowItWorksCard
            step={1}
            icon={Eye}
            title="Бич"
            description="Өдрийн давтагдаж байсан бодол, мэдрэмжийг товч тэмдэглэ. 90 секунд хангалттай."
          />
          <HowItWorksCard
            step={2}
            icon={Zap}
            title="Давталтыг ол"
            description="MindSteps тэмдэглэлүүдийн хооронд ямар хэв маяг байгааг автоматаар харуулна."
          />
          <HowItWorksCard
            step={3}
            icon={Sparkles}
            title="Шалтгааныг хар"
            description="Яагаад тэр мэдрэмж үүсдэг, ямар хэрэгцээ цаана байгааг ойлгож эхэл."
          />
          <HowItWorksCard
            step={4}
            icon={Brain}
            title="Өөрчлөгдөж эхэл"
            description="Хэв маягаа мэдсэн тэр мөчөөс автомат биш, ухамсартай хариу үйлдэл гаргаж эхэлнэ."
          />
        </div>
      </div>
    </section>
  )
}
