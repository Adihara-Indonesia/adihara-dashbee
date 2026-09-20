import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE, parsePage, sanitizeSearchTerm } from "@/lib/crud/list-query";
import { SearchBox } from "@/components/crud/search-box";
import { Pagination } from "@/components/crud/pagination";
import { ConfirmDeleteModal } from "@/components/crud/confirm-delete-modal";
import { SalesTable } from "@/components/sales/sales-table";
import { SaleFormModal } from "@/components/sales/sale-form-modal";
import { deleteSaleAction } from "./actions";
import type { UserRole } from "@/types/database";

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    modal?: string;
    id?: string;
  }>;
}) {
  const { q = "", page: pageParam, modal, id } = await searchParams;
  const page = parsePage(pageParam);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();
  const currentUserRole: UserRole = profile?.role ?? "staff";

  let query = supabase
    .from("sales")
    .select("*", { count: "exact" })
    .order("sale_date", { ascending: false });

  if (q) {
    const term = sanitizeSearchTerm(q);
    query = query.or(
      `product_name.ilike.%${term}%,order_no.ilike.%${term}%,product_code.ilike.%${term}%`,
    );
  }

  const { data: rows, count } = await query.range(from, to);
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const editingRow =
    modal === "edit" && id
      ? (await supabase.from("sales").select("*").eq("id", id).single()).data
      : null;

  const deletingRow =
    modal === "delete" && id
      ? (await supabase
          .from("sales")
          .select("id, order_no, product_name")
          .eq("id", id)
          .single()).data
      : null;

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);
  const queryString = baseQuery.toString();
  const returnTo = queryString ? `/sales?${queryString}` : "/sales";

  function hrefWith(extra: Record<string, string>) {
    const params = new URLSearchParams(baseQuery);
    params.set("page", String(page));
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    return `/sales?${params.toString()}`;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Sales</h1>
        <Link
          href={hrefWith({ modal: "create" })}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add New
        </Link>
      </div>

      <div className="mb-4">
        <SearchBox placeholder="Search product, order no…" />
      </div>

      <SalesTable
        rows={rows ?? []}
        currentUserId={user!.id}
        currentUserRole={currentUserRole}
        editHrefFor={(rowId) => hrefWith({ modal: "edit", id: rowId })}
        deleteHrefFor={(rowId) => hrefWith({ modal: "delete", id: rowId })}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/sales"
        query={queryString}
      />

      {modal === "create" && (
        <SaleFormModal mode="create" returnTo={returnTo} />
      )}
      {modal === "edit" && editingRow && (
        <SaleFormModal
          mode="edit"
          defaultValues={editingRow}
          returnTo={returnTo}
        />
      )}
      {modal === "delete" && deletingRow && (
        <ConfirmDeleteModal
          id={deletingRow.id}
          itemLabel={`${deletingRow.order_no} — ${deletingRow.product_name}`}
          returnTo={returnTo}
          action={deleteSaleAction}
        />
      )}
    </div>
  );
}
