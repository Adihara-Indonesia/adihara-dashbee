"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold text-gray-900">
        Terjadi kesalahan
      </h1>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        Halaman ini mengalami kesalahan tak terduga. Anda bisa mencoba lagi,
        atau kembali ke Dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-honey px-4 py-2 text-sm font-bold text-honey-ink transition-colors hover:bg-[#ffb654]"
        >
          Coba Lagi
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
