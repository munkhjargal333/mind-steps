'use client';

import { Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useAuth } from '@/core/auth/AuthContext';
import { useTierContext } from '@/core/providers';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { getUserInitials, getDisplayName, getUserTier } from '@/shared/utils/userHelpers';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Avatar компонент - DashboardLayout болон MobileDrawer-т ашиглана
 */
export function DrawerAvatar({ user }: { user: User | null | undefined }) {
  const initials = getUserInitials(user);
  const displayName = getDisplayName(user);

  if (user?.user_metadata?.avatar_url) {
    return (
      <Image
        src={user.user_metadata.avatar_url}
        alt={displayName}
        width={48}
        height={48}
        className="rounded-full object-cover ring-2 ring-border"
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg shrink-0">
      {initials}
    </div>
  );
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { logout, user } = useAuth();
  const { tier } = useTierContext();

  const userTier = getUserTier(tier);
  const displayName = getDisplayName(user);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r flex flex-col",
          "transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header: хэрэглэгчийн мэдээлэл */}
        <div className="p-5 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <path d="M12 3v18M3 12h18"/>
              </svg>
              <span className="font-bold text-sm">MindSteps</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              aria-label="Хаах"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Avatar + нэр + имэйл */}
          <div className="flex items-center gap-3">
            <DrawerAvatar user={user} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>

          {/* Plan badge */}
          <div className="mt-3">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                userTier === 'pro'
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
              )}
            >
              <span>{userTier === 'pro' ? '✦' : '⚡'}</span>
              {userTier} план
            </span>
          </div>
        </div>

        {/* Navigation / Upgrade */}
        <div className="flex-1 p-3 flex flex-col justify-end">
          {userTier !== 'pro' && (
            <Link
              href="/upgrade"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm font-semibold shadow-md hover:from-violet-600 hover:to-violet-700 transition-all"
            >
              <Sparkles size={18} />
              <div className="flex-1">
                <p className="leading-none">Pro руу шилжих</p>
                <p className="text-[10px] font-normal text-violet-200 mt-0.5">Бүх боломжийг нээх</p>
              </div>
              <ChevronRight size={16} className="opacity-70" />
            </Link>
          )}
        </div>

        {/* Footer: theme toggle + logout */}
        <div className="p-3 border-t space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
            <span className="flex-1 text-sm font-medium text-muted-foreground">Харанхуй горим</span>
            <ThemeToggle />
          </div>

          <button
            onClick={() => { onClose(); logout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Гарах</span>
          </button>
        </div>
      </aside>
    </>
  );
}
