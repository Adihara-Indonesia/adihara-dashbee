import Link from "next/link";
import { formatCurrency, formatDateShort } from "@/lib/format";
import type { Purchase, UserRole } from "@/types/database";

export function PurchasesTable({
  rows,
  currentUserId,
  currentUserRole,
  editHrefFor,
  deleteHrefFor,
}: {
  rows: Purchase[];
  currentUserId: string;
  currentUserRole: UserRole;
  editHrefFor: (id: string) => string;
  deleteHrefFor: (id: string) => string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-gray-200 text-sm text-gray-400">
        No purchases found.
      </div>
    );
  }

  function canManage(row: Purchase) {
    return currentUserRole !== "staff" || row.created_by === currentUserId;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Stock qty</th>
            <th className="px-4 py-3 text-right font-medium">Cost value</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {formatDateShort(row.purchase_date)}
              </td>
              <td className="px-4 py-3 text-gray-900">
                {row.product_name}
                {(row.color || row.size) && (
                  <span className="ml-1 text-gray-400">
                    ({[row.color, row.size].filter(Boolean).join(" / ")})
                  </span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {row.category ?? "—"}
              </td>
              <td className="px-4 py-3 text-right text-gray-900">
                {row.initial_stock}
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-900">
                {formatCurrency(row.initial_stock * row.unit_cost)}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                {canManage(row) ? (
                  <div className="flex justify-end gap-3">
                    <Link
                      href={editHrefFor(row.id)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={deleteHrefFor(row.id)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
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
