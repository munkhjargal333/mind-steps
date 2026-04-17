'use client';

import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { NavItem } from '@/core/api/types';
import { Lock } from 'lucide-react';

interface MobileBottomNavProps {
  navItems: NavItem[];
  userTier: 'free' | 'pro';
}

export function MobileBottomNav({ navItems, userTier }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-card/80 backdrop-blur-xl border-t border-border/60 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const locked = item.isPro && userTier === 'free';

        return (
          <Link
            key={item.href}
            href={locked ? '#' : item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-150',
              active ? 'text-primary' : 'text-muted-foreground/60',
              locked && 'opacity-40',
            )}
          >
            <div className="relative">
              {active ? (
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon size={18} strokeWidth={2.5} className="text-primary" />
                </div>
              ) : (
                <item.icon size={20} strokeWidth={1.8} />
              )}
              {locked && (
                <div className="absolute -top-1 -right-1 bg-card rounded-full p-0.5">
                  <Lock className="w-[9px] h-[9px]" />
                </div>
              )}
            </div>
            <span className={cn('text-[10px] font-medium transition-all', active && 'text-primary font-semibold')}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
