import Link from "next/link";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { Sale, UserRole } from "@/types/database";

export function SalesTable({
  rows,
  currentUserId,
  currentUserRole,
  editHrefFor,
  deleteHrefFor,
}: {
  rows: Sale[];
  currentUserId: string;
  currentUserRole: UserRole;
  editHrefFor: (id: string) => string;
  deleteHrefFor: (id: string) => string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[10px] border border-dashed border-gray-200 text-sm text-gray-400">
        Belum ada penjualan.
      </div>
    );
  }

  function canManage(row: Sale) {
    return currentUserRole !== "staff" || row.created_by === currentUserId;
  }

  return (
    <div className="overflow-x-auto rounded-[10px] border border-gray-200">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 font-medium">No. Order</th>
            <th className="px-4 py-3 font-medium">Channel</th>
            <th className="px-4 py-3 font-medium">Produk</th>
            <th className="px-4 py-3 text-right font-medium">Qty</th>
            <th className="px-4 py-3 text-right font-medium">
              Total Penjualan
            </th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500 font-mono">
                {formatDateShort(row.sale_date)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                {row.order_no}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {row.sales_channel}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {row.product_name}
                {(row.color || row.size) && (
                  <span className="ml-1 text-gray-400">
                    ({[row.color, row.size].filter(Boolean).join(" / ")})
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">
                {row.quantity}
              </td>
              <td className="px-4 py-3 text-right font-mono font-medium text-gray-900">
                {formatCurrency(row.total_sales)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                {canManage(row) ? (
                  <div className="flex justify-end gap-3">
                    <Link
                      href={editHrefFor(row.id)}
                      className="font-medium text-honey-deep hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={deleteHrefFor(row.id)}
                      className="font-medium text-danger hover:underline"
                    >
                      Hapus
                    </Link>
                  </div>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
