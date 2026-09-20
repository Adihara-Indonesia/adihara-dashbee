"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserRoleAction, type RoleUpdateState } from "@/app/(dashboard)/admin/actions";
import type { UserRole } from "@/types/database";

const ROLES: UserRole[] = ["owner", "admin", "staff"];
const initialState: RoleUpdateState = {};

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: UserRole;
}) {
  const [value, setValue] = useState<UserRole>(currentRole);
  const [state, formAction, pending] = useActionState(
    updateUserRoleAction,
    initialState,
  );
  const router = useRouter();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // On success, pull fresh data (e.g. so the owner-count check other rows
    // rely on reflects this change). On failure, leave the select showing
    // what was picked — the error message below explains why it didn't
    // save, rather than silently snapping the control back.
    if (!state.error) {
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        value={value}
        disabled={pending}
        onChange={(event) => {
          setValue(event.target.value as UserRole);
          event.currentTarget.form?.requestSubmit();
        }}
        className="rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      >
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {state.error && <p className="mt-1 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
