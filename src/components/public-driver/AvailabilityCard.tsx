"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive, getPersistedAvailability } from "@/lib/mockAvailability";

export default function AvailabilityCard({ availability: initialAvailability, firstName }: any) {
  const [availability, setAvailability] = useState(initialAvailability);
  
  useEffect(() => {
    setAvailability(getPersistedAvailability());
  }, []);

  const isAvailable = isAvailabilityActive(availability);

  const handleBook = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 overflow-hidden relative group ${
      isAvailable ? 'bg-green-light/20 border-green/10' : ''
    }`}>
      {isAvailable && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-green/5 rounded-full blur-3xl group-hover:bg-green/10 transition-colors duration-500" />
      )}

      <div className="flex items-center gap-6 relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
          isAvailable ? 'bg-green text-white shadow-[0_0_15px_rgba(6,193,103,0.3)]' : 'bg-surface-light text-text-muted border border-surface-border'
        }`}>
          {isAvailable ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className={`display text-xl font-medium tracking-tight flex items-center gap-3 ${isAvailable ? 'text-green' : 'text-foreground/80'}`}>
            {isAvailable ? "Disponible en direct" : "Actuellement hors ligne"}
            {isAvailable && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green text-[9px] font-black uppercase tracking-widest rounded text-white shadow-sm">
                Live
              </span>
            )}
          </h3>
          <p className="text-sm font-medium text-text-muted leading-relaxed">
            {isAvailable 
              ? availability.client_message
              : `Planning complet pour le moment. Réservez à l'avance pour vos futurs trajets.`}
          </p>
        </div>
      </div>

      <button 
        onClick={handleBook}
        className={`w-full md:w-auto !py-3 !px-8 text-sm relative z-10 transition-all duration-300 ${
          isAvailable 
            ? 'btn-black shadow-md' 
            : 'btn-ghost'
        }`}
      >
        {isAvailable ? "Demander une course" : "Réserver plus tard"}
      </button>
    </div>
  );
}
