/** Fixed set of expense categories, matching the reference sheet's
 * Pengeluaran/Laba Rugi tabs exactly (same order as the Laba Rugi "Beban
 * Operasional" breakdown) — kept as a closed set rather than free text so
 * the Laba Rugi report's per-category grouping never fragments on typos. */
export const EXPENSE_CATEGORIES = [
  "Sewa Gudang/Toko",
  "Gaji Karyawan",
  "Biaya Admin Marketplace",
  "Marketing/Iklan",
  "Packaging & Ongkir",
  "Listrik & Internet",
  "Lain-lain",
  "Transportasi",
] as const;
