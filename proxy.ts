import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

// Guards every route except the public ones listed in `config.matcher`
// below (login, the OAuth callback, and static assets) — in practice this
// covers the whole app/(dashboard) tree, present and future, without
// needing to keep this list of protected paths in sync by hand.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() (not getSession()) re-validates the token against Supabase
  // Auth on every request rather than trusting the cookie's decoded claims.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request);
  }

  // Never trust that a session implies whitelist approval — re-check the
  // whitelist table (via the security-definer RPC) on every single request.
  const { data: whitelisted } = await supabase.rpc("is_whitelisted");

  if (!whitelisted) {
    await supabase.auth.signOut();
    return redirectToLogin(request, "pending_approval");
  }

  return response;
}

function redirectToLogin(request: NextRequest, error?: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = error ? `?error=${error}` : "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!login|auth/callback|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
