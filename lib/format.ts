const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** "2026-07" -> "Juli 2026" — used by month-grouped reports (Laba Rugi,
 * Pemasukan per channel, the dashboard's monthly comparison chart). */
export function formatMonthLabel(yyyyMM: string): string {
  const [year, month] = yyyyMM.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(isoDate: string): string {
  // Parse the date parts directly and format in UTC so a date-only string
  // like "2026-09-12" can't shift to the previous/next day depending on
  // the reader's local timezone offset.
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
