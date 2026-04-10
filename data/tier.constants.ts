import type { Tier } from '@/types/types';

export type { Tier };

export const TIER_LABELS: Record<Tier, string> = {
  demo: 'Demo',
  free: 'Үнэгүй',
  pro: 'Pro',
};

export const TIER_COLORS: Record<Tier, string> = {
  demo: 'text-muted-foreground',
  free: 'text-muted-foreground',
  pro: 'text-amber-600 dark:text-amber-400',
};

export interface Plan {
  id: Tier;
  label: string;
  price: string;
  sub: string;
  color: string;
  badge?: string;
  description: string;
  highlight?: string;
  features: { text: string; ok: boolean }[];
}

export const PLANS: Plan[] = [
  {
    id: 'demo',
    label: 'Demo',
    price: '₮0',
    sub: 'үргэлжлэх хугацаагүй',
    color: 'text-muted-foreground',
    description: 'Системтэй танилцах түрвшин',
    features: [
      { text: 'Өдрийн тэмдэглэл бичих', ok: true },
      { text: 'Байнгын стрессийн менежмент', ok: false },
      { text: 'Гүнзгийрүүлсэн шинжилгээ', ok: false },
      { text: 'Хязгааргүй эмоци мэдээлэл', ok: false },
    ],
  },
  {
    id: 'free',
    label: 'Үнэгүй',
    price: '₮0',
    sub: 'үргэлжлэх хугацаагүй',
    color: 'text-foreground',
    description: 'Өдөр тутмын сэтгэл зүйн хэрэгцээнд',
    features: [
      { text: 'Өдрийн тэмдэглэл бичих', ok: true },
      { text: 'Байнгын стрессийн менежмент', ok: true },
      { text: 'Гүнзгийрүүлсэн шинжилгээ', ok: false },
      { text: 'Хязгааргүй эмоци мэдээлэл', ok: false },
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '₮9,900',
    sub: 'сард',
    color: 'text-violet-600 dark:text-violet-400',
    badge: 'Түгээмэл',
    description: 'Сэтгэл зүйн өсөлтийн бүрэн систем',
    highlight: 'Бүх функц нээлттэй + AI дүн шинжилгээ',
    features: [
      { text: 'Өдрийн тэмдэглэл бичих', ok: true },
      { text: 'Байнгын стрессийн менежмент', ok: true },
      { text: 'Гүнзгийрүүлсэн шинжилгээ', ok: true },
      { text: 'Хязгааргүй эмоци мэдээлэл', ok: true },
    ],
  },
];
