"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "@/components/crud/modal";
import { FormField } from "@/components/crud/form-field";
import {
  savePurchaseAction,
  type PurchaseFormState,
} from "@/app/(dashboard)/purchases/actions";
import type { Purchase } from "@/types/database";

const initialState: PurchaseFormState = {};

export function PurchaseFormModal({
  mode,
  defaultValues,
  returnTo,
}: {
  mode: "create" | "edit";
  defaultValues?: Purchase;
  returnTo: string;
}) {
  const [state, formAction, pending] = useActionState(
    savePurchaseAction,
    initialState,
  );
  const close = useCloseModal();
  const errors = state.fieldErrors ?? {};

  return (
    <Modal title={mode === "edit" ? "Edit purchase" : "Add purchase"}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={defaultValues?.id ?? ""} />
        <input type="hidden" name="returnTo" value={returnTo} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Date"
            name="purchase_date"
            type="date"
            required
            defaultValue={defaultValues?.purchase_date ?? ""}
            error={errors.purchase_date}
          />
          <FormField
            label="Category"
            name="category"
            type="text"
            defaultValue={defaultValues?.category ?? ""}
          />
        </div>

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
            label="Stock qty"
            name="initial_stock"
            type="number"
            min={0}
            step={1}
            required
            defaultValue={defaultValues?.initial_stock ?? ""}
            error={errors.initial_stock}
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
          <FormField
            label="Sell price"
            name="sell_price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={defaultValues?.sell_price ?? ""}
            error={errors.sell_price}
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
            {pending
              ? "Saving…"
              : mode === "edit"
                ? "Save changes"
                : "Add purchase"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
