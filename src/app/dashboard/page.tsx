import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch driver profile
  const { data: profile } = await supabase
    .from("driver_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <DashboardContent user={user} profile={profile} />;
}
