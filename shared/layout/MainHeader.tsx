'use client';

// shared/layout/MainHeader.tsx
// Top header for public/marketing pages (landing, login, join, upgrade).
// Auth-aware: shows Login or Dashboard CTA.

import Link from 'next/link';
import { Sunrise } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/shared/providers/auth.provider';

export function MainHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Sunrise size={20} className="text-primary" />
          MindSteps
        </Link>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" variant="outline" className="rounded-xl">
              <Link href="/home">Дашборд</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost" className="rounded-xl">
                <Link href="/login">Нэвтрэх</Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl">
                <Link href="/join">Бүртгүүлэх</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
