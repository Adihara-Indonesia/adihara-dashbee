"use client";

import { useActionState } from "react";
import { FormField } from "@/components/crud/form-field";
import { Toast, useActionToast } from "@/components/ui/toast";
import {
  updateProfileAction,
  type ProfileFormState,
} from "@/app/(dashboard)/profile/actions";

const initialState: ProfileFormState = {};

export function ProfileForm({
  email,
  defaultFullName,
  defaultPhone,
}: {
  email: string;
  defaultFullName: string;
  defaultPhone: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const { message, dismiss } = useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Full name"
        name="full_name"
        type="text"
        required
        defaultValue={defaultFullName}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-900">
          Email
        </label>
        <input
          type="email"
          value={email}
          readOnly
          disabled
          className="block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
        />
        <p className="mt-1 text-xs text-gray-400">
          To change your email, use the email-change flow from your account
          settings — not this form.
        </p>
      </div>

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        defaultValue={defaultPhone}
      />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>

      <Toast message={message} onDismiss={dismiss} />
    </form>
  );
}
