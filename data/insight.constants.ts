// ─── Seed Insight cards ───────────────────────────────────────

export const INSIGHT_CARDS = [
  {
    key: 'mirror'  as const,
    label: 'Mirror',
    sub: '🫂 Чи дангаараа биш',
    dot: 'bg-blue-400',
    bg: 'bg-blue-50/60 dark:bg-blue-950/15',
  },
  {
    key: 'reframe' as const,
    label: 'Reframe',
    sub: '🌀 Өөр өнцгөөс харвал',
    dot: 'bg-violet-400',
    bg: 'bg-violet-50/60 dark:bg-violet-950/15',
  },
  {
    key: 'relief'  as const,
    label: 'Relief',
    sub: '🌱 Дотоод хүч чинь байсаар',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/15',
  },
] as const;
