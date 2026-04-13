// shared/constants/navItems.ts  ← ФАЙЛЫН БАЙРШИЛ
import { Home, BookOpen, Sparkles } from 'lucide-react';
import type { NavItem } from '@/core/api/types';

/**
 * MVP 3-tab navigation
 * 1. Home     — Dashboard  /home
 * 2. Entries  — Journal    /entries
 * 3. Insights — Patterns   /insights
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/home',     label: 'Нүүр',     icon: Home,     isPro: false },
  { href: '/entries',  label: 'Тэмдэглэл', icon: BookOpen, isPro: false },
  { href: '/insights', label: 'Ойлголт',  icon: Sparkles, isPro: false },
];