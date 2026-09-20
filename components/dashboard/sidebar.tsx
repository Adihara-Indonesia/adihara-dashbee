"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { UserRole } from "@/types/database";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/produk",
    label: "Produk",
    icon: (
      <svg {...iconProps}>
        <path d="M20 7 12 3 4 7v10l8 4 8-4V7Z" />
        <path d="M4 7l8 4 8-4M12 11v10" />
      </svg>
    ),
  },
  {
    href: "/penjualan",
    label: "Penjualan",
    icon: (
      <svg {...iconProps}>
        <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="9" cy="21" r="1.2" />
        <circle cx="18" cy="21" r="1.2" />
      </svg>
    ),
  },
  {
    href: "/stok-opname",
    label: "Stok Opname",
    icon: (
      <svg {...iconProps}>
        <path d="M9 11l2 2 4-4" />
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    href: "/pengeluaran",
    label: "Pengeluaran",
    icon: (
      <svg {...iconProps}>
        <path d="M12 19V5M6 9l6-6 6 6" />
        <path d="M4 21h16" />
      </svg>
    ),
  },
  {
    href: "/pemasukan",
    label: "Pemasukan",
    icon: (
      <svg {...iconProps}>
        <path d="M12 5v14M6 15l6 6 6-6" />
        <path d="M4 3h16" />
      </svg>
    ),
  },
  {
    href: "/laba-rugi",
    label: "Laba Rugi",
    icon: (
      <svg {...iconProps}>
        <path d="M3 17l5-5 4 4 8-9" />
        <path d="M15 7h5v5" />
      </svg>
    ),
  },
];

const ADMIN_ITEM: NavItem = {
  href: "/admin",
  label: "Admin",
  icon: (
    <svg {...iconProps}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
    </svg>
  ),
};

export function Sidebar({
  role,
  open,
  onNavigate,
}: {
  role: UserRole;
  open: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const items =
    role === "owner" || role === "admin" ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-line bg-ink text-ink-text transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-ink-line px-5">
        <span className="font-serif text-lg font-semibold text-ink-text">
          Dashbee
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-honey bg-white/5 text-white"
                  : "border-transparent text-ink-muted hover:bg-white/5 hover:text-ink-text"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
