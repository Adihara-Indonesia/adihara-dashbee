"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { DeleteFormState } from "@/components/crud/confirm-delete-modal";

export type ExpenseFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function safeReturnTo(formData: FormData): string {
  const value = String(formData.get("returnTo") ?? "");
  return value.startsWith("/pengeluaran") ? value : "/pengeluaran";
}

function parseExpenseForm(formData: FormData) {
  const fieldErrors: Record<string, string> = {};

  const expense_date = String(formData.get("expense_date") ?? "");
  if (!expense_date) fieldErrors.expense_date = "Tanggal wajib diisi.";

  const category = String(formData.get("category") ?? "").trim();
  if (!category) fieldErrors.category = "Kategori wajib diisi.";

  const description = String(formData.get("description") ?? "").trim();
  if (!description) fieldErrors.description = "Deskripsi wajib diisi.";

  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount < 0) {
    fieldErrors.amount = "Jumlah harus 0 atau lebih.";
  }

  return {
    fieldErrors,
    values: { expense_date, category, description, amount },
  };
}

export async function saveExpenseAction(
  _prevState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const { fieldErrors, values } = parseExpenseForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const id = String(formData.get("id") ?? "").trim();
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  if (id) {
    const update: TablesUpdate<"expenses"> = values;
    const { data, error } = await supabase
      .from("expenses")
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

    const insert: TablesInsert<"expenses"> = { ...values, created_by: user.id };
    const { error } = await supabase.from("expenses").insert(insert);
    if (error) return { error: error.message };
  }

  revalidatePath("/pengeluaran");
  redirect(returnTo);
}

export async function deleteExpenseAction(
  _prevState: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Anda tidak memiliki izin untuk menghapus data ini." };
  }

  revalidatePath("/pengeluaran");
  redirect(returnTo);
}
