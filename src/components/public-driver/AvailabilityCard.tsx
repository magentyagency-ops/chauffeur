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
    <div className={`glass rounded-[1.5rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 transition-all shadow-xl relative overflow-hidden ${
      isAvailable ? 'border-green-500/30 bg-gradient-to-r from-green-950/40 to-background shadow-green-500/10' : 'border-surface-border'
    }`}>
      
      {isAvailable && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="flex items-center gap-5 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
          isAvailable ? 'bg-green-500 text-foreground shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-surface-light text-text-muted'
        }`}>
          {isAvailable ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
        </div>
        
        <div>
          <h3 className={`text-xl font-black mb-1 tracking-tight flex items-center gap-2 ${isAvailable ? 'text-green-400' : 'text-foreground'}`}>
            {isAvailable ? "Disponible maintenant" : "Indisponible pour le moment"}
            {isAvailable && <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-[10px] font-black uppercase tracking-wider rounded text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live</span>}
          </h3>
          <p className="text-sm md:text-base font-medium text-text-muted">
            {isAvailable 
              ? availability.client_message
              : `Vous pouvez néanmoins réserver une course pour plus tard.`}
          </p>
        </div>
      </div>

      <button 
        onClick={handleBook}
        className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm relative z-10 ${
          isAvailable 
            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20' 
            : 'bg-surface border border-surface-border text-foreground hover:bg-surface-light'
        }`}
      >
        {isAvailable ? "Demander une course" : "Réserver plus tard"}
      </button>

    </div>
  );
}
