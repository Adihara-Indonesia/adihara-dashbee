import Link from "next/link";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { Expense, UserRole } from "@/types/database";

export function ExpenseTable({
  rows,
  currentUserId,
  currentUserRole,
  editHrefFor,
  deleteHrefFor,
}: {
  rows: Expense[];
  currentUserId: string;
  currentUserRole: UserRole;
  editHrefFor: (id: string) => string;
  deleteHrefFor: (id: string) => string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[10px] border border-dashed border-gray-200 text-sm text-gray-400">
        Belum ada pengeluaran.
      </div>
    );
  }

  function canManage(row: Expense) {
    return currentUserRole !== "staff" || row.created_by === currentUserId;
  }

  return (
    <div className="overflow-x-auto rounded-[10px] border border-gray-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Deskripsi</th>
            <th className="px-4 py-3 text-right font-medium">Jumlah</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500 font-mono">
                {formatDateShort(row.expense_date)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="inline-flex rounded-full bg-warn-soft px-2 py-0.5 text-xs font-semibold text-warn">
                  {row.category}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-900">{row.description}</td>
              <td className="px-4 py-3 text-right font-mono font-medium text-gray-900">
                {formatCurrency(row.amount)}
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
