import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * profiles has no email column (that lives on auth.users), so listing users
 * for the Admin page needs the service-role client. Safe here because every
 * caller of this function has already been verified as owner/admin.
 */
export async function listAllUserEmails(): Promise<Map<string, string>> {
  const admin = createAdminClient();
  const emailById = new Map<string, string>();
  const perPage = 200;

  // Safety cap rather than an unbounded loop — an SME dashboard won't have
  // more than a handful of accounts, let alone tens of thousands.
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message);

    for (const user of data.users) {
      if (user.email) emailById.set(user.id, user.email);
    }

    if (data.users.length < perPage) break;
  }

  return emailById;
}
