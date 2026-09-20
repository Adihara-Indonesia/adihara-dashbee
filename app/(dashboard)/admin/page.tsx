import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listAllUserEmails } from "@/lib/auth/admin-users";
import { Card } from "@/components/ui/card";
import { RoleSelect } from "@/components/admin/role-select";
import { BusinessInfoForm } from "@/components/admin/business-info-form";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Enforced here, server-side — not just by hiding the nav link.
  if (myProfile?.role !== "owner" && myProfile?.role !== "admin") {
    redirect("/?error=not_authorized");
  }

  const [{ data: profiles }, emailById, { data: businessInfo }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, role, created_at")
        .order("created_at", { ascending: true }),
      listAllUserEmails(),
      supabase.from("business_info").select("*").limit(1).maybeSingle(),
    ]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900">Admin</h1>

      <Card title="User roles">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="text-xs uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(profiles ?? []).map((profile) => (
                <tr key={profile.id}>
                  <td className="px-4 py-3 text-gray-900">
                    {profile.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {emailById.get(profile.id) ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelect userId={profile.id} currentRole={profile.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Informasi Bisnis">
        <BusinessInfoForm defaultValues={businessInfo ?? undefined} />
      </Card>
    </div>
  );
}
