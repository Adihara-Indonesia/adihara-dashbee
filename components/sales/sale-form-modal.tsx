"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "@/components/crud/modal";
import { FormField } from "@/components/crud/form-field";
import { saveSaleAction, type SaleFormState } from "@/app/(dashboard)/sales/actions";
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
    <Modal title={mode === "edit" ? "Edit sale" : "Add sale"}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Date"
            name="sale_date"
            type="date"
            required
            defaultValue={defaultValues?.sale_date ?? ""}
            error={errors.sale_date}
          />
          <FormField
            label="Order no."
            name="order_no"
            type="text"
            required
            defaultValue={defaultValues?.order_no ?? ""}
            error={errors.order_no}
          />
        </div>

        <FormField
          label="Sales channel"
          name="sales_channel"
          type="text"
          required
          placeholder="Shopee, Tokopedia, TikTok Shop…"
          defaultValue={defaultValues?.sales_channel ?? ""}
          error={errors.sales_channel}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Product code"
            name="product_code"
            type="text"
            required
            defaultValue={defaultValues?.product_code ?? ""}
            error={errors.product_code}
          />
          <FormField
            label="Product name"
            name="product_name"
            type="text"
            required
            defaultValue={defaultValues?.product_name ?? ""}
            error={errors.product_name}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Color"
            name="color"
            type="text"
            defaultValue={defaultValues?.color ?? ""}
          />
          <FormField
            label="Size"
            name="size"
            type="text"
            defaultValue={defaultValues?.size ?? ""}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            label="Quantity"
            name="quantity"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={defaultValues?.quantity ?? ""}
            error={errors.quantity}
          />
          <FormField
            label="Unit price"
            name="unit_price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaultValues?.unit_price ?? ""}
            error={errors.unit_price}
          />
          <FormField
            label="Unit cost"
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
          <p className="text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : mode === "edit" ? "Save changes" : "Add sale"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
