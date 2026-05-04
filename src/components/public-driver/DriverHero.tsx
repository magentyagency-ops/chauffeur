"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive, getPersistedAvailability } from "@/lib/mockAvailability";

export default function DriverHero({ driver }: { driver: any }) {
  const [availability, setAvailability] = useState(driver.availability);

  useEffect(() => {
    setAvailability(getPersistedAvailability());
  }, []);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${driver.whatsapp}?text=Bonjour ${driver.firstName}, je souhaite réserver une course.`, '_blank');
  };

  const handleBook = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row gap-8 sm:items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-surface border border-surface-border flex items-center justify-center font-bold text-foreground text-4xl shadow-sm shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-surface-light group-hover:opacity-0 transition-opacity" />
          <span className="relative z-10 display italic font-normal">{driver.firstName.charAt(0)}</span>
          {isAvailabilityActive(availability) && (
            <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green border-2 border-surface shadow-[0_0_8px_rgba(6,193,103,0.4)] animate-pulse" />
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="display text-4xl md:text-6xl font-medium text-foreground tracking-tight leading-none">
              {driver.publicName}
            </h1>
            <div className="pill bg-amber-50 text-amber-600 border border-amber-100 font-bold">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {driver.rating}
            </div>
          </div>
          
          <div className="text-xl md:text-2xl font-medium text-text-muted display italic tracking-tight">
            {driver.shortDescription}
          </div>
          
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-text-muted uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {driver.city}
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              {driver.reviewCount} avis
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
              Facture Pro
            </span>
          </div>
        </div>
      </div>

      <p className="text-base text-text-muted leading-relaxed max-w-2xl font-medium">
        {driver.longDescription}
      </p>

      <div className="hidden md:flex items-center gap-4 pt-4">
        <button 
          onClick={handleBook}
          className="btn-black !py-4 !px-8 text-base shadow-lg"
        >
          Réserver maintenant
        </button>
        <button 
          onClick={handleWhatsApp}
          className="btn-ghost !py-4 !px-8 text-base !text-green !border-green/20 hover:!bg-green-light/50 transition-colors flex items-center justify-center gap-3"
        >
          Contact WhatsApp
        </button>
      </div>
    </div>
  );
}
