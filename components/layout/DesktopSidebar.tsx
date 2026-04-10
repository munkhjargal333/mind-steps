'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  isPro: boolean;
}

interface DesktopSidebarProps {
  navItems: NavItem[];
  userTier: 'free' | 'pro';
}

export function DesktopSidebar({ navItems, userTier }: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/40 shrink-0">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
          <path d="M12 3v18M3 12h18"/>
        </svg>
        <span className="text-lg font-bold">MindSteps</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const locked = item.isPro && userTier === 'free';

          return (
            <Link
              key={item.href}
              href={locked ? '#' : item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted",
                locked && "opacity-50 cursor-not-allowed"
              )}
            >
              <item.icon size={18} />
              <span className="flex-1">{item.label}</span>
              {locked && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
            Current Plan:{' '}
            <span className={cn(userTier === 'pro' ? "text-violet-500" : "text-orange-500")}>
              {userTier}
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
