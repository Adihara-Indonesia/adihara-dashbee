-- The original schema migration granted table privileges to `authenticated`
-- only. That was enough on the hosted project (its `service_role` already
-- has broad access some other way), but a plain/local Postgres+PostgREST
-- stack does not grant `service_role` anything on new tables either — our
-- admin client (lib/supabase/admin.ts) uses the service role key for
-- privileged server-only writes (leads, business_info, sheet sync, admin
-- user management) and needs this explicitly, the same as `authenticated`
-- did. Discovered by testing the Phase 6 admin logic against a local
-- Supabase instance, where these writes failed with "permission denied."
grant select, insert, update, delete on
  public.whitelist,
  public.leads,
  public.profiles,
  public.business_info,
  public.purchases,
  public.sales,
  public.stock_opname
to service_role;
