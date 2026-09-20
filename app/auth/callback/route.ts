import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyWhitelistedUser } from "@/lib/auth/verify-whitelist";

// Google redirects here (via Supabase's own /auth/v1/callback) with a
// one-time `code` to exchange for a session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { whitelisted } = await verifyWhitelistedUser(
        supabase,
        "google_sso",
      );

      return NextResponse.redirect(
        whitelisted
          ? `${origin}/`
          : `${origin}/login?error=pending_approval`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
