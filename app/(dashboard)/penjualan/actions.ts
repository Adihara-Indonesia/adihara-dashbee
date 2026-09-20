"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { DeleteFormState } from "@/components/crud/confirm-delete-modal";

export type SaleFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function safeReturnTo(formData: FormData): string {
  const value = String(formData.get("returnTo") ?? "");
  return value.startsWith("/penjualan") ? value : "/penjualan";
}

function parseSaleForm(formData: FormData) {
  const fieldErrors: Record<string, string> = {};

  const sale_date = String(formData.get("sale_date") ?? "");
  if (!sale_date) fieldErrors.sale_date = "Tanggal wajib diisi.";

  const order_no = String(formData.get("order_no") ?? "").trim();
  if (!order_no) fieldErrors.order_no = "No. Order wajib diisi.";

  const sales_channel = String(formData.get("sales_channel") ?? "").trim();
  if (!sales_channel) fieldErrors.sales_channel = "Sales Channel wajib diisi.";

  const product_code = String(formData.get("product_code") ?? "").trim();
  if (!product_code) fieldErrors.product_code = "Kode produk wajib diisi.";

  const product_name = String(formData.get("product_name") ?? "").trim();
  if (!product_name) fieldErrors.product_name = "Nama produk wajib diisi.";

  const quantity = Number(formData.get("quantity"));
  if (!Number.isFinite(quantity) || quantity <= 0) {
    fieldErrors.quantity = "Qty harus lebih dari 0.";
  }

  const unit_price = Number(formData.get("unit_price"));
  if (!Number.isFinite(unit_price) || unit_price < 0) {
    fieldErrors.unit_price = "Harga jual/unit harus 0 atau lebih.";
  }

  const unit_cost = Number(formData.get("unit_cost"));
  if (!Number.isFinite(unit_cost) || unit_cost < 0) {
    fieldErrors.unit_cost = "HPP/unit harus 0 atau lebih.";
  }

  const color = String(formData.get("color") ?? "").trim() || null;
  const size = String(formData.get("size") ?? "").trim() || null;

  return {
    fieldErrors,
    values: {
      sale_date,
      order_no,
      sales_channel,
      product_code,
      product_name,
      color,
      size,
      quantity,
      unit_price,
      unit_cost,
    },
  };
}

export async function saveSaleAction(
  _prevState: SaleFormState,
  formData: FormData,
): Promise<SaleFormState> {
  const { fieldErrors, values } = parseSaleForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const id = String(formData.get("id") ?? "").trim();
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  if (id) {
    const update: TablesUpdate<"sales"> = values;
    const { data, error } = await supabase
      .from("sales")
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

    const insert: TablesInsert<"sales"> = { ...values, created_by: user.id };
    const { error } = await supabase.from("sales").insert(insert);
    if (error) return { error: error.message };
  }

  revalidatePath("/penjualan");
  redirect(returnTo);
}

export async function deleteSaleAction(
  _prevState: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sales")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Anda tidak memiliki izin untuk menghapus data ini." };
  }

  revalidatePath("/penjualan");
  redirect(returnTo);
}
