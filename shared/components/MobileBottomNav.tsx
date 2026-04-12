'use client';

import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { NavItem } from '@/core/api/types';
import { LockIcon } from './LockIcon';

interface MobileBottomNavProps {
  navItems: NavItem[];
  userTier: 'free' | 'pro';
}

export function MobileBottomNav({ navItems, userTier }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-background/80 backdrop-blur-xl border-t flex items-center justify-around px-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const locked = item.isPro && userTier === 'free';

        return (
          <Link
            key={item.href}
            href={locked ? '#' : item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
              active ? "text-primary" : "text-muted-foreground",
              locked && "opacity-40"
            )}
          >
            <div className="relative">
              <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              {locked && (
                <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
                  <LockIcon className="w-[10px] h-[10px]" />
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
            {active && (
              <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
