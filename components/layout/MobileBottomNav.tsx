'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  isPro: boolean;
}

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
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
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
