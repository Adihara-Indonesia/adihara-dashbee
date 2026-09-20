-- The sheet sync upserts one row per natural key so re-running it never
-- duplicates rows: one purchases row per SKU, one sales row per order line,
-- one stock_opname row per SKU per count date.
alter table public.purchases
  add constraint purchases_product_code_key unique (product_code);

alter table public.sales
  add constraint sales_order_no_product_code_key unique (order_no, product_code);

alter table public.stock_opname
  add constraint stock_opname_product_code_count_date_key unique (product_code, count_date);
