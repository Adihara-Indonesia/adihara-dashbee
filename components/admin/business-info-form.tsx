"use client";

import { useActionState } from "react";
import { FormField } from "@/components/crud/form-field";
import {
  saveBusinessInfoAction,
  type BusinessInfoFormState,
} from "@/app/(dashboard)/admin/actions";
import type { BusinessInfo } from "@/types/database";

const initialState: BusinessInfoFormState = {};

export function BusinessInfoForm({
  defaultValues,
}: {
  defaultValues?: BusinessInfo;
}) {
  const [state, formAction, pending] = useActionState(
    saveBusinessInfoAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={defaultValues?.id ?? ""} />

      <FormField
        label="Business name"
        name="business_name"
        type="text"
        required
        defaultValue={defaultValues?.business_name ?? ""}
      />
      <FormField
        label="Address"
        name="address"
        type="text"
        defaultValue={defaultValues?.address ?? ""}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={defaultValues?.phone ?? ""}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          defaultValue={defaultValues?.email ?? ""}
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-green-700" role="status">
          Saved.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
