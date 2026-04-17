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
    <div
      className="flex min-h-screen"
      style={{
        background: 'var(--background)',
        paddingBottom: 'var(--nav-height-mobile, 64px)',
      }}
    >
      {/* Decorative background gradient — subtle warmth */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 20% 0%, oklch(0.80 0.10 65 / 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, oklch(0.65 0.12 42 / 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar navItems={NAV_ITEMS} userTier={userTier} />

      {/* Main Content */}
      <main
        className="flex-1 min-w-0 overflow-y-auto relative"
        style={{ zIndex: 1 }}
      >
        {/* Mobile topbar */}
        <div
          className="md:hidden flex items-center justify-between px-4 sticky top-0 z-30"
          style={{
            height: '56px',
            borderBottom: '1px solid var(--border)',
            background: 'oklch(from var(--background) l c h / 0.88)',
            backdropFilter: 'blur(16px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: '30px',
                height: '30px',
                background: 'linear-gradient(135deg, oklch(0.70 0.18 65), oklch(0.58 0.20 42))',
                boxShadow: '0 2px 6px oklch(0.55 0.18 50 / 0.28)',
              }}
            >
              <Sunrise style={{ width: '15px', height: '15px', color: 'white' }} />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
                color: 'var(--foreground)',
              }}
            >
              MindSteps
            </span>
          </div>

          {/* Avatar button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="active:opacity-70 transition-opacity"
            aria-label="Цэс нээх"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--border)',
              boxShadow: '0 1px 4px oklch(0.3 0.05 50 / 0.12)',
            }}
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