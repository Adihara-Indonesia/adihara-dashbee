-- Dashbee initial schema: auth gating (whitelist/leads), profiles,
-- business info, and the sales/purchases/stock-opname tables.
--
-- purchases/sales/stock_opname columns are aligned to the team's reference
-- Google Sheets:
--   purchase:      Kode Produk, Nama Produk, Kategori, Warna, Ukuran,
--                  Harga Beli (HPP), Harga Jual, Stok Awal (1 Jul 2026)
--   sales:         Tanggal, No. Order, Sales Channel, Kode Produk,
--                  Nama Produk, Warna, Ukuran, Qty, Harga Jual/Unit,
--                  Total Penjualan, HPP/Unit, Total HPP, Laba Kotor
--   stock opname:  Kode Produk, Nama Produk, Warna, Ukuran, Stok Awal,
--                  Total Terjual, Stok Sistem, Stok Fisik (hitung gudang),
--                  Selisih, Keterangan
--
-- Bootstrap note: whitelist gates the whole app, including owner/admin —
-- there is no UI in this phase, so the very first owner must be created by
-- hand (e.g. via the Supabase SQL editor, after they've signed in once so
-- their profiles row exists):
--   insert into public.whitelist (email) values ('owner@yourcompany.com');
--   update public.profiles set role = 'owner' where id = '<their auth.users id>';
-- This matters beyond login: Postgres combines an UPDATE/DELETE policy's
-- USING clause with the table's SELECT policy using AND, so an owner/admin
-- who isn't whitelisted will silently match 0 rows when updating someone
-- else's profile/business_info/sales/purchases/stock_opname row, even
-- though their role passes the owner/admin check.

create extension if not exists "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================

create type public.user_role as enum ('owner', 'admin', 'staff');
create type public.lead_source as enum ('google_sso', 'email_password');

-- ============================================================================
-- Auth gating: whitelist + leads
-- ============================================================================

create table public.whitelist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Rows are inserted server-side (service role) during the login callback
-- when a signed-in email is not on the whitelist yet — never from the client.
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source public.lead_source not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Profiles — one row per authenticated user
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role public.user_role not null default 'staff',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- RLS helper functions (security definer to avoid RLS recursion when a
-- policy needs to read profiles/whitelist itself)
-- ============================================================================

create function public.is_whitelisted()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.whitelist w
    where lower(w.email) = lower(auth.jwt() ->> 'email')
  );
$$;

create function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ============================================================================
-- Triggers: auto-provision profile, keep updated_at fresh, block role
-- self-escalation
-- ============================================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Only owner/admin may change a profile's role (prevents self-escalation
-- through the "users can update own profile" policy below).
create function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and public.current_user_role() not in ('owner', 'admin') then
    raise exception 'Only owner/admin can change a user role';
  end if;
  return new;
end;
$$;

create trigger prevent_profiles_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ============================================================================
-- Business info (single row, editable from the Admin page)
-- ============================================================================

create table public.business_info (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  address text,
  phone text,
  email text,
  updated_at timestamptz not null default now()
);

create trigger set_business_info_updated_at
  before update on public.business_info
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Purchases — product master + opening stock per SKU
-- ============================================================================

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  purchase_date date not null default current_date,
  product_code text not null,
  product_name text not null,
  category text,
  color text,
  size text,
  initial_stock integer not null default 0 check (initial_stock >= 0),
  unit_cost numeric(12, 2) not null check (unit_cost >= 0),
  sell_price numeric(12, 2) not null check (sell_price >= 0),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index purchases_product_code_idx on public.purchases (product_code);

-- ============================================================================
-- Sales
-- ============================================================================

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null,
  order_no text not null,
  sales_channel text not null,
  product_code text not null,
  product_name text not null,
  color text,
  size text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  total_sales numeric(12, 2) generated always as (quantity * unit_price) stored,
  unit_cost numeric(12, 2) not null check (unit_cost >= 0),
  total_cost numeric(12, 2) generated always as (quantity * unit_cost) stored,
  gross_profit numeric(12, 2)
    generated always as (quantity * unit_price - quantity * unit_cost) stored,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index sales_product_code_idx on public.sales (product_code);
create index sales_sale_date_idx on public.sales (sale_date);

-- ============================================================================
-- Stock opname
-- ============================================================================

