import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateShort } from "@/lib/format";
import type { StockOpnameOverview } from "@/lib/dashboard/queries";

export function StockOpnameSection({ data }: { data: StockOpnameOverview }) {
  const hasData = data.rows.length > 0;

  return (
    <Card title="Stock opname overview">
      <div>
        <p className="text-sm text-gray-500">Discrepancies found</p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-gray-900">
            {data.discrepancyCount}
          </p>
          <span className="text-sm text-gray-400">
            of {data.totalCount} counted
          </span>
        </div>
      </div>

      <div className="mt-4">
        {!hasData && (
          <EmptyState message="No stock opname counts recorded for this period yet." />
        )}
      </div>

      {hasData && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Product</th>
                <th className="py-2 pr-3 text-right font-medium">Expected qty</th>
                <th className="py-2 pr-3 text-right font-medium">Actual qty</th>
                <th className="py-2 pl-3 text-right font-medium">Difference</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const isMismatch = row.difference !== 0;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      isMismatch ? "bg-red-50/60" : ""
                    }`}
                  >
                    <td className="py-2 pr-3 text-gray-500">
                      {formatDateShort(row.count_date)}
                    </td>
                    <td className="py-2 pr-3 text-gray-900">{row.product_name}</td>
                    <td className="py-2 pr-3 text-right text-gray-900">
                      {row.system_stock}
                    </td>
                    <td className="py-2 pr-3 text-right text-gray-900">
                      {row.physical_stock}
                    </td>
                    <td
                      className={`py-2 pl-3 text-right font-medium ${
                        isMismatch ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {row.difference > 0 ? `+${row.difference}` : row.difference}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
