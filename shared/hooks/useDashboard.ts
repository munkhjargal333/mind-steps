// shared/hooks/useDashboard.ts
// ─────────────────────────────────────────────────────────────────────────────
// Tiny domain hooks used by the dashboard.
// Previously inlined as plain functions inside HomePage.tsx.
// ─────────────────────────────────────────────────────────────────────────────

// ── useGreeting ───────────────────────────────────────────────────────────────

/**
 * Returns a time-aware Mongolian greeting string.
 * Re-evaluates once on mount (no interval — the greeting doesn't need to be live).
 */
export function useGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Өглөөний мэнд';
  if (h < 18) return 'Өдрийн мэнд';
  return 'Оройн мэнд';
}

// ── useHawkins ────────────────────────────────────────────────────────────────

interface HawkinsResult {
  label: string;
  /** Tailwind color class for display */
  cls: string;
}

/**
 * Maps a Hawkins scale EWMA value to a label + color class.
 * Returns null when ewma is null/undefined.
 */
export function useHawkins(ewma: number | null | undefined): HawkinsResult | null {
  if (ewma == null) return null;
  if (ewma >= 350) return { label: 'Хүлээн зөвшөөрөл', cls: 'text-teal-600 dark:text-teal-400' };
  if (ewma >= 250) return { label: 'Хүлцэл',            cls: 'text-sky-600 dark:text-sky-400' };
  if (ewma >= 200) return { label: 'Зоримог байдал',    cls: 'text-green-600 dark:text-green-400' };
  if (ewma >= 150) return { label: 'Бардамнал',         cls: 'text-orange-600 dark:text-orange-400' };
  return               { label: 'Айдас / Гуниг',     cls: 'text-indigo-600 dark:text-indigo-400' };
}