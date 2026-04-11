'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'

export function CTASection() {
  return (
    <section className="border-t">
      <div className="container max-w-3xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-6 md:space-y-8">
          <div className="space-y-3">
            <p className="text-lg uppercase tracking-wider text-amber-500 dark:text-amber-400 font-semibold">
              Эхлэх цаг нь болсон
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Өөрийгөө ойлгоход
              <br />
              <span className="text-muted-foreground">90 секунд хангалттай.</span>
            </h2>

            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Өдөр бүр нэг тэмдэглэл.
              Долоо хоногт давтагдах хэв маяг.
              Сараар — өөрийгөө шинээр харах.
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
        </div>
      </div>
    </section>
  )
}
