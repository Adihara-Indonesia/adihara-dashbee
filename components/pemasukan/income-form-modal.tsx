"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "@/components/crud/modal";
import { FormField } from "@/components/crud/form-field";
import {
  saveIncomeAction,
  type IncomeFormState,
} from "@/app/(dashboard)/pemasukan/actions";
import type { OtherIncome } from "@/types/database";

const initialState: IncomeFormState = {};

export function IncomeFormModal({
  mode,
  defaultValues,
  returnTo,
}: {
  mode: "create" | "edit";
  defaultValues?: OtherIncome;
  returnTo: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveIncomeAction,
    initialState,
  );
  const close = useCloseModal();
  const errors = state.fieldErrors ?? {};

  return (
    <Modal
      title={mode === "edit" ? "Edit Pemasukan Lain-lain" : "Tambah Pemasukan Lain-lain"}
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Tanggal"
            name="income_date"
            type="date"
            required
            defaultValue={defaultValues?.income_date ?? ""}
            error={errors.income_date}
          />
          <FormField
            label="Sumber"
            name="source"
            type="text"
            required
            placeholder="Modal Tambahan Pemilik, Refund Supplier…"
            defaultValue={defaultValues?.source ?? ""}
            error={errors.source}
          />
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
                : "Tambah Pemasukan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
