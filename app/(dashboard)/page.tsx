import { createClient } from "@/lib/supabase/server";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { RefreshDataButton } from "@/components/dashboard/refresh-data-button";
import { SalesChartSection } from "@/components/dashboard/sales-chart-section";
import { SalesTableSection } from "@/components/dashboard/sales-table-section";
import { PurchasesSection } from "@/components/dashboard/purchases-section";
import { StockOpnameSection } from "@/components/dashboard/stock-opname-section";
import { getPeriodRange, isPeriod, type Period } from "@/lib/dashboard/period";
import {
  getPurchasesOverview,
  getSalesOverview,
  getStockOpnameOverview,
} from "@/lib/dashboard/queries";

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; error?: string }>;
}) {
  const { period: periodParam, error } = await searchParams;
  const period: Period = isPeriod(periodParam) ? periodParam : "30d";
  const range = getPeriodRange(period);

  const supabase = await createClient();

  const [sales, purchases, stockOpname] = await Promise.all([
    getSalesOverview(supabase, range),
    getPurchasesOverview(supabase, range),
    getStockOpnameOverview(supabase, range),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {error === "not_authorized" && (
        <div
          className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          You don&apos;t have access to that page.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <div className="flex flex-wrap items-center gap-3">
          <PeriodFilter current={period} />
          <RefreshDataButton />
        </div>
      </div>

      <div className="space-y-6">
        <SalesChartSection data={sales} />
        <SalesTableSection data={sales} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PurchasesSection data={purchases} />
          <StockOpnameSection data={stockOpname} />
        </div>
      </div>
    </div>
  );
}
