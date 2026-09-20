import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogleAction } from "./actions";
import { LoginForm } from "./login-form";

const ERROR_MESSAGES: Record<string, string> = {
  pending_approval:
    "Akun Anda masih menunggu persetujuan. Kami akan memberi tahu Anda setelah akses diberikan.",
  oauth_failed: "Masuk dengan Google gagal. Silakan coba lagi.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: whitelisted } = await supabase.rpc("is_whitelisted");
    if (whitelisted) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-[10px] border border-gray-200 bg-white p-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Dashbee
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Masuk ke dashboard Anda
          </p>
        </div>

        {error && ERROR_MESSAGES[error] && (
          <div
            className="mb-6 rounded-md bg-danger-soft px-4 py-3 text-sm text-danger"
            role="alert"
          >
            {ERROR_MESSAGES[error]}
          </div>
        )}

        <form action={signInWithGoogleAction}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <GoogleIcon className="h-5 w-5" />
            Lanjutkan dengan Google
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            atau
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
