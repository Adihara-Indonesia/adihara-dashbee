"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "@/components/crud/modal";
import { FormField } from "@/components/crud/form-field";
import {
  saveStockOpnameAction,
  type StockOpnameFormState,
} from "@/app/(dashboard)/stok-opname/actions";
import type { StockOpname } from "@/types/database";

const initialState: StockOpnameFormState = {};

export function StockOpnameFormModal({
  mode,
  defaultValues,
  returnTo,
}: {
  mode: "create" | "edit";
  defaultValues?: StockOpname;
  returnTo: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveStockOpnameAction,
    initialState,
  );
  const close = useCloseModal();
  const errors = state.fieldErrors ?? {};

  return (
    <Modal title={mode === "edit" ? "Edit Stok Opname" : "Tambah Stok Opname"}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <FormField
          label="Tanggal"
          name="count_date"
          type="date"
          required
          defaultValue={defaultValues?.count_date ?? ""}
          error={errors.count_date}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Kode Produk"
            name="product_code"
            type="text"
            required
            defaultValue={defaultValues?.product_code ?? ""}
            error={errors.product_code}
          />
          <FormField
            label="Nama Produk"
            name="product_name"
            type="text"
            required
            defaultValue={defaultValues?.product_name ?? ""}
            error={errors.product_name}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Warna"
            name="color"
            type="text"
            defaultValue={defaultValues?.color ?? ""}
          />
          <FormField
            label="Ukuran"
            name="size"
            type="text"
            defaultValue={defaultValues?.size ?? ""}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Stok Awal"
            name="initial_stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={defaultValues?.initial_stock ?? ""}
            error={errors.initial_stock}
          />
          <FormField
            label="Total Terjual"
            name="total_sold"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={defaultValues?.total_sold ?? 0}
            error={errors.total_sold}
          />
          <FormField
            label="Stok Fisik (hitung gudang)"
            name="physical_stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={defaultValues?.physical_stock ?? ""}
            error={errors.physical_stock}
          />
        </div>

        <FormField
          label="Keterangan"
          name="notes"
          type="text"
          placeholder="Sesuai stok sistem, retur belum diinput…"
          defaultValue={defaultValues?.notes ?? ""}
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
                : "Tambah Data"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
