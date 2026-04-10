'use client';

// shared/layout/DashboardLayout.tsx
// Shell layout for all authenticated dashboard routes.
// Nav + bottom bar live here; page content goes into {children}.

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BarChart2, Sparkles, Network } from 'lucide-react';
import { cn } from '@/shared/lib/utils/utils';

const NAV_ITEMS = [
  { href: '/home',     label: 'Нүүр',       icon: Home      },
  { href: '/entries',  label: 'Түүх',        icon: BookOpen  },
  { href: '/emotions', label: 'Мэдрэмж',     icon: BarChart2 },
  { href: '/insights', label: 'Зөвлөмж',     icon: Sparkles  },
  { href: '/graph',    label: 'Граф',         icon: Network   },
] as const;

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Page content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/70'
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className={cn('text-[10px] font-medium', active && 'font-semibold')}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
