import { Zap, BookOpen, Sparkles, BarChart2, Network } from 'lucide-react';
import type { NavItem } from '@/core/api/types';

/**
 * Глобал навигацийн цэсний тохиргоо
 * Бүх компонентууд энэ тогтмолыг ашиглана
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/home',     label: 'Тэмдэглэл', icon: Zap,       isPro: false },
  { href: '/entries',  label: 'Түүх',       icon: BookOpen,  isPro: false },
  { href: '/insights', label: 'Зөвлөмж',   icon: Sparkles,  isPro: true  },
  { href: '/emotions', label: 'Сэтгэл',    icon: BarChart2, isPro: false },
  { href: '/graph',    label: 'Цэнэ',       icon: Network,   isPro: false },
];
