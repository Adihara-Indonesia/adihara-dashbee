import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { signOutAction } from "./actions";
import type { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-semibold text-gray-900">Dashbee</span>
            <DashboardNav role={profile?.role ?? "staff"} />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              {profile?.full_name ?? user.email}{" "}
              <span className="ml-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                {profile?.role ?? "staff"}
              </span>
            </p>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
