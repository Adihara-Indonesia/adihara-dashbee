import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { percentChange } from "@/lib/dashboard/period";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { PurchasesOverview } from "@/lib/dashboard/queries";

export function PurchasesSection({ data }: { data: PurchasesOverview }) {
  const hasData = data.recent.length > 0;

  return (
    <Card title="Purchases overview">
      <StatCard
        label="Total purchases"
        value={formatCurrency(data.currentTotal)}
        changePercent={percentChange(data.currentTotal, data.previousTotal)}
      />

      <div className="mt-4">
        {hasData ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Product</th>
                  <th className="py-2 pr-3 font-medium">Category</th>
                  <th className="py-2 pr-3 text-right font-medium">Qty</th>
                  <th className="py-2 pl-3 text-right font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-3 text-gray-500">
                      {formatDateShort(row.purchase_date)}
                    </td>
                    <td className="py-2 pr-3 text-gray-900">{row.product_name}</td>
                    <td className="py-2 pr-3 text-gray-500">{row.category ?? "—"}</td>
                    <td className="py-2 pr-3 text-right text-gray-900">
                      {row.initial_stock}
                    </td>
                    <td className="py-2 pl-3 text-right font-medium text-gray-900">
                      {formatCurrency(row.initial_stock * row.unit_cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No purchases recorded for this period yet." />
        )}
      </div>
    </Card>
  );
}
