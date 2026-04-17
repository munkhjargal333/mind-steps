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
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 flex items-center justify-around"
      style={{
        height: 'var(--nav-height-mobile, 64px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        borderTop: '1px solid var(--border)',
        /* Warm glass effect */
        background: 'oklch(from var(--background) l c h / 0.88)',
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
      }}
    >
      {/* Subtle top highlight line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, oklch(from var(--primary) l c h / 0.25), transparent)',
        }}
      />

      {navItems.map((item) => {
        const active = pathname === item.href;
        const locked = item.isPro && userTier === 'free';

        return (
          <Link
            key={item.href}
            href={locked ? '#' : item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full relative',
              'transition-all duration-200',
              active ? '' : 'text-muted-foreground',
              locked && 'opacity-35',
            )}
            style={{ color: active ? 'var(--primary)' : undefined }}
          >
            {/* Active background pill */}
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, oklch(from var(--primary) l c h / 0.14), oklch(from var(--primary) l c h / 0.07))',
                  boxShadow: 'inset 0 0 0 1px oklch(from var(--primary) l c h / 0.18)',
                }}
              />
            )}

            <div className="relative z-10" style={{ marginTop: active ? '0' : '2px' }}>
              <item.icon
                size={active ? 19 : 20}
                strokeWidth={active ? 2.5 : 1.8}
                style={{
                  transition: 'all 200ms var(--ease-spring)',
                  filter: active
                    ? 'drop-shadow(0 1px 4px oklch(from var(--primary) l c h / 0.40))'
                    : 'none',
                }}
              />
              {locked && (
                <div
                  className="absolute -top-1 -right-1 rounded-full p-px"
                  style={{ background: 'var(--background)' }}
                >
                  <Lock
                    style={{ width: '9px', height: '9px', color: 'var(--muted-foreground)' }}
                  />
                </div>
              )}
            </div>

            <span
              className="z-10"
              style={{
                fontSize: '9.5px',
                fontWeight: active ? 700 : 500,
                letterSpacing: active ? '0.01em' : '0',
                lineHeight: 1,
                transition: 'all 200ms ease',
                color: active ? 'var(--primary)' : 'var(--muted-foreground)',
              }}
            >
              {item.label}
            </span>

            {/* Active bottom indicator */}
            {active && (
              <span
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: '6px',
                  width: '18px',
                  height: '3px',
                  borderRadius: '999px',
                  background: 'var(--primary)',
                  boxShadow: '0 0 10px oklch(from var(--primary) l c h / 0.6)',
                }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}