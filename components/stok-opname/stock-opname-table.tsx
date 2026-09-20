import Link from "next/link";
import { formatDateShort } from "@/lib/format";
import type { StockOpname, UserRole } from "@/types/database";

export function StockOpnameTable({
  rows,
  currentUserId,
  currentUserRole,
  editHrefFor,
  deleteHrefFor,
}: {
  rows: StockOpname[];
  currentUserId: string;
  currentUserRole: UserRole;
  editHrefFor: (id: string) => string;
  deleteHrefFor: (id: string) => string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[10px] border border-dashed border-gray-200 text-sm text-gray-400">
        Belum ada data stok opname.
      </div>
    );
  }

  function canManage(row: StockOpname) {
    return currentUserRole !== "staff" || row.created_by === currentUserId;
  }

  return (
    <div className="overflow-x-auto rounded-[10px] border border-gray-200">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 font-medium">Produk</th>
            <th className="px-4 py-3 text-right font-medium">Stok Awal</th>
            <th className="px-4 py-3 text-right font-medium">
              Total Terjual
            </th>
            <th className="px-4 py-3 text-right font-medium">Stok Sistem</th>
            <th className="px-4 py-3 text-right font-medium">Stok Fisik</th>
            <th className="px-4 py-3 text-right font-medium">Selisih</th>
            <th className="px-4 py-3 font-medium">Keterangan</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500 font-mono">
                {formatDateShort(row.count_date)}
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
                {row.initial_stock}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">
                {row.total_sold}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">
                {row.system_stock}
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">
                {row.physical_stock}
              </td>
              <td
                className={`px-4 py-3 text-right font-mono font-medium ${
                  row.difference === 0
                    ? "text-gray-900"
                    : row.difference > 0
                      ? "text-good"
                      : "text-danger"
                }`}
              >
                {row.difference > 0 ? `+${row.difference}` : row.difference}
              </td>
              <td className="px-4 py-3 text-gray-500">{row.notes ?? "—"}</td>
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
