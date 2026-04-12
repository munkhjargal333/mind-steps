import type { User } from '@/core/api/types';

/**
 * Хэрэглэгчийн avatar-ийн үсгийг гаргаж авна
 */
export function getUserInitials(user: User | null | undefined): string {
  return user?.user_metadata?.full_name
    ? user.user_metadata.full_name[0].toUpperCase()
    : user?.email?.[0].toUpperCase() ?? 'U';
}

/**
 * Хэрэглэгчийн нэрийг харуулна
 */
export function getDisplayName(user: User | null | undefined): string {
  return user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Хэрэглэгч';
}

/**
 * Хэрэглэгчийн tier-ийг тодорхойлно
 */
export function getUserTier(tier: 'demo' | 'free' | 'pro' | undefined): 'free' | 'pro' {
  return tier === 'pro' ? 'pro' : 'free';
}
