import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ChannelPieChart } from "@/components/charts/channel-pie-chart";
import { MonthlyComparisonChart } from "@/components/charts/monthly-comparison-chart";
import { formatCurrency } from "@/lib/format";
import type { BusinessSummary } from "@/lib/dashboard/queries";

export function BusinessSummarySection({ data }: { data: BusinessSummary }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Penjualan"
          value={formatCurrency(data.totalPenjualan)}
          changePercent={null}
        />
        <StatCard
          label="Total HPP"
          value={formatCurrency(data.totalHpp)}
          changePercent={null}
        />
        <StatCard
          label="Laba Kotor"
          value={formatCurrency(data.labaKotor)}
          changePercent={null}
        />
        <StatCard
          label="Total Beban Operasional"
          value={formatCurrency(data.totalBebanOperasional)}
          changePercent={null}
        />
        <StatCard
          label="Laba Bersih"
          value={formatCurrency(data.labaBersih)}
          changePercent={null}
        />
        <StatCard
          label="Margin Laba Bersih"
          value={`${data.marginLabaBersih.toFixed(1)}%`}
          changePercent={null}
        />
        <StatCard
          label="Total Pesanan"
          value={String(data.totalPesanan)}
          changePercent={null}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Penjualan per Sales Channel">
          {data.salesByChannel.length > 0 ? (
            <ChannelPieChart data={data.salesByChannel} />
          ) : (
            <EmptyState message="Belum ada penjualan." />
          )}
        </Card>
        <Card title="Pendapatan vs Beban vs Laba per Bulan">
          {data.monthly.length > 0 ? (
            <MonthlyComparisonChart data={data.monthly} />
          ) : (
            <EmptyState message="Belum ada data untuk grafik ini." />
          )}
        </Card>
      </div>
    </div>
  );
}
