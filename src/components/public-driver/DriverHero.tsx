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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-surface-border to-surface flex items-center justify-center font-black text-foreground text-4xl shadow-2xl border-4 border-surface shrink-0 relative">
          {driver.firstName.charAt(0)}
          {isAvailabilityActive(availability) && (
            <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-background shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse" />
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none">
              {driver.publicName}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-sm font-bold shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {driver.rating}/5
            </div>
          </div>
          <div className="text-lg md:text-xl font-bold text-primary tracking-tight">
            {driver.shortDescription}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-text-secondary">
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {driver.city}
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              {driver.reviewCount} avis clients
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8"/></svg>
              Facture disponible
            </span>
          </div>
        </div>
      </div>

      <p className="text-base text-text-muted leading-relaxed max-w-3xl">
        {driver.longDescription}
      </p>

      <div className="hidden md:flex items-center gap-4 pt-4">
        <button 
          onClick={handleBook}
          className="px-8 py-4 bg-white text-background rounded-xl text-base font-black hover:bg-gray-100 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
        >
          Réserver maintenant
        </button>
        <button 
          onClick={handleWhatsApp}
          className="px-8 py-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl text-base font-black hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          Contact WhatsApp
        </button>
      </div>
    </div>
  );
}
