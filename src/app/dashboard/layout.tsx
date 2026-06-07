import Sidebar from "@/components/dashboard/Sidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import { createClient } from "@/lib/supabase/server";
import GlobalBookingListener from "@/components/dashboard/GlobalBookingListener";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let driverId = null;
  if (user) {
    const { data: profile } = await supabase
      .from("driver_profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (profile) driverId = profile.id;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-black font-sans selection:bg-black selection:text-white relative">
      <Sidebar />
      <div className="md:ml-[260px] flex flex-col min-h-screen pb-16 md:pb-0">
        {children}
      </div>
      <MobileBottomNav />
      {driverId && <GlobalBookingListener driverId={driverId} />}
    </div>
  );
}
