"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { DeleteFormState } from "@/components/crud/confirm-delete-modal";

export type PurchaseFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function safeReturnTo(formData: FormData): string {
  const value = String(formData.get("returnTo") ?? "");
  return value.startsWith("/produk") ? value : "/produk";
}

function parsePurchaseForm(formData: FormData) {
  const fieldErrors: Record<string, string> = {};

  const purchase_date = String(formData.get("purchase_date") ?? "");
  if (!purchase_date) fieldErrors.purchase_date = "Tanggal wajib diisi.";

  const product_code = String(formData.get("product_code") ?? "").trim();
  if (!product_code) fieldErrors.product_code = "Kode produk wajib diisi.";

  const product_name = String(formData.get("product_name") ?? "").trim();
  if (!product_name) fieldErrors.product_name = "Nama produk wajib diisi.";

  const initial_stock = Number(formData.get("initial_stock"));
  if (!Number.isFinite(initial_stock) || initial_stock < 0) {
    fieldErrors.initial_stock = "Stok awal harus 0 atau lebih.";
  }

  const unit_cost = Number(formData.get("unit_cost"));
  if (!Number.isFinite(unit_cost) || unit_cost < 0) {
    fieldErrors.unit_cost = "Harga beli (HPP) harus 0 atau lebih.";
  }

  const sell_price = Number(formData.get("sell_price"));
  if (!Number.isFinite(sell_price) || sell_price < 0) {
    fieldErrors.sell_price = "Harga jual harus 0 atau lebih.";
  }

  const category = String(formData.get("category") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const size = String(formData.get("size") ?? "").trim() || null;

  return {
    fieldErrors,
    values: {
      purchase_date,
      product_code,
      product_name,
      category,
      color,
      size,
      initial_stock,
      unit_cost,
      sell_price,
    },
  };
}

export async function savePurchaseAction(
  _prevState: PurchaseFormState,
  formData: FormData,
): Promise<PurchaseFormState> {
  const { fieldErrors, values } = parsePurchaseForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const id = String(formData.get("id") ?? "").trim();
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  if (id) {
    const update: TablesUpdate<"purchases"> = values;
    const { data, error } = await supabase
      .from("purchases")
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

    const insert: TablesInsert<"purchases"> = {
      ...values,
      created_by: user.id,
    };
    const { error } = await supabase.from("purchases").insert(insert);
    if (error) return { error: error.message };
  }

  revalidatePath("/produk");
  redirect(returnTo);
}

export async function deletePurchaseAction(
  _prevState: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchases")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Anda tidak memiliki izin untuk menghapus data ini." };
  }

  revalidatePath("/produk");
  redirect(returnTo);
}
