'use client';

import { Sunrise, BookOpen, BarChart2, Sparkles, Network, Zap } from 'lucide-react';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';
import { useAuth } from '@/core/auth/AuthContext';
import { useThoughtContext } from '@/contexts/context';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/home',     label: 'Тэмдэглэл', icon: Zap,       isPro: false },
  { href: '/entries',  label: 'Түүх',       icon: BookOpen,  isPro: false },
  { href: '/insights', label: 'Зөвлөмж',   icon: Sparkles,  isPro: true  },
  { href: '/emotions', label: 'Сэтгэл',    icon: BarChart2, isPro: false },
  { href: '/graph',    label: 'Цэнэ',       icon: Network,   isPro: false },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { tier } = useThoughtContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const userTier = tier === 'pro' ? 'pro' : 'free';

  // Drawer нээлттэй үед scroll хаах
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Avatar үсэг
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name[0].toUpperCase()
    : user?.email?.[0].toUpperCase() ?? 'U';

  // Хэрэглэгчийн нэр
  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Хэрэглэгч';

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <DesktopSidebar navItems={NAV_ITEMS} userTier={userTier} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-base">MindSteps</span>
          </div>

          {/* Avatar button — open drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border active:opacity-70 transition-opacity shrink-0"
            aria-label="Цэс нээх"
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
            )}
          </button>
        </div>

        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav navItems={NAV_ITEMS} userTier={userTier} />

      {/* Mobile Side Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
