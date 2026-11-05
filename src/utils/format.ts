const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

/** 1200 -> "1.2 KG", 850 -> "850 G" */
export function formatWeight(g: number): string {
  if (g >= 1000) {
    return `${(Math.round(g / 100) / 10).toFixed(1)} KG`;
  }
  return `${Math.round(g)} G`;
}

export function formatGrams(g: number): string {
  return `${Math.round(g)} g`;
}

export function formatMl(ml: number): string {
  return `${Math.round(ml)} ml`;
}

export function formatDecimal(n: number, places: number = 1): string {
  return n.toFixed(places);
}

export function formatTempC(c: number): string {
  return `${(Math.round(c * 10) / 10).toFixed(1)} C`;
}

export function formatDate(d: Date): string {
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMonthYear(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function addMonths(d: Date, months: number): Date {
  const next = new Date(d.getTime());
  next.setMonth(next.getMonth() + months);
  return next;
}

export function daysUntil(d: Date, from: Date): number {
  return Math.round((d.getTime() - from.getTime()) / 86400000);
}

export function clockFromSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  const mm = Math.floor(s / 60);
  const ss = `${s % 60}`.padStart(2, '0');
  return `${mm}:${ss}`;
}
