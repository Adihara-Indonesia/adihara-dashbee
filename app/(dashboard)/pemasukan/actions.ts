"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { DeleteFormState } from "@/components/crud/confirm-delete-modal";

export type IncomeFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function safeReturnTo(formData: FormData): string {
  const value = String(formData.get("returnTo") ?? "");
  return value.startsWith("/pemasukan") ? value : "/pemasukan";
}

function parseIncomeForm(formData: FormData) {
  const fieldErrors: Record<string, string> = {};

  const income_date = String(formData.get("income_date") ?? "");
  if (!income_date) fieldErrors.income_date = "Tanggal wajib diisi.";

  const source = String(formData.get("source") ?? "").trim();
  if (!source) fieldErrors.source = "Sumber wajib diisi.";

  const description = String(formData.get("description") ?? "").trim();
  if (!description) fieldErrors.description = "Deskripsi wajib diisi.";

  const amount = Number(formData.get("amount"));
  if (!Number.isFinite(amount) || amount < 0) {
    fieldErrors.amount = "Jumlah harus 0 atau lebih.";
  }

  return {
    fieldErrors,
    values: { income_date, source, description, amount },
  };
}

export async function saveIncomeAction(
  _prevState: IncomeFormState,
  formData: FormData,
): Promise<IncomeFormState> {
  const { fieldErrors, values } = parseIncomeForm(formData);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const id = String(formData.get("id") ?? "").trim();
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  if (id) {
    const update: TablesUpdate<"other_income"> = values;
    const { data, error } = await supabase
      .from("other_income")
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

    const insert: TablesInsert<"other_income"> = {
      ...values,
      created_by: user.id,
    };
    const { error } = await supabase.from("other_income").insert(insert);
    if (error) return { error: error.message };
  }

  revalidatePath("/pemasukan");
  redirect(returnTo);
}

export async function deleteIncomeAction(
  _prevState: DeleteFormState,
  formData: FormData,
): Promise<DeleteFormState> {
  const id = String(formData.get("id") ?? "");
  const returnTo = safeReturnTo(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("other_income")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Anda tidak memiliki izin untuk menghapus data ini." };
  }

  revalidatePath("/pemasukan");
  redirect(returnTo);
}
