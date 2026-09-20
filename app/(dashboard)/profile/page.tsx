import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { ProfileForm } from "@/components/profile/profile-form";
import { PasswordForm } from "@/components/profile/password-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Scoped to the caller's own row only — never fetches or exposes any
  // other user's profile data.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>

      <Card title="Profile photo">
        <AvatarUpload currentUrl={profile?.avatar_url ?? null} />
      </Card>

      <Card title="Personal information">
        <ProfileForm
          email={user.email ?? ""}
          defaultFullName={profile?.full_name ?? ""}
          defaultPhone={profile?.phone ?? ""}
        />
      </Card>

      <Card title="Update password">
        <PasswordForm />
      </Card>
    </div>
  );
}
