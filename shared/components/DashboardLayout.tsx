'use client';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer, DrawerAvatar } from './MobileDrawer';
import { useAuth } from '@/core/auth/AuthContext';
import { useTierContext } from '@/core/providers';
import { useState, useEffect } from 'react';
import { NAV_ITEMS } from '@/shared/constants/navItems';
import { getUserTier } from '@/shared/utils/userHelpers';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { tier } = useTierContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userTier = getUserTier(tier);

  // Drawer нээлттэй үед scroll хаах
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <DesktopSidebar navItems={NAV_ITEMS} userTier={userTier} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
              <path d="M12 3v18M3 12h18"/>
            </svg>
            <span className="font-bold text-base">MindSteps</span>
          </div>

          {/* Avatar button — open drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border active:opacity-70 transition-opacity shrink-0"
            aria-label="Цэс нээх"
          >
            <DrawerAvatar user={user} />
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
