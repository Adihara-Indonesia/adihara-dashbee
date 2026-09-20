import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { EXPENSE_CATEGORIES } from "@/lib/pengeluaran/categories";

type DB = SupabaseClient<Database>;

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7); // "YYYY-MM"
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export type LabaRugiMonth = {
  month: string; // "YYYY-MM"
  pendapatanPenjualan: number;
  pendapatanLain: number;
  totalPendapatan: number;
  hpp: number;
  labaKotor: number;
  bebanByCategory: { category: string; amount: number }[];
  totalBeban: number;
  labaBersih: number;
  marginPercent: number;
};

export type LabaRugiReport = {
  months: LabaRugiMonth[];
  total: LabaRugiMonth;
};

/**
 * Mirrors the reference sheet's Laba Rugi tab: one column per calendar
 * month found in the data (not a rolling day-window, unlike the dashboard's
 * today/7d/30d filter — this report is inherently month-shaped), plus a
 * grand-total column. Formulas verified against the sheet's sample figures:
 * Laba Kotor = (Pendapatan Penjualan + Pendapatan Lain-lain) - HPP;
 * Laba Bersih = Laba Kotor - Total Beban Operasional.
 */
export async function getLabaRugiReport(supabase: DB): Promise<LabaRugiReport> {
  const [{ data: salesRows }, { data: expenseRows }, { data: incomeRows }] =
    await Promise.all([
      supabase.from("sales").select("sale_date, total_sales, total_cost"),
      supabase.from("expenses").select("expense_date, category, amount"),
      supabase.from("other_income").select("income_date, amount"),
    ]);

  const sales = salesRows ?? [];
  const expenses = expenseRows ?? [];
  const income = incomeRows ?? [];

  const monthKeys = new Set<string>([
    ...sales.map((r) => monthKey(r.sale_date)),
    ...expenses.map((r) => monthKey(r.expense_date)),
    ...income.map((r) => monthKey(r.income_date)),
  ]);

  function buildMonth(month: string | null): LabaRugiMonth {
    const monthSales = month
      ? sales.filter((r) => monthKey(r.sale_date) === month)
      : sales;
    const monthExpenses = month
      ? expenses.filter((r) => monthKey(r.expense_date) === month)
      : expenses;
    const monthIncome = month
      ? income.filter((r) => monthKey(r.income_date) === month)
      : income;

    const pendapatanPenjualan = sum(monthSales.map((r) => r.total_sales));
    const pendapatanLain = sum(monthIncome.map((r) => r.amount));
    const totalPendapatan = pendapatanPenjualan + pendapatanLain;
    const hpp = sum(monthSales.map((r) => r.total_cost));
    const labaKotor = totalPendapatan - hpp;

    const bebanByCategory = EXPENSE_CATEGORIES.map((category) => ({
      category,
      amount: sum(
        monthExpenses
          .filter((r) => r.category === category)
          .map((r) => r.amount),
      ),
    }));
    const totalBeban = sum(bebanByCategory.map((r) => r.amount));
    const labaBersih = labaKotor - totalBeban;
    const marginPercent =
      totalPendapatan === 0 ? 0 : (labaBersih / totalPendapatan) * 100;

    return {
      month: month ?? "total",
      pendapatanPenjualan,
      pendapatanLain,
      totalPendapatan,
      hpp,
      labaKotor,
      bebanByCategory,
      totalBeban,
      labaBersih,
      marginPercent,
    };
  }

  const months = [...monthKeys].sort().map((month) => buildMonth(month));

  return { months, total: buildMonth(null) };
}
