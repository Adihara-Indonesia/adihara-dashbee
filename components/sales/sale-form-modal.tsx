"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "@/components/crud/modal";
import { FormField } from "@/components/crud/form-field";
import { saveSaleAction, type SaleFormState } from "@/app/(dashboard)/penjualan/actions";
import type { Sale } from "@/types/database";

const initialState: SaleFormState = {};

export function SaleFormModal({
  mode,
  defaultValues,
  returnTo,
}: {
  mode: "create" | "edit";
  defaultValues?: Sale;
  returnTo: string;
}) {
  const [state, formAction, pending] = useActionState(
    saveSaleAction,
    initialState,
  );
  const close = useCloseModal();
  const errors = state.fieldErrors ?? {};

  return (
    <Modal title={mode === "edit" ? "Edit Penjualan" : "Tambah Penjualan"}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Tanggal"
            name="sale_date"
            type="date"
            required
            defaultValue={defaultValues?.sale_date ?? ""}
            error={errors.sale_date}
          />
          <FormField
            label="No. Order"
            name="order_no"
            type="text"
            required
            defaultValue={defaultValues?.order_no ?? ""}
            error={errors.order_no}
          />
        </div>

        <FormField
          label="Sales Channel"
          name="sales_channel"
          type="text"
          required
          placeholder="Shopee, Tokopedia, TikTok Shop…"
          defaultValue={defaultValues?.sales_channel ?? ""}
          error={errors.sales_channel}
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
            label="Qty"
            name="quantity"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={defaultValues?.quantity ?? ""}
            error={errors.quantity}
          />
          <FormField
            label="Harga Jual/Unit"
            name="unit_price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaultValues?.unit_price ?? ""}
            error={errors.unit_price}
          />
          <FormField
            label="HPP/Unit"
            name="unit_cost"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaultValues?.unit_cost ?? ""}
            error={errors.unit_cost}
          />
        </div>

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
                : "Tambah Penjualan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
