"use client";

import { useActionState, useEffect, useRef } from "react";
import { FormField } from "@/components/crud/form-field";
import { Toast, useActionToast } from "@/components/ui/toast";
import {
  updatePasswordAction,
  type ProfileFormState,
} from "@/app/(dashboard)/profile/actions";

const initialState: ProfileFormState = {};

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );
  const { message, dismiss } = useActionToast(state);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  // Native HTML5 validation blocks submit until this custom validity is
  // cleared — no JS-driven submit-time check needed on top of it.
  function checkMatch() {
    if (!passwordRef.current || !confirmRef.current) return;
    if (
      confirmRef.current.value &&
      confirmRef.current.value !== passwordRef.current.value
    ) {
      confirmRef.current.setCustomValidity("Passwords do not match.");
    } else {
      confirmRef.current.setCustomValidity("");
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormField
        ref={passwordRef}
        label="New password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        onChange={checkMatch}
      />
      <FormField
        ref={confirmRef}
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        onChange={checkMatch}
      />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Updating…" : "Update password"}
      </button>

      <Toast message={message} onDismiss={dismiss} />
    </form>
  );
}
