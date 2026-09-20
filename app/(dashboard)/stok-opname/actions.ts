"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { DeleteFormState } from "@/components/crud/confirm-delete-modal";

export type StockOpnameFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function safeReturnTo(formData: FormData): string {
  const value = String(formData.get("returnTo") ?? "");
  return value.startsWith("/stok-opname") ? value : "/stok-opname";
}

function parseStockOpnameForm(formData: FormData) {
  const fieldErrors: Record<string, string> = {};

  const count_date = String(formData.get("count_date") ?? "");
  if (!count_date) fieldErrors.count_date = "Tanggal wajib diisi.";

  const product_code = String(formData.get("product_code") ?? "").trim();
  if (!product_code) fieldErrors.product_code = "Kode produk wajib diisi.";

  const product_name = String(formData.get("product_name") ?? "").trim();
  if (!product_name) fieldErrors.product_name = "Nama produk wajib diisi.";

  const initial_stock = Number(formData.get("initial_stock"));
  if (!Number.isFinite(initial_stock) || initial_stock < 0) {
    fieldErrors.initial_stock = "Stok awal harus 0 atau lebih.";
  }

  const total_sold = Number(formData.get("total_sold"));
  if (!Number.isFinite(total_sold) || total_sold < 0) {
    fieldErrors.total_sold = "Total terjual harus 0 atau lebih.";
  }

  const physical_stock = Number(formData.get("physical_stock"));
  if (!Number.isFinite(physical_stock) || physical_stock < 0) {
    fieldErrors.physical_stock = "Stok fisik harus 0 atau lebih.";
  }

  const color = String(formData.get("color") ?? "").trim() || null;
  const size = String(formData.get("size") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  return {
    fieldErrors,
    values: {
      count_date,
      product_code,
      product_name,
      color,
      size,
      initial_stock,
      total_sold,
      physical_stock,
      notes,
    },
  };
}

export async function saveStockOpnameAction(
  _prevState: StockOpnameFormState,
  formData: FormData,
): Promise<StockOpnameFormState> {
  const { fieldErrors, values } = parseStockOpnameForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const id = String(formData.get("id") ?? "").trim();
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  if (id) {
    const update: TablesUpdate<"stock_opname"> = values;
    const { data, error } = await supabase
      .from("stock_opname")
      .update(update)
      .eq("id", id)
      .select("id");

    if (error) return { error: error.message };
    if (!data || data.length === 0) {
      return { error: "Anda tidak memiliki izin untuk mengubah data ini." };
    }
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Anda belum masuk (sign in)." };

    const insert: TablesInsert<"stock_opname"> = {
      ...values,
      created_by: user.id,
    };
    const { error } = await supabase.from("stock_opname").insert(insert);
    if (error) return { error: error.message };
  }

  revalidatePath("/stok-opname");
  redirect(returnTo);
}

export async function deleteStockOpnameAction(
  _prevState: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stock_opname")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Anda tidak memiliki izin untuk menghapus data ini." };
  }

  revalidatePath("/stok-opname");
  redirect(returnTo);
}
