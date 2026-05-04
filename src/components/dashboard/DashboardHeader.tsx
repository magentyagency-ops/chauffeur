"use client";

import { usePathname } from "next/navigation";

export default function DashboardHeader({ title, children }: { title?: string, children?: React.ReactNode }) {
  const pathname = usePathname();
  
  const getTitle = () => {
    if (title) return title;
    if (pathname === "/dashboard") return "Accueil";
    if (pathname.includes("availability")) return "Disponibilité";
    if (pathname.includes("bookings")) return "Réservations";
    if (pathname.includes("clients")) return "Clients";
    if (pathname.includes("routes")) return "Trajets fixes";
    if (pathname.includes("profile")) return "Profil public";
    if (pathname.includes("settings")) return "Paramètres";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between px-6 md:px-10 h-20">
        <h1 className="text-xl font-[800] tracking-tight text-black font-display truncate">
          {getTitle()}
        </h1>
        <div className="flex items-center gap-4">
          {children}
          {/* Notification bell */}
          <button className="relative w-11 h-11 rounded-full bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
