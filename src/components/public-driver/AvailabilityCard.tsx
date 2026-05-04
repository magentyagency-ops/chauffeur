"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive, getPersistedAvailability } from "@/lib/mockAvailability";

export default function AvailabilityCard({ availability: initialAvailability }: any) {
  const [availability, setAvailability] = useState(initialAvailability);
  
  useEffect(() => {
    setAvailability(getPersistedAvailability());
  }, []);

  const isAvailable = isAvailabilityActive(availability);

  const handleBook = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
      isAvailable ? 'border-success/30 bg-success/[0.02]' : ''
    }`}>
      
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
          isAvailable ? 'bg-success text-background border-success' : 'bg-surface-alt text-muted border-border'
        }`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isAvailable ? (
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            ) : (
              <circle cx="12" cy="12" r="10" />
            )}
            {isAvailable && <polyline points="22 4 12 14.01 9 11.01" />}
            {!isAvailable && <line x1="12" y1="8" x2="12" y2="12" />}
            {!isAvailable && <line x1="12" y1="16" x2="12.01" y2="16" />}
          </svg>
        </div>
        
        <div>
          <h3 className={`text-lg font-bold mb-1 tracking-tight flex items-center gap-2 ${isAvailable ? 'text-success' : ''}`}>
            {isAvailable ? "Disponible maintenant" : "Disponible sur réservation"}
            {isAvailable && <span className="px-2 py-0.5 bg-success/20 text-success text-[10px] font-bold uppercase tracking-tight rounded">Live</span>}
          </h3>
          <p className="text-[14px] font-medium text-muted leading-relaxed">
            {isAvailable 
              ? availability.client_message
              : "Je suis actuellement indisponible pour une course immédiate. Vous pouvez réserver pour plus tard."}
          </p>
        </div>
      </div>

      <button 
        onClick={handleBook}
        className={`w-full md:w-auto px-6 py-3 rounded-xl text-[13px] font-bold transition-all border ${
          isAvailable 
            ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' 
            : 'btn-secondary'
        }`}
      >
        {isAvailable ? "Commander" : "Réserver"}
      </button>

    </div>
  );
}
