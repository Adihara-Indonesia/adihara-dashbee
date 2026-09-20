"use client";

import Link from "next/link";
import { useState } from "react";
import { signOutAction } from "@/app/(dashboard)/actions";
import type { UserRole } from "@/types/database";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Topbar({
  onToggleSidebar,
  fullName,
  email,
  role,
}: {
  onToggleSidebar: () => void;
  fullName: string | null;
  email: string;
  role: UserRole;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = fullName ?? email;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
      >
        <svg {...iconProps}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <label className="relative hidden flex-1 max-w-sm items-center sm:flex">
        <svg
          {...iconProps}
          width={16}
          height={16}
          className="pointer-events-none absolute left-3 text-gray-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          placeholder="Cari…"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-honey focus:outline-none"
        />
      </label>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label="Notifikasi"
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            <svg {...iconProps}>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </button>
          {notifOpen && (
            <>
              <button
                type="button"
                aria-label="Tutup"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <p className="text-sm font-semibold text-gray-900">
                  Notifikasi
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Tidak ada notifikasi baru.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-honey-ink font-mono text-sm font-semibold text-white">
              {initial}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-gray-900">
                {displayName}
              </span>
              <span className="inline-flex rounded-full bg-good-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-good">
                {role}
              </span>
            </span>
          </button>
          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Tutup"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profil
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
