"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshDataButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const response = await fetch("/api/sync-sheet", { method: "POST" });
      if (!response.ok) throw new Error("Sync failed");
      router.refresh();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Syncing…" : "Refresh data"}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-600">Sync failed. Try again.</span>
      )}
    </div>
  );
}
