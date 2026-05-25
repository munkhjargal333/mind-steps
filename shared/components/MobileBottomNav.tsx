'use client';

import { cn } from '@/shared/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { NavItem } from '@/core/api/types';
import { Lock, Plus } from 'lucide-react';

export function MobileBottomNav({ navItems, userTier }: { navItems: NavItem[]; userTier: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Навигацийн зүйлсийг 2+2 болгон хувааж, дунд нь + товч байрлуулна
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  function handleWrite() {
    router.push('/write');
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
      style={{
        height: 'var(--nav-height-mobile, 68px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundColor: 'oklch(0.12 0.02 65)',
        borderTop: '1px solid oklch(0.20 0.02 65)',
      }}
    >
      <div className="flex h-full w-full items-center">
        {/* Зүүн 2 tab */}
        {leftItems.map((item) => (
          <NavTab key={item.href} item={item} active={pathname === item.href} userTier={userTier} />
        ))}

        {/* Дунд + товч */}
        <div className="flex-shrink-0 flex items-center justify-center" style={{ width: '72px' }}>
          <button
            onClick={handleWrite}
            aria-label="Шинэ тэмдэглэл"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, oklch(0.70 0.16 65), oklch(0.58 0.18 42))',
              boxShadow: '0 4px 14px oklch(0.55 0.18 50 / 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px oklch(0.55 0.18 50 / 0.3)';
            }}
            onPointerUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px oklch(0.55 0.18 50 / 0.45)';
            }}
            onPointerLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px oklch(0.55 0.18 50 / 0.45)';
            }}
          >
            <Plus size={24} strokeWidth={2.5} color="oklch(0.10 0.02 65)" />
          </button>
        </div>

        {/* Баруун 2 tab */}
        {rightItems.map((item) => (
          <NavTab key={item.href} item={item} active={pathname === item.href} userTier={userTier} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({
  item,
  active,
  userTier,
}: {
  item: NavItem;
  active: boolean;
  userTier: string;
}) {
  const locked = item.isPro && userTier === 'free';

  return (
    <Link
      href={locked ? '#' : item.href}
      className={cn(
        'relative flex flex-col items-center justify-center transition-all flex-1 h-full',
        locked && 'opacity-30'
      )}
    >
      {/* Active background block */}
      {active && (
        <div
          className="absolute shadow-md"
          style={{
            inset: '6px 8px',
            background: 'linear-gradient(135deg, oklch(0.70 0.16 65), oklch(0.58 0.18 42))',
            borderRadius: '6px',
            zIndex: 0,
          }}
        />
      )}

      {/* Icon & Label */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <item.icon
          size={20}
          strokeWidth={active ? 2.5 : 2}
          style={{
            color: active ? 'oklch(0.12 0.02 65)' : 'oklch(0.92 0.02 65 / 0.45)',
            transition: 'color 0.2s ease',
          }}
        />

        <span
          className="uppercase text-[9px] font-bold tracking-tight"
          style={{
            color: active ? 'oklch(0.12 0.02 65)' : 'oklch(0.92 0.02 65 / 0.45)',
          }}
        >
          {item.label}
        </span>

        {locked && (
          <Lock
            size={8}
            className="absolute -top-1 -right-2 opacity-50"
            style={{ color: active ? 'oklch(0.12 0.02 65)' : 'white' }}
          />
        )}
      </div>
    </Link>
  );
}