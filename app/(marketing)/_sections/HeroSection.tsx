'use client'

import Link from 'next/link'
import { ArrowRight, Sunrise } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function HeroSection() {
  return (
    <section className="container max-w-3xl mx-auto px-4 py-20 md:py-32">
      <div className="text-center space-y-6 md:space-y-8">
        <div className="space-y-3">
          <p className="text-lg uppercase tracking-wider text-amber-500 dark:text-amber-400 font-semibold">
            Ухаалаг тэмдэглэлийн дэвтэр
          </p>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Өдөр бүр 90 секунд.
            <br />
            <span className="text-muted-foreground">Өөрийгөө ойлгож эхэл.</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Давтагддаг бодол, мэдрэмж, дотоод хэрэгцээгээ бич.
            MindSteps хэв маягийг илрүүлж, яагаад гэдгийг тайлбарлана.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/demo" prefetch>
              Туршиж үзэх <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/login">Нэвтрэх</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Бүртгэл шаардахгүй · Үнэгүй · 90 секунд
        </p>
      </div>
    </section>
  )
}
