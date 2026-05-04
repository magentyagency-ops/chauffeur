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
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold text-foreground text-2xl md:text-3xl shrink-0 relative overflow-hidden">
          {driver.profilePhotoUrl ? (
            <img src={driver.profilePhotoUrl} alt={driver.publicName} className="w-full h-full object-cover" />
          ) : (
            driver.firstName?.charAt(0) || "C"
          )}
          {isAvailabilityActive(availability) && (
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-success border-[3px] border-background z-10" />
          )}
        </div>
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            {driver.publicName}
          </h1>
          <div className="flex items-center gap-3 text-[13px] text-muted font-medium">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {driver.city}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-accent font-semibold">★ {driver.rating}</span>
            <span>·</span>
            <span>{driver.reviewCount} avis</span>
          </div>
        </div>
      </div>

      <p className="text-[15px] text-muted leading-relaxed">{driver.shortDescription}</p>

      <div className="hidden md:flex items-center gap-3">
        <button onClick={handleBook} className="btn-primary !py-3 !px-6">Réserver</button>
        <button onClick={handleWhatsApp} className="btn-secondary !py-3 !px-6">WhatsApp</button>
      </div>
    </div>
  );
}
