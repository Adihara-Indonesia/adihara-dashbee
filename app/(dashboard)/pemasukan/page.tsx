import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE, parsePage, sanitizeSearchTerm } from "@/lib/crud/list-query";
import { SearchBox } from "@/components/crud/search-box";
import { Pagination } from "@/components/crud/pagination";
import { ConfirmDeleteModal } from "@/components/crud/confirm-delete-modal";
import { IncomeTable } from "@/components/pemasukan/income-table";
import { IncomeFormModal } from "@/components/pemasukan/income-form-modal";
import { ChannelSummaryTable } from "@/components/pemasukan/channel-summary-table";
import { Card } from "@/components/ui/card";
import { getSalesByChannelByMonth } from "@/lib/pemasukan/queries";
import { deleteIncomeAction } from "./actions";
import type { UserRole } from "@/types/database";

export default async function PemasukanPage({
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
    .from("other_income")
    .select("*", { count: "exact" })
    .order("income_date", { ascending: false });

  if (q) {
    const term = sanitizeSearchTerm(q);
    query = query.or(`source.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const [{ data: rows, count }, channelSummary] = await Promise.all([
    query.range(from, to),
    getSalesByChannelByMonth(supabase),
  ]);
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const editingRow =
    modal === "edit" && id
      ? (
          await supabase.from("other_income").select("*").eq("id", id).single()
        ).data
      : null;

  const deletingRow =
    modal === "delete" && id
      ? (
          await supabase
            .from("other_income")
            .select("id, source, description")
            .eq("id", id)
            .single()
        ).data
      : null;

  const baseQuery = new URLSearchParams();
  if (q) baseQuery.set("q", q);
  const queryString = baseQuery.toString();
  const returnTo = queryString ? `/pemasukan?${queryString}` : "/pemasukan";

  function hrefWith(extra: Record<string, string>) {
    const params = new URLSearchParams(baseQuery);
    params.set("page", String(page));
    Object.entries(extra).forEach(([key, value]) => params.set(key, value));
    return `/pemasukan?${params.toString()}`;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-4 font-serif text-xl font-semibold text-gray-900">
        Pemasukan
      </h1>

      <div className="mb-6">
        <Card title="Pemasukan dari Penjualan per Channel per Bulan">
          <ChannelSummaryTable data={channelSummary} />
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">
          Pemasukan Lain-lain
        </h2>
        <Link
          href={hrefWith({ modal: "create" })}
          className="rounded-lg bg-honey px-4 py-2 text-sm font-bold text-honey-ink transition-colors hover:bg-[#ffb654]"
        >
          + Tambah Pemasukan
        </Link>
      </div>

      <div className="mb-4">
        <SearchBox placeholder="Cari sumber, deskripsi…" />
      </div>

      <IncomeTable
        rows={rows ?? []}
        currentUserId={user!.id}
        currentUserRole={currentUserRole}
        editHrefFor={(rowId) => hrefWith({ modal: "edit", id: rowId })}
        deleteHrefFor={(rowId) => hrefWith({ modal: "delete", id: rowId })}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/pemasukan"
        query={queryString}
      />

      {modal === "create" && (
        <IncomeFormModal mode="create" returnTo={returnTo} />
      )}
      {modal === "edit" && editingRow && (
        <IncomeFormModal
          mode="edit"
          defaultValues={editingRow}
          returnTo={returnTo}
        />
      )}
      {modal === "delete" && deletingRow && (
        <ConfirmDeleteModal
          id={deletingRow.id}
          itemLabel={`${deletingRow.source} — ${deletingRow.description}`}
          returnTo={returnTo}
          action={deleteIncomeAction}
        />
      )}
    </div>
  );
}
