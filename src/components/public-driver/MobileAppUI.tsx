"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive } from "@/lib/mockAvailability";
import { createBooking } from "@/lib/actions/bookings";
import { motion } from "framer-motion";

export default function MobileAppUI({ driver }: { driver: any }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [timing, setTiming] = useState<"now" | "later">("now");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!driver.profilePhotoUrl && driver.user_id) {
        const savedPhoto = localStorage.getItem("privechauffeur_profile_photo_" + driver.user_id);
        if (savedPhoto) setLocalPhoto(savedPhoto);
      }
    } catch (e) {
      console.error("Local storage not available", e);
    }
  }, [driver]);

  const photoSrc = localPhoto || driver.profilePhotoUrl || "https://images.unsplash.com/photo-1626279140417-6d6f28f80455?q=80&w=800&auto=format&fit=crop";

  const cardBg = "bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
  const inputBg = "bg-white/5 backdrop-blur-md shadow-inner border border-white/5";
  const whiteBtn = "bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"; 
  const handleSubmit = async () => {
    if (timing === "later" && (!date || !time)) return alert("Veuillez indiquer la date et l'heure");
    setSending(true);
    await createBooking({
      driverSlug: driver.slug,
      clientName: "Client Privé",
      clientPhone: "0600000000",
      clientEmail: "client@example.com",
      pickupAddress: pickup,
      destinationAddress: dropoff,
      bookingType: timing,
      scheduledAt: timing === "now" ? new Date().toISOString() : `${date}T${time}:00.000Z`,
    });
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-[#34D399] selection:text-black relative flex flex-col">
      
      {/* 1. HERO IMAGE BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[65vh] z-0 overflow-hidden">
        <img 
          src={photoSrc} 
          alt={driver.publicName} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black" />
      </div>

      {/* Container simulating mobile constraints but centered on desktop */}
      <div className="max-w-md mx-auto min-h-[100dvh] relative z-10 flex flex-col p-5 w-full">
        
        {/* CONTENU PRINCIPAL POUSSÉ VERS LE BAS */}
        <div className="flex-1 flex flex-col justify-end pb-12 sm:pb-24">
          
          {/* TEXTE PRINCIPAL */}
          <h1 className="text-5xl font-[800] tracking-tight mb-8 leading-[1.1] font-display">
            Où souhaitez-<br/>vous aller ?
          </h1>
          
          {/* FORMULAIRE (FLOATING CARD) */}
          <div className={`rounded-[2rem] p-3 mt-4 mb-6 relative min-h-[160px] flex flex-col justify-center ${cardBg}`}>
            
            {/* Top Notch for Timing */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md shadow-inner border border-white/10 rounded-full px-1 py-1 flex items-center gap-1 z-20">
              <button 
                onClick={() => { setTiming("now"); setShowDatePicker(false); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timing === "now" && !showDatePicker ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
              >
                Immédiat
              </button>
              <button 
                onClick={() => { setTiming("later"); setShowDatePicker(true); }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timing === "later" || showDatePicker ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
              >
                Plus tard
              </button>
            </div>

            {showDatePicker ? (
              <div className="flex flex-col gap-3 pt-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center text-gray-300 font-medium mb-1">Quand souhaitez-vous partir ?</div>
                <div className="flex gap-2">
                  <div className={`flex-1 flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input 
                      type="date" 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]"
                    />
                  </div>
                  <div className={`w-32 flex items-center gap-2 ${inputBg} rounded-full px-4 py-4`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <input 
                      type="time" 
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setShowDatePicker(false)}
                  className={`w-full py-4 mt-2 rounded-full font-bold text-black transition-colors ${date && time ? "bg-[#34D399]" : "bg-gray-600"} `}
                  disabled={!date || !time}
                >
                  Valider l'horaire
                </button>
              </div>
            ) : (
              <div className="relative flex flex-col gap-2 pt-3 animate-in fade-in zoom-in-95 duration-200">
                {/* Pickup */}
                <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Lieu de départ" 
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full font-medium"
                  />
                  <button 
                    onClick={() => {
                      if ("geolocation" in navigator) {
                        setPickup("Recherche...");
                        navigator.geolocation.getCurrentPosition(
                          async (pos) => {
                            const lat = pos.coords.latitude;
                            const lon = pos.coords.longitude;
                            try {
                              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                              const data = await res.json();
                              if (data && data.address) {
                                const { house_number, road, city, town, village } = data.address;
                                const street = [house_number, road].filter(Boolean).join(" ");
                                const locality = city || town || village || "";
                                const shortAddress = [street, locality].filter(Boolean).join(", ");
                                setPickup(shortAddress || data.display_name);
                              } else if (data && data.display_name) {
                                setPickup(data.display_name);
                              } else {
                                setPickup(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
                              }
                            } catch (err) {
                              setPickup(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
                            }
                          },
                          () => { setPickup(""); alert("Veuillez autoriser la géolocalisation."); }
                        );
                      }
                    }}
                    className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Position actuelle"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
                    </svg>
                  </button>
                </div>

                {/* Dropoff */}
                <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Votre destination" 
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                    className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full font-medium"
                  />
                </div>
                
                {/* Swap Button */}
                <button 
                  className={`absolute top-[4.5rem] left-8 -translate-y-1/2 w-8 h-8 rounded-full bg-[rgba(20,20,20,1)] border-4 border-[#09090B] flex items-center justify-center z-10 hover:brightness-125 transition-all`}
                  onClick={() => {
                    const temp = pickup;
                    setPickup(dropoff);
                    setDropoff(temp);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m17 2 4 4-4 4"></path>
                    <path d="M3 11v-1a4 4 0 0 1 4-4h14"></path>
                    <path d="m7 22-4-4 4-4"></path>
                    <path d="M21 13v1a4 4 0 0 1-4 4H3"></path>
                  </svg>
                </button>

                {/* Discreet Date/Time Summary */}
                {timing === "later" && date && time && (
                  <div 
                    onClick={() => setShowDatePicker(true)}
                    className="mt-2 text-center text-sm font-medium text-[#34D399] cursor-pointer hover:brightness-125 flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Planifié le {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {time}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA BOUTON */}
          <div className="flex">
            <button 
              onClick={handleSubmit}
              disabled={sending}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-black transition-all active:scale-[0.98] ${
                sending ? "bg-gray-400 cursor-not-allowed" : `${whiteBtn} hover:brightness-110 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]`
              }`}
            >
              {sending ? "Envoi..." : "Confirmer la course"}
            </button>
          </div>

        </div>

        {/* MODAL SUCCESS */}
        {sent && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-[#1C1C1E] p-6 rounded-[2rem] max-w-sm w-full text-center border border-white/10">
              <div className="w-16 h-16 bg-[#34D399] text-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Demande envoyée</h3>
              <p className="text-gray-400">Le chauffeur vous contactera très rapidement pour confirmer.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
