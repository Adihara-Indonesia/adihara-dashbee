import { createClient } from "@/lib/supabase/server";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { RefreshDataButton } from "@/components/dashboard/refresh-data-button";
import { BusinessSummarySection } from "@/components/dashboard/business-summary-section";
import { SalesChartSection } from "@/components/dashboard/sales-chart-section";
import { SalesTableSection } from "@/components/dashboard/sales-table-section";
import { PurchasesSection } from "@/components/dashboard/purchases-section";
import { StockOpnameSection } from "@/components/dashboard/stock-opname-section";
import { getPeriodRange, isPeriod, type Period } from "@/lib/dashboard/period";
import {
  getBusinessSummary,
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

  const [summary, sales, purchases, stockOpname] = await Promise.all([
    getBusinessSummary(supabase),
    getSalesOverview(supabase, range),
    getPurchasesOverview(supabase, range),
    getStockOpnameOverview(supabase, range),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {error === "not_authorized" && (
        <div
          className="mb-6 rounded-md bg-danger-soft px-4 py-3 text-sm text-danger"
          role="alert"
        >
          Anda tidak memiliki akses ke halaman tersebut.
        </div>
      )}

      <div className="mb-6">
        <h1 className="font-serif text-xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Ringkasan bisnis — data menyeluruh (bukan berdasarkan filter periode
          di bawah).
        </p>
      </div>

      <div className="mb-8">
        <BusinessSummarySection data={summary} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">Aktivitas Terbaru</h2>
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
