'use client';

import Link from 'next/link';
import { ArrowLeft, Database, Lock, Share2, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { AppLogo } from '@/shared/components/AppLogo';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

const sections = [
  {
    icon: Database,
    number: '01',
    title: 'Мэдээлэл цуглуулах',
    content:
      'Бид таныг бүртгүүлэх үед и-мэйл хаяг болон нэрийг тань авдаг. Мөн таны апп дотор бичсэн тэмдэглэл, бодол болон хувийн хөгжлийн явцыг зөвхөн танд зориулан манай өгөгдлийн санд нууцлалтайгаар хадгална.',
  },
  {
    icon: Lock,
    number: '02',
    title: 'Мэдээллийн аюулгүй байдал',
    content:
      'Таны бүх өгөгдөл орчин үеийн шифрлэлтийн (encryption) технологиор хамгаалагдана. Бид таны нууц үгийг хэзээ ч шууд текстээр хадгалдаггүй бөгөөд зөвхөн таныг нэвтрэх эрхтэй байх бүх боломжийг хангадаг.',
  },
  {
    icon: Share2,
    number: '03',
    title: 'Гуравдагч талд дамжуулах',
    content:
      'MindSteps нь хэрэглэгчийн хувийн мэдээлэл болон тэмдэглэлийг хэзээ ч зарж борлуулахгүй, маркетинг болон сурталчилгааны зорилгоор бусдад дамжуулахгүй. Таны өгөгдөл зөвхөн таны апп-ын туршлагыг сайжруулахад ашиглагдана.',
  },
  {
    icon: EyeOff,
    number: '04',
    title: 'Таны эрх',
    content:
      'Та хүссэн үедээ өөрийн мэдээллийг шинэчлэх, устгах эрхтэй. Хэрэв та бүртгэлээ устгахаар шийдвэрлэвэл таны бүх тэмдэглэл болон хувийн мэдээлэл манай серверээс бүрмөсөн устах болно.',
  },
];

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3 h-3" />
            Нууцлал · 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Нууцлалын бодлого
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Таны хувийн орон зай манайд аюулгүй. Бид таны итгэлийг хамгаалахын тулд
            мэдээллийн нууцлалыг дээд зэргээр хангадаг.
          </p>
        </div>

        {/* ── Sections ── */}
        <div className="divide-y divide-border">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.number} className="py-10 grid md:grid-cols-[5rem_1fr] gap-4 md:gap-8 group">
                <div className="md:pt-1">
                  <span className="text-3xl font-black text-border group-hover:text-primary/30 transition-colors leading-none tabular-nums">
                    {section.number}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-14 pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MindSteps. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors underline-offset-4 hover:underline">
              Үйлчилгээний нөхцөл
            </Link>
            <span className="text-border">·</span>
            <span>Улаанбаатар, Монгол</span>
          </div>
        </div>
      </main>
    </div>
  );
}