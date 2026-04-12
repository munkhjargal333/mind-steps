// shared/constants/nav.constants.ts
// Navigation items configuration

import type { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '/',         label: 'Нүүр',              isPro: false },
  { href: '/journal',  label: 'Өдрийн тэмдэглэл',  isPro: false },
  { href: '/emotions', label: 'Эмоци',              isPro: false },
  { href: '/insights', label: 'Дүн шинжилгээ',      isPro: true  },
  { href: '/goals',    label: 'Зорилго',             isPro: true  },
  { href: '/lessons',  label: 'Хичээл',              isPro: true  },
];
