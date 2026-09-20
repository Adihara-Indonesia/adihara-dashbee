export type Period = "today" | "7d" | "30d";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function isPeriod(value: string | undefined): value is Period {
  return value === "today" || value === "7d" || value === "30d";
}

export type PeriodRange = {
  currentStart: string;
  currentEnd: string;
  previousStart: string;
  previousEnd: string;
};

const PERIOD_DAYS: Record<Period, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
};

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

/** Current period is the last N days (inclusive of today); the previous
 * period is the N days immediately before that, for the % change KPI. */
export function getPeriodRange(period: Period): PeriodRange {
  const days = PERIOD_DAYS[period];
  const today = new Date(toISODate(new Date()));

  const currentStart = addDays(today, -(days - 1));
  const previousEnd = addDays(currentStart, -1);
  const previousStart = addDays(previousEnd, -(days - 1));

  return {
    currentStart: toISODate(currentStart),
    currentEnd: toISODate(today),
    previousStart: toISODate(previousStart),
    previousEnd: toISODate(previousEnd),
  };
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
