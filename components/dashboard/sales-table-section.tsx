import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { SalesOverview } from "@/lib/dashboard/queries";

export function SalesTableSection({ data }: { data: SalesOverview }) {
  const hasData = data.recent.length > 0;

  return (
    <Card title="Recent sales">
      {hasData ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Order</th>
                <th className="py-2 pr-3 font-medium">Product</th>
                <th className="py-2 pr-3 font-medium">Channel</th>
                <th className="py-2 pl-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-3 text-gray-500">
                    {formatDateShort(row.sale_date)}
                  </td>
                  <td className="py-2 pr-3 text-gray-900">{row.order_no}</td>
                  <td className="py-2 pr-3 text-gray-900">{row.product_name}</td>
                  <td className="py-2 pr-3 text-gray-500">{row.sales_channel}</td>
                  <td className="py-2 pl-3 text-right font-medium text-gray-900">
                    {formatCurrency(row.total_sales)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No sales recorded for this period yet." />
      )}
    </Card>
  );
}
