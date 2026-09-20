"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { Toast, useActionToast } from "@/components/ui/toast";
import {
  updateAvatarAction,
  type ProfileFormState,
} from "@/app/(dashboard)/profile/actions";

const initialState: ProfileFormState = {};

export function AvatarUpload({ currentUrl }: { currentUrl: string | null }) {
  const [state, formAction, pending] = useActionState(
    updateAvatarAction,
    initialState,
  );
  const { message, dismiss } = useActionToast(state);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- preview can be a blob: URL, which next/image can't optimize
          <img
            src={preview}
            alt="Profile photo"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No photo
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload photo"}
        </button>
      </div>

      <Toast message={message} onDismiss={dismiss} />
    </form>
  );
}
