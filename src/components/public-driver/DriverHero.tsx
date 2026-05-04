"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive, getPersistedAvailability } from "@/lib/mockAvailability";
import { getPersistedProfile, type DriverProfile, getPersistedPhoto } from "@/lib/mockProfile";

export default function DriverHero({ driver: initialDriver }: { driver: any }) {
  const [availability, setAvailability] = useState(initialDriver.availability);
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    setAvailability(getPersistedAvailability());
    setProfile(getPersistedProfile());
    setProfilePhoto(getPersistedPhoto());
  }, []);

  const handleWhatsApp = () => {
    const whatsappNumber = profile?.whatsapp || initialDriver.whatsapp;
    window.open(`https://wa.me/${whatsappNumber}?text=Bonjour, je souhaite réserver une course.`, '_blank');
  };

  const handleBook = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  const displayName = profile?.fullName || initialDriver.publicName;
  const displayCity = profile?.city || initialDriver.city;
  const displayBio = profile?.bio || initialDriver.shortDescription;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold text-foreground text-2xl md:text-3xl shrink-0 relative overflow-hidden">
          {profilePhoto ? (
            <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            displayName.charAt(0)
          )}
          {isAvailabilityActive(availability) && (
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-success border-[3px] border-background z-10" />
          )}
        </div>
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
            {displayName}
          </h1>
          <div className="flex items-center gap-3 text-[13px] text-muted font-medium">
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {displayCity}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-accent font-semibold">★ {initialDriver.rating}</span>
            <span>·</span>
            <span>{initialDriver.reviewCount} avis</span>
          </div>
        </div>
      </div>

      <p className="text-[15px] text-muted leading-relaxed whitespace-pre-wrap">{displayBio}</p>

      <div className="hidden md:flex items-center gap-3">
        <button onClick={handleBook} className="btn-primary !py-3 !px-6">Réserver</button>
        <button onClick={handleWhatsApp} className="btn-secondary !py-3 !px-6">WhatsApp</button>
      </div>
    </div>
  );
}
