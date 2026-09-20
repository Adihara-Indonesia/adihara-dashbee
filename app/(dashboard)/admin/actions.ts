"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export type RoleUpdateState = { error?: string };
export type BusinessInfoFormState = { error?: string; success?: boolean };

const VALID_ROLES: UserRole[] = ["owner", "admin", "staff"];

function isUserRole(value: string): value is UserRole {
  return VALID_ROLES.includes(value as UserRole);
}

/** Confirms the caller is signed in and owner/admin. Every action in this
 * file must call this first — the Admin page itself redirects non-owner/
 * admin users away, but that's a UX nicety, not the enforcement boundary. */
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, authorized: false as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const authorized = profile?.role === "owner" || profile?.role === "admin";
  return { supabase, user, authorized };
}

export async function updateUserRoleAction(
  _prevState: RoleUpdateState,
  formData: FormData,
): Promise<RoleUpdateState> {
  const { supabase, authorized } = await requireAdmin();
  if (!authorized) return { error: "Not authorized." };

  const targetUserId = String(formData.get("userId") ?? "");
  const nextRole = String(formData.get("role") ?? "");
  if (!targetUserId || !isUserRole(nextRole)) {
    return { error: "Invalid role change." };
  }

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", targetUserId)
    .single();

  // Never leave the business with zero owners — covers both a sole owner
  // demoting themselves and anyone else demoting the last remaining owner.
  if (targetProfile?.role === "owner" && nextRole !== "owner") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "owner");

    if ((count ?? 0) <= 1) {
      return { error: "At least one owner must remain." };
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: nextRole })
    .eq("id", targetUserId)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "You don't have permission to change this role." };
  }

  revalidatePath("/admin");
  return {};
}

export async function saveBusinessInfoAction(
  _prevState: BusinessInfoFormState,
  formData: FormData,
): Promise<BusinessInfoFormState> {
  const { supabase, authorized } = await requireAdmin();
  if (!authorized) return { error: "Not authorized." };

  const business_name = String(formData.get("business_name") ?? "").trim();
  if (!business_name) return { error: "Business name is required." };

  const address = String(formData.get("address") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const id = String(formData.get("id") ?? "").trim();

  const { error } = id
    ? await supabase
        .from("business_info")
        .update({ business_name, address, phone, email })
        .eq("id", id)
    : await supabase
        .from("business_info")
        .insert({ business_name, address, phone, email });

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}
