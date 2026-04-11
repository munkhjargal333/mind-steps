// shared/utils/formatDate.ts
// Date formatting utility

export function formatDate(date: Date | string, locale: string = 'mn-MN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
