"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createBooking } from "@/lib/actions/bookings";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function MobileAppUI({ driver }: { driver: any }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [clientName, setClientName] = useState("");
  const [timing, setTiming] = useState<"now" | "later">("now");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sending, setSending] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const statusRef = useRef<string | null>(null);
  const photoSrc = driver.profilePhotoUrl || "https://images.unsplash.com/photo-1626279140417-6d6f28f80455?q=80&w=800&auto=format&fit=crop";

  // Keep ref in sync with state
  useEffect(() => { statusRef.current = bookingStatus; }, [bookingStatus]);

  const cardBg = "bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
  const inputBg = "bg-white/5 backdrop-blur-md shadow-inner border border-white/5";
  const whiteBtn = "bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"; 

  const handleSubmit = async () => {
    if (!clientName.trim()) return alert("Veuillez indiquer votre nom pour le chauffeur.");
    if (timing === "later" && (!date || !time)) return alert("Veuillez indiquer la date et l'heure");
    if (!pickup || !dropoff) return alert("Veuillez indiquer le départ et l'arrivée");
    
    setSending(true);
    const result = await createBooking({
      driverSlug: driver.slug,
      clientName: clientName.trim(),
      clientPhone: "0600000000",
      clientEmail: "client@example.com",
      pickupAddress: pickup,
      destinationAddress: dropoff,
      bookingType: timing,
      scheduledAt: timing === "now" ? new Date().toISOString() : `${date}T${time}:00.000Z`,
    });

    setSending(false);
    
    if (result.success && result.booking?.id) {
      setActiveBookingId(result.booking.id);
      setBookingStatus("pending");
    } else {
      alert(result.error || "Une erreur est survenue lors de la réservation.");
    }
  };

  // Direct client-side polling function (bypasses server action RLS issues)
  const pollStatus = useCallback(async (bookingId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("bookings")
        .select("status")
        .eq("id", bookingId)
        .single();
      if (!error && data?.status && data.status !== statusRef.current) {
        setBookingStatus(data.status);
      }
    } catch (e) {
      console.error("Poll error:", e);
    }
  }, []);

  // STATUS TRACKING — stable effect, runs once per booking
  useEffect(() => {
    if (!activeBookingId) return;

    const supabase = createClient();
    let stopped = false;

    // 1. Polling every 2s directly from browser (no server action)
    const interval = setInterval(() => {
      if (!stopped && statusRef.current !== "accepted") {
        pollStatus(activeBookingId);
      }
    }, 2000);

    // 2. Realtime subscription
    const channel = supabase
      .channel(`booking-live-${activeBookingId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings", filter: `id=eq.${activeBookingId}` },
        (payload) => {
          if (payload.new?.status) {
            setBookingStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    return () => {
      stopped = true;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [activeBookingId, pollStatus]);

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
          
          {/* TEXTE PRINCIPAL (Hidden if booking active) */}
          {!activeBookingId && (
            <h1 className="text-5xl font-[800] tracking-tight mb-8 leading-[1.1] font-display">
              Où souhaitez-<br/>vous aller ?
            </h1>
          )}
          
          {/* FORMULAIRE (FLOATING CARD) OU STATUT */}
          <div className={`rounded-[2rem] p-3 mt-4 mb-6 relative min-h-[160px] flex flex-col justify-center ${cardBg}`}>
            <AnimatePresence mode="wait">
              {!activeBookingId ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex flex-col gap-2 pt-3"
                >
                  {/* Top Notch for Timing */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md shadow-inner border border-white/10 rounded-full px-1 py-0.5 flex items-center gap-1 z-20">
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

                  {/* Date/Time Picker Modal (Si affiché) */}
                  {showDatePicker ? (
                    <div className="p-4 space-y-4">
                      <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <input 
                          type="date" 
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]"
                        />
                      </div>
                      <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <input 
                          type="time" 
                          value={time}
                          onChange={e => setTime(e.target.value)}
                          className="bg-transparent border-none outline-none text-white w-full font-medium [color-scheme:dark]"
                        />
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
                    <div className="relative flex flex-col gap-2 pt-3">
                      {/* Name */}
                      <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4 mb-2`}>
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Votre nom" 
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full font-medium"
                        />
                      </div>

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
                              navigator.geolocation.getCurrentPosition(
                                async (pos) => {
                                  setPickup("Recherche...");
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
                                (error) => { 
                                  setPickup(""); 
                                  if (error.code === 1) {
                                    alert("La géolocalisation est bloquée. Veuillez l'autoriser dans les réglages de votre navigateur.");
                                  } else {
                                    alert("Impossible de vous localiser.");
                                  }
                                },
                                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
                              );
                            }
                          }}
                          className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
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
                        className={`absolute top-[8.5rem] left-8 -translate-y-1/2 w-8 h-8 rounded-full bg-[rgba(20,20,20,1)] border-4 border-[#09090B] flex items-center justify-center z-10 hover:brightness-125 transition-all`}
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
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="status"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-6 px-4 text-center overflow-hidden rounded-[2rem]"
                >
                  {bookingStatus === "pending" ? (
                    <>
                      <div className="relative w-20 h-20 mb-6">
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 bg-[#34D399] rounded-full"
                        />
                        <div className="absolute inset-4 bg-[#34D399] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-[800] mb-2">Recherche en cours...</h3>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-[240px]">
                        Demande envoyée à <span className="text-white font-bold">{driver.publicName}</span>.
                      </p>
                    </>
                  ) : bookingStatus === "accepted" ? (
                    <>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-[#34D399] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      </motion.div>
                      <h3 className="text-2xl font-[900] text-[#34D399] mb-2">Course Acceptée !</h3>
                      <p className="text-white font-medium mb-1">{driver.publicName} est en route.</p>
                      <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mt-4">
                        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                        <span className="text-sm font-bold">Arrivée estimée : 5-10 min</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m18 6-12 12M6 6l12 12"/></svg>
                      </div>
                      <h3 className="text-lg font-bold mb-1">Statut : {bookingStatus}</h3>
                      <button 
                        onClick={() => setActiveBookingId(null)}
                        className="text-xs text-gray-400 underline mt-2"
                      >
                        Retour
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA BOUTON - HIDDEN IF ACTIVE BOOKING */}
          {!activeBookingId && (
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
          )}
        </div>
      </div>
    </div>
  );
}
