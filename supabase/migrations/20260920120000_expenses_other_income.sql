-- Pengeluaran (expenses) and Pemasukan Lain-lain (other_income) — aligned to the
-- team's reference Google Sheet tabs of the same name:
--   Pengeluaran:  Tanggal, Kategori, Deskripsi, Jumlah
--   Pemasukan:    (per-channel-per-month summary is computed from `sales`, not
--                 stored) + "Pemasukan Lain-lain": Tanggal, Sumber, Deskripsi, Jumlah
--
-- Same shape as purchases/sales/stock_opname in 20260912000000_dashbee_schema.sql:
-- whitelisted users can view everything; staff can create/edit/delete their own
-- rows; owner/admin can do so on any row.
--
-- `description` is `not null default ''` (not nullable) specifically so the
-- dedupe unique index below behaves predictably — Postgres treats NULLs as
-- distinct from each other, which would silently defeat the sheet-sync upsert's
-- `onConflict`.

-- ============================================================================
-- Expenses
-- ============================================================================

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null default current_date,
  category text not null,
  description text not null default '',
  amount numeric(12, 2) not null check (amount >= 0),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index expenses_expense_date_idx on public.expenses (expense_date);
create unique index expenses_dedupe_idx
  on public.expenses (expense_date, category, description, amount);

-- ============================================================================
-- Other income ("Pemasukan Lain-lain")
-- ============================================================================

create table public.other_income (
  id uuid primary key default gen_random_uuid(),
  income_date date not null default current_date,
  source text not null,
  description text not null default '',
  amount numeric(12, 2) not null check (amount >= 0),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index other_income_income_date_idx on public.other_income (income_date);
create unique index other_income_dedupe_idx
  on public.other_income (income_date, source, description, amount);

-- ============================================================================
-- Grants
-- ============================================================================
-- RLS policies only restrict rows within an operation that is already
-- permitted at the table level. Supabase does not grant SELECT/INSERT/
-- UPDATE/DELETE on new tables by default, so it must be done explicitly here
-- — the policies below are what actually narrow access per row.

grant select, insert, update, delete on
  public.expenses,
  public.other_income
to authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.expenses enable row level security;
alter table public.other_income enable row level security;

create policy "whitelisted users can select expenses"
  on public.expenses for select
  to authenticated
  using (public.is_whitelisted());

create policy "whitelisted users can insert expenses"
  on public.expenses for insert
  to authenticated
  with check (public.is_whitelisted() and created_by = auth.uid());

create policy "row owner or admin can update expenses"
  on public.expenses for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'))
  with check (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "row owner or admin can delete expenses"
  on public.expenses for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "whitelisted users can select other_income"
  on public.other_income for select
  to authenticated
  using (public.is_whitelisted());

create policy "whitelisted users can insert other_income"
  on public.other_income for insert
  to authenticated
  with check (public.is_whitelisted() and created_by = auth.uid());

create policy "row owner or admin can update other_income"
  on public.other_income for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'))
  with check (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "row owner or admin can delete other_income"
  on public.other_income for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

-- ============================================================================
-- service_role grant (mirrors 20260913115151_grant_service_role.sql for the
-- tables that migration predates)
-- ============================================================================

grant select, insert, update, delete on
  public.expenses,
  public.other_income
to service_role;
