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
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 h-16">
        <h1 className="text-lg font-bold tracking-tight text-foreground truncate">
          {getTitle()}
        </h1>
        <div className="flex items-center gap-3">
          {children}
          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-error" />
          </button>
        </div>
      </div>
    </header>
  );
}
