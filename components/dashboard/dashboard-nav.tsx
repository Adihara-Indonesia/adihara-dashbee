"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/database";

const BASE_NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/sales", label: "Sales" },
  { href: "/purchases", label: "Purchases" },
  { href: "/profile", label: "Profile" },
];

export function DashboardNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const navItems =
    role === "owner" || role === "admin"
      ? [...BASE_NAV_ITEMS, { href: "/admin", label: "Admin" }]
      : BASE_NAV_ITEMS;

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
