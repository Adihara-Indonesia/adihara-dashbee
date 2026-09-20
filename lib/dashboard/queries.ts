import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { PeriodRange } from "./period";
import { getLabaRugiReport } from "@/lib/laba-rugi/queries";

type DB = SupabaseClient<Database>;

export type ChartPoint = { date: string; total: number };

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

function groupByDate(
  rows: { date: string; value: number }[],
): ChartPoint[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.value);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, total]) => ({ date, total }));
}

// ---------------------------------------------------------------------------
// Sales
// ---------------------------------------------------------------------------

export type SalesRecent = {
  id: string;
  sale_date: string;
  order_no: string;
  product_name: string;
  quantity: number;
  total_sales: number;
  sales_channel: string;
};

export type SalesOverview = {
  currentTotal: number;
  previousTotal: number;
  chart: ChartPoint[];
  recent: SalesRecent[];
};

export async function getSalesOverview(
  supabase: DB,
  range: PeriodRange,
): Promise<SalesOverview> {
  const [{ data: currentRows }, { data: previousRows }] = await Promise.all([
    supabase
      .from("sales")
      .select(
        "id, sale_date, order_no, product_name, quantity, total_sales, sales_channel",
      )
      .gte("sale_date", range.currentStart)
      .lte("sale_date", range.currentEnd)
      .order("sale_date", { ascending: false }),
    supabase
      .from("sales")
      .select("total_sales")
      .gte("sale_date", range.previousStart)
      .lte("sale_date", range.previousEnd),
  ]);

  const current = currentRows ?? [];
  const previous = previousRows ?? [];

  return {
    currentTotal: sum(current.map((r) => r.total_sales)),
    previousTotal: sum(previous.map((r) => r.total_sales)),
    chart: groupByDate(
      current.map((r) => ({ date: r.sale_date, value: r.total_sales })),
    ),
    recent: current.slice(0, 8),
  };
}

// ---------------------------------------------------------------------------
// Purchases
// ---------------------------------------------------------------------------

export type PurchasesRecent = {
  id: string;
  purchase_date: string;
  product_name: string;
  category: string | null;
  initial_stock: number;
  unit_cost: number;
};

export type PurchasesOverview = {
  currentTotal: number;
  previousTotal: number;
  chart: ChartPoint[];
  recent: PurchasesRecent[];
};

export async function getPurchasesOverview(
  supabase: DB,
  range: PeriodRange,
): Promise<PurchasesOverview> {
  const [{ data: currentRows }, { data: previousRows }] = await Promise.all([
    supabase
      .from("purchases")
      .select(
        "id, purchase_date, product_name, category, initial_stock, unit_cost",
      )
      .gte("purchase_date", range.currentStart)
      .lte("purchase_date", range.currentEnd)
      .order("purchase_date", { ascending: false }),
    supabase
      .from("purchases")
      .select("initial_stock, unit_cost")
      .gte("purchase_date", range.previousStart)
      .lte("purchase_date", range.previousEnd),
  ]);

  const current = currentRows ?? [];
  const previous = previousRows ?? [];
  const spend = (rows: { initial_stock: number; unit_cost: number }[]) =>
    sum(rows.map((r) => r.initial_stock * r.unit_cost));

  return {
    currentTotal: spend(current),
    previousTotal: spend(previous),
    chart: groupByDate(
      current.map((r) => ({
        date: r.purchase_date,
        value: r.initial_stock * r.unit_cost,
      })),
    ),
    recent: current.slice(0, 8),
  };
}

// ---------------------------------------------------------------------------
// Stock opname
// ---------------------------------------------------------------------------

export type StockOpnameRow = {
  id: string;
  product_code: string;
  product_name: string;
  count_date: string;
  system_stock: number;
  physical_stock: number;
  difference: number;
};

export type StockOpnameOverview = {
  discrepancyCount: number;
  totalCount: number;
  rows: StockOpnameRow[];
};

export async function getStockOpnameOverview(
  supabase: DB,
  range: PeriodRange,
): Promise<StockOpnameOverview> {
  const { data } = await supabase
    .from("stock_opname")
    .select(
      "id, product_code, product_name, count_date, system_stock, physical_stock, difference",
    )
    .gte("count_date", range.currentStart)
    .lte("count_date", range.currentEnd)
    .order("count_date", { ascending: false });

  const rows = data ?? [];

  return {
    discrepancyCount: rows.filter((r) => r.difference !== 0).length,
    totalCount: rows.length,
    rows,
  };
}

// ---------------------------------------------------------------------------
// Business summary — mirrors the reference sheet's Dashboard tab (KPIs +
// per-channel and per-month charts). Unlike the sections above, this is an
// all-time-to-date summary rather than a rolling day-window: the sheet's own
// Dashboard is "Juli - 20 September 2026 (up to date)", not a 7d/30d filter,
// and the monthly chart is inherently month-shaped. Reuses
// getLabaRugiReport's totals so the two pages can never disagree on the
// Laba Kotor / Laba Bersih formulas.
// ---------------------------------------------------------------------------

export type BusinessSummary = {
  totalPenjualan: number;
  totalHpp: number;
  labaKotor: number;
  totalBebanOperasional: number;
  labaBersih: number;
  marginLabaBersih: number;
  totalPesanan: number;
  salesByChannel: { channel: string; total: number }[];
  monthly: { month: string; pendapatan: number; beban: number; labaBersih: number }[];
};

export async function getBusinessSummary(supabase: DB): Promise<BusinessSummary> {
  const [{ data: salesRows }, report] = await Promise.all([
    supabase.from("sales").select("sales_channel, total_sales"),
    getLabaRugiReport(supabase),
  ]);
  const sales = salesRows ?? [];

  const channelTotals = new Map<string, number>();
  for (const row of sales) {
    channelTotals.set(
      row.sales_channel,
      (channelTotals.get(row.sales_channel) ?? 0) + row.total_sales,
    );
  }
  const salesByChannel = [...channelTotals.entries()]
    .map(([channel, total]) => ({ channel, total }))
    .sort((a, b) => b.total - a.total);

  return {
    totalPenjualan: report.total.pendapatanPenjualan,
    totalHpp: report.total.hpp,
    labaKotor: report.total.labaKotor,
    totalBebanOperasional: report.total.totalBeban,
    labaBersih: report.total.labaBersih,
    marginLabaBersih: report.total.marginPercent,
    totalPesanan: sales.length,
    salesByChannel,
    monthly: report.months.map((m) => ({
      month: m.month,
      pendapatan: m.totalPendapatan,
      beban: m.totalBeban,
      labaBersih: m.labaBersih,
    })),
  };
}
