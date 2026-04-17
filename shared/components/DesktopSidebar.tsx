'use client';

import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/core/api/types';
import { Lock, Sunrise } from 'lucide-react';

interface DesktopSidebarProps {
  navItems: NavItem[];
  userTier: 'free' | 'pro';
}

export function DesktopSidebar({ navItems, userTier }: DesktopSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0"
      style={{
        width: 'var(--nav-width-desktop, 260px)',
        borderRight: '1px solid var(--border)',
        background: 'var(--sidebar)',
        minHeight: '100svh',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6"
        style={{
          height: '68px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: '34px',
            height: '34px',
            background: 'linear-gradient(135deg, oklch(0.70 0.18 65), oklch(0.58 0.20 42))',
            boxShadow: '0 2px 8px oklch(0.58 0.18 50 / 0.30)',
          }}
        >
          <Sunrise className="w-4.5 h-4.5 text-white" style={{ width: 25, height: 25 }} />
        </div>
        <div>
          <span
            className="font-bold"
            style={{
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              color: 'var(--foreground)',
            }}
          >
            MindSteps
          </span>
          <div
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              color: 'var(--muted-foreground)',
              textTransform: 'uppercase',
              marginTop: '-1px',
            }}
          >
            Сэтгэл зүйн туслах
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          const locked = item.isPro && userTier === 'free';

          return (
            <Link
              key={item.href}
              href={locked ? '#' : item.href}
              className={cn(
                'sidebar-link flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium',
                active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
                locked && 'opacity-40 cursor-not-allowed pointer-events-none',
              )}
              style={{
                background: active
                  ? 'linear-gradient(135deg, oklch(from var(--primary) l c h / 0.12), oklch(from var(--primary) l c h / 0.06))'
                  : 'transparent',
                boxShadow: active ? 'inset 0 0 0 1px oklch(from var(--primary) l c h / 0.20)' : 'none',
              }}
            >
              <span
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  width: '32px',
                  height: '32px',
                  background: active
                    ? 'linear-gradient(135deg, oklch(0.72 0.17 65), oklch(0.60 0.19 50))'
                    : 'var(--muted)',
                  color: active ? 'white' : 'var(--muted-foreground)',
                  boxShadow: active ? '0 2px 6px oklch(0.60 0.16 55 / 0.30)' : 'none',
                  transition: 'all 180ms var(--ease-spring)',
                }}
              >
                <item.icon size={15} />
              </span>
              <span className="flex-1" style={{ fontWeight: active ? 600 : 500 }}>
                {item.label}
              </span>
              {locked && (
                <Lock size={11} style={{ color: 'var(--muted-foreground)', opacity: 0.6 }} />
              )}
              {active && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, oklch(0.72 0.17 65), oklch(0.60 0.19 50))',
                    boxShadow: '0 0 6px oklch(0.70 0.16 65 / 0.5)',
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl"
          style={{ background: 'var(--muted)', opacity: 0.85 }}
        >
          <div
            className="rounded-lg flex items-center justify-center shrink-0"
            style={{
              width: '28px',
              height: '28px',
              background: userTier === 'pro'
                ? 'linear-gradient(135deg, oklch(0.58 0.20 288), oklch(0.48 0.22 270))'
                : 'linear-gradient(135deg, oklch(0.65 0.18 145), oklch(0.55 0.15 160))',
              boxShadow: '0 1px 4px oklch(0.3 0.08 50 / 0.20)',
            }}
          >
            <span style={{ fontSize: '11px' }}>{userTier === 'pro' ? '✦' : '○'}</span>
          </div>
          <div>
            <div
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                lineHeight: 1,
              }}
            >
              Одоогийн төлөвлөгөө
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: userTier === 'pro' ? 'var(--tier-pro-color)' : 'var(--tier-free-color)',
                lineHeight: 1.3,
                marginTop: '1px',
              }}
            >
              {userTier === 'pro' ? 'Pro ✦' : 'Free'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}