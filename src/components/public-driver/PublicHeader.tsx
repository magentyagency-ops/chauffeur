"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PublicHeader({ driver }: { driver: any }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const form = document.getElementById("booking-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-surface-border shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Logo / Name */}
        <Link href={`/chauffeur/${driver.slug}`} className="flex items-center gap-3 group">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-surface-border to-surface flex items-center justify-center font-black text-foreground shadow-inner group-hover:shadow-primary/20 transition-all">
            {driver.firstName.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
              {driver.publicName}
            </div>
            <div className="text-[10px] md:text-xs font-medium text-text-muted">
              Chauffeur privé • {driver.city}
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-semibold text-text-muted hover:text-foreground transition-colors">Prestations</a>
          <a href="#véhicule" className="text-sm font-semibold text-text-muted hover:text-foreground transition-colors">Véhicule</a>
          <a href="#avis" className="text-sm font-semibold text-text-muted hover:text-foreground transition-colors">Avis</a>
          <a href="#faq" className="text-sm font-semibold text-text-muted hover:text-foreground transition-colors">FAQ</a>
          <button 
            onClick={handleBookClick}
            className="px-6 py-2.5 bg-white text-background rounded-xl text-sm font-bold hover:bg-gray-100 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Réserver
          </button>
        </nav>

        {/* Mobile Menu Button (Optional visually, since Sticky CTA exists) */}
        <button className="md:hidden w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-foreground active:scale-95 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </button>

      </div>
    </header>
  );
}
