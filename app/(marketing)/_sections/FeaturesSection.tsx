'use client'

import { Brain, Heart, Sparkles, BookOpen } from 'lucide-react'
import { FeatureCard } from '../_components/FeatureCard'

export function FeaturesSection() {
  return (
    <section className="border-t">
      <div className="container max-w-5xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Та юу ойлгож эхлэх вэ?</h2>
          <p className="text-muted-foreground text-base">
            Зөвхөн тэмдэглэл биш — өөрийнхөө зургийг бүтнээр нь хар.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <FeatureCard
            icon={Brain}
            title="Ямар бодол давтагдаж байгааг"
            description="Тэмдэглэлүүдийг нэгтгэж, гурав ч, арав ч давтагдсан хэв маягийг нүдэнд үзүүлнэ."
          />
          <FeatureCard
            icon={Heart}
            title="Яагаад уурлаж, гуниглаж байгааг"
            description="Сэтгэл хөдлөлийн триггер — тодорхой нөхцөл, хүн, цаг — харагдаж эхэлнэ."
          />
          <FeatureCard
            icon={Sparkles}
            title="Цаана нь ямар хэрэгцээ байгааг"
            description="Уур, айдас, гунигийн цаана ямар биелэгдээгүй хэрэгцээ байдгийг тодруулна."
          />
          <FeatureCard
            icon={BookOpen}
            title="Бодол яагаад тойрч байгааг"
            description="Шийдэгдээгүй асуудлууд бичигдэх тусам тодорхой болж, тойрох нь зогсдог."
          />
        </div>
      </div>
    </section>
  )
}
