"use client";

import { useActionState } from "react";
import { Modal, useCloseModal } from "./modal";

export type DeleteFormState = { error?: string };

export function ConfirmDeleteModal({
  id,
  itemLabel,
  returnTo,
  action,
}: {
  id: string;
  itemLabel: string;
  returnTo: string;
  action: (
    state: DeleteFormState,
    formData: FormData,
  ) => Promise<DeleteFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const close = useCloseModal();

  return (
    <Modal title="Delete row">
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">{itemLabel}</span>?
          This cannot be undone.
        </p>

        {state.error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
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
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
