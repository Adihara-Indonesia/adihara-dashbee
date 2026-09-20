"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { UserRole } from "@/types/database";

export function DashboardShell({
  role,
  fullName,
  email,
  children,
}: {
  role: UserRole;
  fullName: string | null;
  email: string;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background md:flex">
      <Sidebar
        role={role}
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          fullName={fullName}
          email={email}
          role={role}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