create table public.stock_opname (
  id uuid primary key default gen_random_uuid(),
  count_date date not null default current_date,
  product_code text not null,
  product_name text not null,
  color text,
  size text,
  initial_stock integer not null check (initial_stock >= 0),
  total_sold integer not null default 0 check (total_sold >= 0),
  system_stock integer generated always as (initial_stock - total_sold) stored,
  physical_stock integer not null check (physical_stock >= 0),
  difference integer
    generated always as (physical_stock - (initial_stock - total_sold)) stored,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index stock_opname_product_code_idx on public.stock_opname (product_code);
create index stock_opname_count_date_idx on public.stock_opname (count_date);

-- ============================================================================
-- Grants
-- ============================================================================
-- RLS policies only restrict rows within an operation that is already
-- permitted at the table level. Supabase does not grant SELECT/INSERT/
-- UPDATE/DELETE on new tables by default, so it must be done explicitly here
-- — the policies below are what actually narrow access per row.

grant select, insert, update, delete on
  public.whitelist,
  public.leads,
  public.profiles,
  public.business_info,
  public.purchases,
  public.sales,
  public.stock_opname
to authenticated;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.whitelist enable row level security;
alter table public.leads enable row level security;
alter table public.profiles enable row level security;
alter table public.business_info enable row level security;
alter table public.purchases enable row level security;
alter table public.sales enable row level security;
alter table public.stock_opname enable row level security;

-- whitelist: owner/admin only.
create policy "owner/admin can select whitelist"
  on public.whitelist for select
  to authenticated
  using (public.current_user_role() in ('owner', 'admin'));

create policy "owner/admin can manage whitelist"
  on public.whitelist for all
  to authenticated
  using (public.current_user_role() in ('owner', 'admin'))
  with check (public.current_user_role() in ('owner', 'admin'));

-- leads: owner/admin review sign-up attempts; insert happens server-side
-- with the service role key, so no insert policy is defined here.
create policy "owner/admin can select leads"
  on public.leads for select
  to authenticated
  using (public.current_user_role() in ('owner', 'admin'));

create policy "owner/admin can delete leads"
  on public.leads for delete
  to authenticated
  using (public.current_user_role() in ('owner', 'admin'));

-- profiles: whitelisted users can view all profiles (for "created_by"
-- attribution); a user can update their own row; owner/admin can update or
-- delete any profile (role changes are further gated by the trigger above).
create policy "whitelisted users can select profiles"
  on public.profiles for select
  to authenticated
  using (public.is_whitelisted());

create policy "users can update own profile, admins can update any"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.current_user_role() in ('owner', 'admin'))
  with check (id = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "owner/admin can delete profiles"
  on public.profiles for delete
  to authenticated
  using (public.current_user_role() in ('owner', 'admin'));

-- business_info: whitelisted users can view; only owner/admin can change it.
create policy "whitelisted users can select business_info"
  on public.business_info for select
  to authenticated
  using (public.is_whitelisted());

create policy "owner/admin can manage business_info"
  on public.business_info for all
  to authenticated
  using (public.current_user_role() in ('owner', 'admin'))
  with check (public.current_user_role() in ('owner', 'admin'));

-- purchases / sales / stock_opname: whitelisted users can view everything;
-- staff can create/edit/delete their own rows; owner/admin can do so on any
-- row.
create policy "whitelisted users can select purchases"
  on public.purchases for select
  to authenticated
  using (public.is_whitelisted());

create policy "whitelisted users can insert purchases"
  on public.purchases for insert
  to authenticated
  with check (public.is_whitelisted() and created_by = auth.uid());

create policy "row owner or admin can update purchases"
  on public.purchases for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'))
  with check (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "row owner or admin can delete purchases"
  on public.purchases for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "whitelisted users can select sales"
  on public.sales for select
  to authenticated
  using (public.is_whitelisted());

create policy "whitelisted users can insert sales"
  on public.sales for insert
  to authenticated
  with check (public.is_whitelisted() and created_by = auth.uid());

create policy "row owner or admin can update sales"
  on public.sales for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'))
  with check (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "row owner or admin can delete sales"
  on public.sales for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "whitelisted users can select stock_opname"
  on public.stock_opname for select
  to authenticated
  using (public.is_whitelisted());

create policy "whitelisted users can insert stock_opname"
  on public.stock_opname for insert
  to authenticated
  with check (public.is_whitelisted() and created_by = auth.uid());

create policy "row owner or admin can update stock_opname"
  on public.stock_opname for update
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'))
  with check (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));

create policy "row owner or admin can delete stock_opname"
  on public.stock_opname for delete
  to authenticated
  using (created_by = auth.uid() or public.current_user_role() in ('owner', 'admin'));
