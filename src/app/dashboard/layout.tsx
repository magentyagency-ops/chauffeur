import Sidebar from "@/components/dashboard/Sidebar";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-60 flex flex-col min-h-screen pb-16 md:pb-0">
        {children}
      </div>
      <MobileBottomNav />
    </div>
  );
}
