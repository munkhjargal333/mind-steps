// shared/constants/navItems.ts  ← ФАЙЛЫН БАЙРШИЛ
import { Home, BookOpen, Sparkles, BarChart2 } from 'lucide-react';
import type { NavItem } from '@/core/api/types';

/**
 * MVP 4-tab navigation
 * 1. Home     — Dashboard  /home
 * 2. Entries  — Journal    /entries
 * 3. Graph    — Graph      /graph
 * 4. Insights — Patterns   /insights
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/home',     label: 'Нүүр',     icon: Home,      isPro: false },
  { href: '/entries',  label: 'Тэмдэглэл', icon: BookOpen,  isPro: false },
  { href: '/graph',    label: 'График',    icon: BarChart2,  isPro: false },
  { href: '/insights', label: 'Паттерн',  icon: Sparkles,  isPro: false },
];