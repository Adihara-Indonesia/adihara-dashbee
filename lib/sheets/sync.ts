import "server-only";
import { JWT } from "google-auth-library";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert } from "@/types/database";

// Tab names in the reference spreadsheet. Not secrets, so they're constants
// rather than env vars — update here if the team renames a tab.
const SHEET_TABS = {
  purchases: "Produk",
  sales: "Penjualan",
  stockOpname: "Stok Opname",
  expenses: "Pengeluaran",
  income: "Pemasukan",
} as const;

export type SyncSummary = {
  purchases: number;
  sales: number;
  stockOpname: number;
  expenses: number;
  otherIncome: number;
};

export async function syncSheetToSupabase(): Promise<SyncSummary> {
  const spreadsheetId = requireEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
  const auth = getAuthClient();

  const [purchaseRows, salesRows, stockOpnameRows, expenseRows, incomeRows] =
    await Promise.all([
      fetchSheetRows(auth, spreadsheetId, SHEET_TABS.purchases),
      fetchSheetRows(auth, spreadsheetId, SHEET_TABS.sales),
      fetchSheetRows(auth, spreadsheetId, SHEET_TABS.stockOpname),
      fetchSheetRows(auth, spreadsheetId, SHEET_TABS.expenses),
      fetchSheetRows(auth, spreadsheetId, SHEET_TABS.income),
    ]);

  const purchases = rowsToRecords(purchaseRows).map(mapPurchaseRow).filter(isNotNull);
  const sales = rowsToRecords(salesRows).map(mapSalesRow).filter(isNotNull);
  const stockOpname = rowsToRecords(stockOpnameRows)
    .map(mapStockOpnameRow)
    .filter(isNotNull);
  // The Pengeluaran tab has a single table, header anchored by "Kategori".
  const expenses = rowsToRecords(expenseRows, "Kategori")
    .map(mapExpenseRow)
    .filter(isNotNull);
  // The Pemasukan tab has two stacked tables — a per-channel-per-month sales
  // summary (skipped; computed from `sales` instead) followed by "Pemasukan
  // Lain-lain", whose header is the only one in the tab with a "Sumber" cell.
  const otherIncome = rowsToRecords(incomeRows, "Sumber")
    .map(mapOtherIncomeRow)
    .filter(isNotNull);

  const admin = createAdminClient();

  if (purchases.length > 0) {
    const { error } = await admin
      .from("purchases")
      .upsert(purchases, { onConflict: "product_code" });
    if (error) throw new Error(`purchases upsert failed: ${error.message}`);
  }

  if (sales.length > 0) {
    const { error } = await admin
      .from("sales")
      .upsert(sales, { onConflict: "order_no,product_code" });
    if (error) throw new Error(`sales upsert failed: ${error.message}`);
  }

  if (stockOpname.length > 0) {
    const { error } = await admin
      .from("stock_opname")
      .upsert(stockOpname, { onConflict: "product_code,count_date" });
    if (error) throw new Error(`stock_opname upsert failed: ${error.message}`);
  }

  if (expenses.length > 0) {
    const { error } = await admin
      .from("expenses")
      .upsert(expenses, {
        onConflict: "expense_date,category,description,amount",
      });
    if (error) throw new Error(`expenses upsert failed: ${error.message}`);
  }

  if (otherIncome.length > 0) {
    const { error } = await admin
      .from("other_income")
      .upsert(otherIncome, {
        onConflict: "income_date,source,description,amount",
      });
    if (error) throw new Error(`other_income upsert failed: ${error.message}`);
  }

  return {
    purchases: purchases.length,
    sales: sales.length,
    stockOpname: stockOpname.length,
    expenses: expenses.length,
    otherIncome: otherIncome.length,
  };
}

