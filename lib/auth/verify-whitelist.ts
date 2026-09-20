import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LeadSource } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * The single source of truth for "is this authenticated user allowed in."
 * Never trust a session on its own — this always re-checks the whitelist
 * table (via the `is_whitelisted` RPC, which runs as a security-definer
 * function so a plain staff session can call it without whitelist SELECT
 * rights). Call this right after any sign-in/sign-up/OAuth exchange.
 *
 * When the email isn't whitelisted, this records the attempt in `leads`
 * and signs the session out before returning — the caller must not grant
 * access based on a session that reaches this point.
 */
export async function verifyWhitelistedUser(
  supabase: SupabaseClient<Database>,
  source: LeadSource,
): Promise<{ whitelisted: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { whitelisted: false };
  }

  const { data: whitelisted, error } = await supabase.rpc("is_whitelisted");
  if (error) throw error;

  if (whitelisted) {
    return { whitelisted: true };
  }

  const admin = createAdminClient();
  await admin
    .from("leads")
    .upsert({ email: user.email, source }, { onConflict: "email" });

  await supabase.auth.signOut();

  return { whitelisted: false };
}
