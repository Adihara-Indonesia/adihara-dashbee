-- The login flow upserts into leads (one row per email, latest attempt
-- wins) instead of logging every retry as a separate row.
alter table public.leads add constraint leads_email_key unique (email);
