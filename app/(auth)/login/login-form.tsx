"use client";

import { useActionState, useState } from "react";
import { signInAction, signUpAction, type LoginFormState } from "./actions";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [state, formAction, pending] = useActionState(
    mode === "sign-in" ? signInAction : signUpAction,
    initialState,
  );

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="anda@perusahaan.com"
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-honey focus:outline-none focus:ring-1 focus:ring-honey"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-gray-900"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-honey focus:outline-none focus:ring-1 focus:ring-honey"
          />
        </div>

        {state.error && (
          <p className="text-sm text-danger" role="alert">
            {state.error}
          </p>
        )}
        {state.info && (
          <p className="text-sm text-good" role="status">
            {state.info}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-honey px-4 py-2.5 text-sm font-bold text-honey-ink transition-colors hover:bg-[#ffb654] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Mohon tunggu…"
            : mode === "sign-in"
              ? "Masuk"
              : "Buat Akun"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        {mode === "sign-in" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <button
          type="button"
          onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="font-medium text-honey-deep hover:underline"
        >
          {mode === "sign-in" ? "Daftar" : "Masuk"}
        </button>
      </p>
    </div>
  );
}
