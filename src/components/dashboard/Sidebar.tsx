"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { name: "Accueil", href: "/dashboard", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" },
  { name: "Disponibilité", href: "/dashboard/availability", icon: "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2" },
  { name: "Réservations", href: "/dashboard/bookings", icon: "M3 4h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2zM16 2v4M8 2v4M3 10h18" },
  // { name: "Marketing", href: "/dashboard/marketing", icon: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" },
  { name: "Profil public", href: "/dashboard/profile", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z" },
  { name: "Paramètres", href: "/dashboard/settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" },
  // Hidden for now — will re-add later:
  // { name: "Marketing", href: "/dashboard/marketing", icon: "..." },
  // { name: "Clients", href: "/dashboard/clients", icon: "..." },
  // { name: "Trajets fixes", href: "/dashboard/routes", icon: "..." },
];

export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="hidden md:flex h-screen w-[260px] flex-col fixed left-0 top-0 bg-white/80 backdrop-blur-xl border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
      {/* Logo */}
      <div className="h-[80px] flex items-center px-8 border-b border-gray-100/50">
        <Link href="/dashboard" className="text-2xl font-[800] tracking-tight font-display text-black">
          PrivéChauffeur
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navigation.map(item => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive 
                  ? "bg-black text-white shadow-[0_8px_16px_rgba(0,0,0,0.15)]" 
                  : "text-gray-500 hover:text-black hover:bg-gray-100/50"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d={item.icon} />
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl font-bold text-gray-500 transition-all hover:text-red-500 hover:bg-red-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  );
}
