import { formatCurrency, formatMonthLabel } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";
import type { SalesByChannelByMonth } from "@/lib/pemasukan/queries";

export function ChannelSummaryTable({ data }: { data: SalesByChannelByMonth }) {
  if (data.rows.length === 0) {
    return <EmptyState message="Belum ada data penjualan." />;
  }

  return (
    <div className="overflow-x-auto rounded-[10px] border border-gray-200">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Bulan</th>
            <th className="px-4 py-3 font-medium">Sales Channel</th>
            <th className="px-4 py-3 text-right font-medium">
              Total Pemasukan
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.rows.map((row) => (
            <tr key={`${row.month}-${row.channel}`}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {formatMonthLabel(row.month)}
              </td>
              <td className="px-4 py-3 text-gray-900">{row.channel}</td>
              <td className="px-4 py-3 text-right font-mono font-medium text-gray-900">
                {formatCurrency(row.total)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-gray-200 bg-gray-50">
            <td className="px-4 py-3 font-semibold text-gray-900" colSpan={2}>
              Subtotal Penjualan
            </td>
            <td className="px-4 py-3 text-right font-mono font-bold text-gray-900">
              {formatCurrency(data.subtotal)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
