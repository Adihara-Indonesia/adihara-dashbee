"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "@/components/crud/modal";
import { FormField } from "@/components/crud/form-field";
import {
  saveExpenseAction,
  type ExpenseFormState,
} from "@/app/(dashboard)/pengeluaran/actions";
import { EXPENSE_CATEGORIES } from "@/lib/pengeluaran/categories";
import type { Expense } from "@/types/database";

const initialState: ExpenseFormState = {};

export function ExpenseFormModal({
  mode,
  defaultValues,
  returnTo,
}: {
  mode: "create" | "edit";
  defaultValues?: Expense;
  returnTo: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveExpenseAction,
    initialState,
  );
  const close = useCloseModal();
  const errors = state.fieldErrors ?? {};

  return (
    <Modal title={mode === "edit" ? "Edit Pengeluaran" : "Tambah Pengeluaran"}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Tanggal"
            name="expense_date"
            type="date"
            required
            defaultValue={defaultValues?.expense_date ?? ""}
            error={errors.expense_date}
          />
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium text-gray-900"
            >
              Kategori
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={defaultValues?.category ?? ""}
              className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
                errors.category
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-honey focus:ring-honey"
              }`}
            >
              <option value="" disabled>
                Pilih kategori…
              </option>
              {EXPENSE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-danger">{errors.category}</p>
            )}
          </div>
        </div>

        <FormField
          label="Deskripsi"
          name="description"
          type="text"
          required
          defaultValue={defaultValues?.description ?? ""}
          error={errors.description}
        />

        <FormField
          label="Jumlah"
          name="amount"
          type="number"
          min={0}
          step="0.01"
          required
          defaultValue={defaultValues?.amount ?? ""}
          error={errors.amount}
        />

        {state.error && (
          <p className="text-sm text-danger" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-honey px-4 py-2 text-sm font-bold text-honey-ink transition-colors hover:bg-[#ffb654] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "Menyimpan…"
              : mode === "edit"
                ? "Simpan Perubahan"
                : "Tambah Pengeluaran"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
