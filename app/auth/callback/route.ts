import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyWhitelistedUser } from "@/lib/auth/verify-whitelist";

// Google redirects here (via Supabase's own /auth/v1/callback) with a
// one-time `code` to exchange for a session.
export async function GET(request: Request) {
  const { searchParams, origin: requestOrigin } = new URL(request.url);
  const code = searchParams.get("code");
  // Prefer the trusted SITE_URL over the request's own origin — behind a
  // reverse proxy (Coolify/Traefik) request.url can resolve to the
  // container's internal address (e.g. http://0.0.0.0:3000) instead of the
  // public domain, sending the browser to an unreachable URL.
  const origin = process.env.SITE_URL ?? requestOrigin;

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
          ? `${origin}/dashboard`
          : `${origin}/login?error=pending_approval`,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
