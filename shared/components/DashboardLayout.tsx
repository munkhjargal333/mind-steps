'use client';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer, DrawerAvatar } from './MobileDrawer';
import { useAuth } from '@/core/auth/AuthContext';
import { useTierContext } from '@/core/providers';
import { useState, useEffect } from 'react';
import { NAV_ITEMS } from '@/shared/constants/navItems';
import { getUserTier } from '@/shared/utils/userHelpers';
import { Sunrise } from 'lucide-react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { tier } = useTierContext();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userTier = getUserTier(tier);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-background pb-16 md:pb-0">
      {/* Desktop Sidebar */}
      <DesktopSidebar navItems={NAV_ITEMS} userTier={userTier} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 h-12 border-b border-border/60 bg-card/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-sm">MindSteps</span>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-border active:opacity-70 transition-opacity shrink-0"
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
