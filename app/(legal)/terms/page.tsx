'use client';

import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AppLogo } from '@/shared/components/AppLogo';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

const sections = [
  {
    number: '01',
    title: 'Үйлчилгээний мөн чанар',
    content:
      'MindSteps нь танин мэдэхүй, хувийн хөгжлийн мэдээлэл түгээх зорилготой платформ юм. Бид мэргэжлийн сэтгэл засалч, анагаах ухааны оношилгоо, эмчилгээний үйлчилгээ үзүүлэгч биш болно. Хэрэв танд сэтгэл зүйн хүндрэлтэй асуудал тулгарсан бол мэргэжлийн эмчид хандахыг зөвлөж байна.',
  },
  {
    number: '02',
    title: 'Оюуны өмч ба Зохиогчийн эрх',
    content:
      'Апп доторх бүх эх бичвэр, график, код болон дизайн нь MindSteps-ийн өмч бөгөөд зохиогчийн эрхээр хамгаалагдсан. Таны бичсэн тэмдэглэл, бодол болон хувийн өгөгдөл нь зөвхөн таны өмч байна. Бид таны зөвшөөрөлгүйгээр таны хувийн тэмдэглэлийг ашиглахгүй.',
  },
  {
    number: '03',
    title: 'Хэрэглэгчийн хариуцлага',
    content:
      'Та өөрийн бүртгэл болон нууц үгийн аюулгүй байдлыг хариуцна. Өөрийн бүртгэлийг бусдад дамжуулахгүй байх, хууль бус зорилгоор апп-ыг ашиглахгүй байх үүргийг хэрэглэгч хүлээнэ.',
  },
  {
    number: '04',
    title: 'Үйлчилгээний өөрчлөлт',
    content:
      'Бид үйлчилгээгээ сайжруулах зорилгоор апп-ын зарим функцийг хэдийд ч өөрчлөх, шинэчлэх эрхтэй. Нөхцөлд томоохон өөрчлөлт орсон тохиолдолд танд и-мэйлээр мэдэгдэх болно.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </Link>
          </Button>
          <Link href="/" className="transition-opacity hover:opacity-80">
            <AppLogo />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-14 md:py-20">

        {/* ── Hero ── */}
        <div className="mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted text-muted-foreground text-xs font-medium uppercase tracking-wider">
            <Scale className="w-3 h-3" />
            Legal · 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Үйлчилгээний нөхцөл
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Сүүлд шинэчилсэн: <span className="text-foreground font-medium">2026 оны 1-р сарын 11</span>.{' '}
            MindSteps платформыг ашиглахаас өмнө эдгээр нөхцөлүүдтэй анхааралтай танилцана уу.
          </p>
        </div>

        {/* ── Sections ── */}
        <div className="divide-y divide-border">
          {sections.map((section) => (
            <div key={section.number} className="py-10 grid md:grid-cols-[5rem_1fr] gap-4 md:gap-8 group">
              <div className="md:pt-1">
                <span className="text-3xl font-black text-border group-hover:text-primary/30 transition-colors leading-none tabular-nums">
                  {section.number}
                </span>
              </div>
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-14 pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MindSteps. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Нууцлалын бодлого
            </Link>
            <span className="text-border">·</span>
            <span>Улаанбаатар, Монгол</span>
          </div>
        </div>
      </main>
    </div>
  );
}