// ---------------------------------------------------------------------------
// Google Sheets fetch
// ---------------------------------------------------------------------------

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getAuthClient(): JWT {
  const email = requireEnv("GOOGLE_SHEETS_CLIENT_EMAIL");
  // Service account keys are stored with literal "\n" sequences in env vars.
  const key = requireEnv("GOOGLE_SHEETS_PRIVATE_KEY").replace(/\\n/g, "\n");

  return new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

async function fetchSheetRows(
  auth: JWT,
  spreadsheetId: string,
  tabName: string,
): Promise<unknown[][]> {
  const { token } = await auth.getAccessToken();
  const range = encodeURIComponent(`${tabName}!A1:ZZ10000`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}` +
    `?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to read sheet tab "${tabName}": ${response.status} ${await response.text()}`,
    );
  }

  const json = (await response.json()) as { values?: unknown[][] };
  return json.values ?? [];
}

// ---------------------------------------------------------------------------
// Row parsing helpers
// ---------------------------------------------------------------------------

type SheetRow = Record<string, unknown>;

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * Each tab has a title row and a description row before the real header
 * (e.g. "Master Produk" / "Data induk produk..." / blank / "Kode Produk",
 * ...), so the header can't be assumed to be row 1 — this scans for the
 * first row containing an anchor cell (default "Kode Produk", present on
 * Produk/Penjualan/Stok Opname — matched anywhere in the row, not just index
 * 0). Pengeluaran and Pemasukan don't have a "Kode Produk" column, so their
 * callers pass a different anchor ("Kategori" / "Sumber"); Pemasukan's tab
 * also has an *earlier*, unrelated header row (its per-channel-per-month
 * summary table), so "Sumber" — unique to the "Pemasukan Lain-lain" header —
 * is what skips past it to the right table.
 */
function findHeaderRowIndex(rows: unknown[][], anchor = "Kode Produk"): number {
  const target = normalizeHeader(anchor);
  return rows.findIndex((row) =>
    row.some((cell) => normalizeHeader(String(cell ?? "")) === target),
  );
}

function rowsToRecords(rows: unknown[][], anchor = "Kode Produk"): SheetRow[] {
  const headerIndex = findHeaderRowIndex(rows, anchor);
  if (headerIndex === -1) return [];

  const [header, ...body] = rows.slice(headerIndex);
  const keys = header.map((cell) => normalizeHeader(String(cell ?? "")));

  return body
    .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
    .map((row) => {
      const record: SheetRow = {};
      keys.forEach((key, i) => {
        record[key] = row[i];
      });
      return record;
    });
}

function get(record: SheetRow, header: string): unknown {
  return record[normalizeHeader(header)];
}

/** Falls back to the first key that starts with `prefix` (case/spacing
 * insensitive) — used for the "Stok Awal (1 Jul 2026)" style header, whose
 * suffix changes as the sheet is updated over time. */
function getByPrefix(record: SheetRow, prefix: string): unknown {
  const normalizedPrefix = normalizeHeader(prefix);
  const key = Object.keys(record).find((k) => k.startsWith(normalizedPrefix));
  return key ? record[key] : undefined;
}

function str(value: unknown): string {
  return value === undefined || value === null ? "" : String(value).trim();
}

function strOrNull(value: unknown): string | null {
  const s = str(value);
  return s === "" ? null : s;
}

function num(value: unknown): number {
  if (typeof value === "number") return value;
  const cleaned = str(value).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Sheets serial dates count days since 1899-12-30. */
function serialToISODate(serial: number): string {
  const utcMs = Math.round((serial - 25569) * 86400 * 1000);
  return new Date(utcMs).toISOString().slice(0, 10);
}

function dateStr(value: unknown): string {
  if (typeof value === "number") return serialToISODate(value);
  const parsed = new Date(str(value));
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString().slice(0, 10)
    : parsed.toISOString().slice(0, 10);
}

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

// ---------------------------------------------------------------------------
// Sheet -> table row mapping
// ---------------------------------------------------------------------------

function mapPurchaseRow(record: SheetRow): TablesInsert<"purchases"> | null {
  const productCode = str(get(record, "Kode Produk"));
  if (!productCode) return null;

  return {
    product_code: productCode,
    product_name: str(get(record, "Nama Produk")),
    category: strOrNull(get(record, "Kategori")),
    color: strOrNull(get(record, "Warna")),
    size: strOrNull(get(record, "Ukuran")),
    unit_cost: num(get(record, "Harga Beli (HPP)")),
    sell_price: num(get(record, "Harga Jual")),
    initial_stock: num(getByPrefix(record, "Stok Awal")),
  };
}

function mapSalesRow(record: SheetRow): TablesInsert<"sales"> | null {
  const productCode = str(get(record, "Kode Produk"));
  const orderNo = str(get(record, "No. Order"));
  if (!productCode || !orderNo) return null;

  return {
    sale_date: dateStr(get(record, "Tanggal")),
    order_no: orderNo,
    sales_channel: str(get(record, "Sales Channel")),
    product_code: productCode,
    product_name: str(get(record, "Nama Produk")),
    color: strOrNull(get(record, "Warna")),
    size: strOrNull(get(record, "Ukuran")),
    quantity: num(get(record, "Qty")),
    unit_price: num(get(record, "Harga Jual/Unit")),
    unit_cost: num(get(record, "HPP/Unit")),
  };
}

function mapStockOpnameRow(
  record: SheetRow,
): TablesInsert<"stock_opname"> | null {
  const productCode = str(get(record, "Kode Produk"));
  if (!productCode) return null;

  return {
    product_code: productCode,
    product_name: str(get(record, "Nama Produk")),
    color: strOrNull(get(record, "Warna")),
    size: strOrNull(get(record, "Ukuran")),
    initial_stock: num(get(record, "Stok Awal")),
    total_sold: num(get(record, "Total Terjual")),
    physical_stock: num(get(record, "Stok Fisik (hitung gudang)")),
    notes: strOrNull(get(record, "Keterangan")),
    // count_date isn't a sheet column — each sync run reflects "as counted
    // today." Re-running sync the same day updates today's row in place.
    count_date: new Date().toISOString().slice(0, 10),
  };
}

/**
 * The sheet's "Total Pengeluaran" trailer row has a blank Tanggal/Kategori
 * cell (its total sits in the Deskripsi/Jumlah columns), so guarding on
 * those two being present naturally excludes it without extra logic.
 */
function mapExpenseRow(record: SheetRow): TablesInsert<"expenses"> | null {
  const expenseDate = str(get(record, "Tanggal"));
  const category = str(get(record, "Kategori"));
  if (!expenseDate || !category) return null;

  return {
    expense_date: dateStr(get(record, "Tanggal")),
    category,
    description: str(get(record, "Deskripsi")),
    amount: num(get(record, "Jumlah")),
  };
}

/**
 * Same trailer-row guard as mapExpenseRow, for the sheet's "Subtotal
 * Lain-lain" row (blank Tanggal/Sumber).
 */
function mapOtherIncomeRow(
  record: SheetRow,
): TablesInsert<"other_income"> | null {
  const incomeDate = str(get(record, "Tanggal"));
  const source = str(get(record, "Sumber"));
  if (!incomeDate || !source) return null;

  return {
    income_date: dateStr(get(record, "Tanggal")),
    source,
    description: str(get(record, "Deskripsi")),
    amount: num(get(record, "Jumlah")),
  };
}
