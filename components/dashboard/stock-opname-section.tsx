import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateShort } from "@/lib/format";
import type { StockOpnameOverview } from "@/lib/dashboard/queries";

export function StockOpnameSection({ data }: { data: StockOpnameOverview }) {
  const hasData = data.rows.length > 0;

  return (
    <Card title="Ringkasan Stok Opname">
      <div>
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-gray-400">
          Selisih Ditemukan
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="font-mono text-[17px] font-semibold text-gray-900">
            {data.discrepancyCount}
          </p>
          <span className="text-sm text-gray-400">
            dari {data.totalCount} dihitung
          </span>
        </div>
      </div>

      <div className="mt-4">
        {!hasData && (
          <EmptyState message="Belum ada data stok opname pada periode ini." />
        )}
      </div>

      {hasData && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-3 font-medium">Tanggal</th>
                <th className="py-2 pr-3 font-medium">Produk</th>
                <th className="py-2 pr-3 text-right font-medium">
                  Stok Sistem
                </th>
                <th className="py-2 pr-3 text-right font-medium">
                  Stok Fisik
                </th>
                <th className="py-2 pl-3 text-right font-medium">Selisih</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const isMismatch = row.difference !== 0;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      isMismatch ? "bg-danger-soft/60" : ""
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
                        isMismatch ? "text-danger" : "text-gray-900"
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
