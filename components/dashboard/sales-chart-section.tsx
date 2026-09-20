import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SalesChart } from "@/components/charts/sales-chart";
import { percentChange } from "@/lib/dashboard/period";
import { formatCurrency } from "@/lib/format";
import type { SalesOverview } from "@/lib/dashboard/queries";

export function SalesChartSection({ data }: { data: SalesOverview }) {
  const hasData = data.chart.length > 0;

  return (
    <Card title="Ringkasan Penjualan">
      <StatCard
        label="Total Penjualan"
        value={formatCurrency(data.currentTotal)}
        changePercent={percentChange(data.currentTotal, data.previousTotal)}
      />

      <div className="mt-4">
        {hasData ? (
          <SalesChart data={data.chart} />
        ) : (
          <EmptyState message="Belum ada penjualan pada periode ini." />
        )}
      </div>
    </Card>
  );
}
