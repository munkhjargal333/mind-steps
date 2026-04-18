'use client';

import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { NavItem } from '@/core/api/types';
import { Lock } from 'lucide-react';

export function MobileBottomNav({ navItems, userTier }: { navItems: NavItem[]; userTier: string }) {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
      style={{
        height: 'var(--nav-height-mobile, 68px)', // Өндрийг бага зэрэг хаслаа
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundColor: 'oklch(0.12 0.02 65)', 
        borderTop: '1px solid oklch(0.20 0.02 65)',
      }}
    >
      <div className="grid grid-cols-3 h-full w-full">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const locked = item.isPro && userTier === 'free';

          return (
            <Link
              key={item.href}
              href={locked ? '#' : item.href}
              className={cn(
                'relative flex flex-col items-center justify-center transition-all',
                locked && 'opacity-30'
              )}
            >
              {/* Active Block — Одоо арай жижигхэн (inset-2.5) */}
              {active && (
                <div
                  className="absolute shadow-md"
                  style={{
                    inset: '6px 8px', // Дээд доороосоо 6px, хажуунаасаа 8px зайтай
                    background: 'linear-gradient(135deg, oklch(0.70 0.16 65), oklch(0.58 0.18 42))',
                    borderRadius: '6px', // Ирмэгийг нь маш бага зөөлрүүлэв
                    zIndex: 0,
                  }}
                />
              )}

              {/* Icon & Label */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <item.icon
                  size={20} // Icon-ыг бага зэрэг жижиг болгов
                  strokeWidth={active ? 2.5 : 2}
                  style={{
                    color: active ? 'oklch(0.12 0.02 65)' : 'oklch(0.92 0.02 65 / 0.45)',
                    transition: 'color 0.2s ease',
                  }}
                />
                
                <span
                  className="uppercase text-[9px] font-bold tracking-tight"
                  style={{
                    color: active ? 'oklch(0.12 0.02 65)' : 'oklch(0.92 0.02 65 / 0.45)',
                  }}
                >
                  {item.label}
                </span>

                {locked && (
                  <Lock 
                    size={8} 
                    className="absolute -top-1 -right-2 opacity-50"
                    style={{ color: active ? 'oklch(0.12 0.02 65)' : 'white' }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}