"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyWhitelistedUser } from "@/lib/auth/verify-whitelist";

export type LoginFormState = {
  error?: string;
  info?: string;
};

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_failed");
  }

  redirect(data.url);
}

export async function signInAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau kata sandi salah." };
  }

  const { whitelisted } = await verifyWhitelistedUser(
    supabase,
    "email_password",
  );

  if (!whitelisted) {
    return { error: "Akun Anda masih menunggu persetujuan." };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      info: "Cek email Anda untuk konfirmasi akun, lalu masuk.",
    };
  }

  const { whitelisted } = await verifyWhitelistedUser(
    supabase,
    "email_password",
  );

  if (!whitelisted) {
    return { error: "Akun Anda masih menunggu persetujuan." };
  }

  redirect("/dashboard");
}
