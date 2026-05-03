"use client";

import Link from "next/link";
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
    <header className="sticky top-0 z-30 glass border-b border-surface-border md:bg-background/80">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate mr-4">
          {getTitle()}
        </h1>
        <div className="flex items-center gap-3">
          {children}
          {/* Notification bell (placeholder) */}
          <button className="relative w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-foreground hover:border-primary/20 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
