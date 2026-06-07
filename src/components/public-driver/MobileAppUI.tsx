"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createBooking } from "@/lib/actions/bookings";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

const DynamicTrackingMap = dynamic(() => import("./TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] animate-pulse flex items-center justify-center">
      <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Chargement du GPS...</p>
    </div>
  )
});

export default function MobileAppUI({ driver }: { driver: any }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [clientName, setClientName] = useState("");
  const [timing, setTiming] = useState<"now" | "later">(driver.isAvailable ? "now" : "later");
  const [showDatePicker, setShowDatePicker] = useState(!driver.isAvailable);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sending, setSending] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<"pickup" | "dropoff" | null>(null);
  const [recentAddresses, setRecentAddresses] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // Default to true for SSR
  const statusRef = useRef<string | null>(null);
  const photoSrc = driver.profilePhotoUrl || "https://images.unsplash.com/photo-1626279140417-6d6f28f80455?q=80&w=800&auto=format&fit=crop";

  // Check if running in standalone mode (installed as PWA)
  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setIsStandalone(!!isStandaloneMode);
    };
    checkStandalone();
  }, []);

  // Keep ref in sync with state
  useEffect(() => { statusRef.current = bookingStatus; }, [bookingStatus]);

  // Load saved client information from local storage (device cache)
  useEffect(() => {
    const savedName = localStorage.getItem("privechauffeur_client_name");
    if (savedName) setClientName(savedName);
    
    const savedAddresses = localStorage.getItem("privechauffeur_recent_addresses");
    if (savedAddresses) {
      try {
        setRecentAddresses(JSON.parse(savedAddresses));
      } catch (e) {}
    }
  }, []);

  const cardBg = "bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]";
  const inputBg = "bg-white/5 backdrop-blur-md shadow-inner border border-white/5";
  const whiteBtn = "bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"; 

  // Address Autocomplete function
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=fr`);
      const data = await res.json();
      if (data && data.features) {
        const results = data.features.map((f: any) => {
          const p = f.properties;
          const name = p.name || "";
          const housenumber = p.housenumber || "";
          const street = p.street || "";
          const city = p.city || p.town || p.village || "";
          const postcode = p.postcode || "";
          
          // Format: [N°] [Rue], [Ville] [CP]
          let label = "";
          if (housenumber) label += `${housenumber} `;
          if (street) {
            label += street;
          } else {
            label += name;
          }
          
          if (city) label += `, ${city}`;
          if (postcode) label += ` ${postcode}`;
          
          return label;
        });
        setSuggestions(results);
      }
    } catch (e) {
      console.error("Autocomplete error:", e);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const activeValue = activeInput === "pickup" ? pickup : activeInput === "dropoff" ? dropoff : "";
    if (!activeValue || activeValue.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchSuggestions(activeValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [pickup, dropoff, activeInput]);

  const handleSubmit = async () => {
    if (!clientName.trim()) return alert("Veuillez indiquer votre nom pour le chauffeur.");
    if (timing === "later" && (!date || !time)) return alert("Veuillez indiquer la date et l'heure");
    if (!pickup || !dropoff) return alert("Veuillez indiquer le départ et l'arrivée");
    
    // Save client info locally for next time
    localStorage.setItem("privechauffeur_client_name", clientName.trim());
    
    // Save recent addresses locally
    const newAddresses = Array.from(new Set([pickup.trim(), dropoff.trim(), ...recentAddresses])).filter(Boolean).slice(0, 5);
    setRecentAddresses(newAddresses);
    localStorage.setItem("privechauffeur_recent_addresses", JSON.stringify(newAddresses));

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

  const [driverEta, setDriverEta] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!activeBookingId) return;
    
    const confirmMsg = bookingStatus === "accepted" 
      ? `Êtes-vous sûr de vouloir annuler ? ${driver.publicName} est déjà en route.`
      : `Êtes-vous sûr de vouloir annuler la demande pour ${driver.publicName} ?`;
      
    if (!window.confirm(confirmMsg)) return;

    setIsCancelling(true);
    try {
      const { cancelBookingByClient } = await import("@/lib/actions/bookings");
      const res = await cancelBookingByClient(activeBookingId);
      if (res.success) {
        setBookingStatus("cancelled");
        setActiveBookingId(null);
      } else {
        alert(res.error || "Erreur lors de l'annulation.");
      }
    } catch (e) {
      alert("Une erreur est survenue.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Direct client-side polling function via Server Action (Secure)
  const pollStatus = useCallback(async (bookingId: string) => {
    try {
      const { getBookingStatus } = await import("@/lib/actions/bookings");
      const res = await getBookingStatus(bookingId);
      
      if (res && res.status !== statusRef.current) {
        setBookingStatus(res.status);
      }
      if (res && res.eta !== undefined && res.eta !== null) {
        setDriverEta(res.eta);
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
          if (payload.new?.driver_eta_minutes !== undefined && payload.new?.driver_eta_minutes !== null) {
            setDriverEta(payload.new.driver_eta_minutes);
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

  if (!isStandalone) {
    return <InstallPWAOverlay driver={driver} />;
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black relative flex flex-col">
      
      {/* 1. HERO IMAGE OR MAP BACKGROUND */}
      <div className={`absolute top-0 left-0 w-full z-0 overflow-hidden transition-all duration-1000 ${bookingStatus === "accepted" ? "h-[100dvh]" : "h-[65vh]"}`}>
        {bookingStatus === "accepted" ? (
          <DynamicTrackingMap pickupAddress={pickup} dropoffAddress={dropoff} />
        ) : (
          <>
            <img 
              src={photoSrc} 
              alt={driver.publicName} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black" />
          </>
        )}
      </div>

      {/* Container simulating mobile constraints but centered on desktop */}
      <div className={`max-w-md mx-auto min-h-[100dvh] relative z-10 flex flex-col p-5 w-full ${bookingStatus === "accepted" ? "justify-end pointer-events-none" : ""}`}>
        
        {/* CONTENU PRINCIPAL POUSSÉ VERS LE BAS */}
        <div className="flex-1 flex flex-col justify-end pb-12 sm:pb-24">
          
          {/* TEXTE PRINCIPAL (Hidden if booking active) */}
          {!activeBookingId && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4">
                <span className={`w-2 h-2 rounded-full ${driver.isAvailable ? "bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-gray-500"}`}></span>
                <span className="text-sm font-bold text-white/90">
                  {driver.isAvailable ? "Disponible immédiatement" : "Sur réservation"}
                </span>
              </div>
              <h1 className="text-5xl font-[800] tracking-tight leading-[1.1] font-display">
                Où souhaitez-<br/>vous aller ?
              </h1>
            </div>
          )}
          
          {/* FORMULAIRE (FLOATING CARD) OU STATUT */}
          {bookingStatus !== "accepted" ? (
            <div className={`rounded-[2rem] p-3 mt-4 mb-6 relative min-h-[160px] flex flex-col justify-center ${cardBg}`}>
              <AnimatePresence mode="wait">
                {!activeBookingId ? (
                  !driver.isAvailable ? (
                    <motion.div 
                      key="offline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-10 px-6 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2.5"><path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/><path d="M12 2v4"/><path d="m2 2 20 20"/></svg>
                      </div>
                      <h3 className="text-xl font-[800] text-white mb-2">Chauffeur Indisponible</h3>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
                        {driver.publicName} n'accepte actuellement aucune réservation. Veuillez réessayer plus tard.
                      </p>
                    </motion.div>
                  ) : (
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
                        onClick={() => { if (driver.isAvailable) { setTiming("now"); setShowDatePicker(false); } }}
                        disabled={!driver.isAvailable}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timing === "now" && !showDatePicker ? "bg-white text-black" : "text-gray-400"} ${!driver.isAvailable ? "opacity-50 cursor-not-allowed" : "hover:text-white"}`}
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
                          className={`w-full py-4 mt-2 rounded-full font-bold text-black transition-colors ${date && time ? "bg-white" : "bg-gray-600"} `}
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
                        <div className="relative">
                          <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                            <input 
                              type="text" 
                              placeholder="Lieu de départ" 
                              value={pickup}
                              onChange={e => setPickup(e.target.value)}
                              onFocus={() => setActiveInput("pickup")}
                              onBlur={() => setTimeout(() => setActiveInput(null), 200)}
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
                          
                          {/* Dropdown Suggestions & Récents */}
                          <AnimatePresence>
                            {activeInput === "pickup" && (suggestions.length > 0 || recentAddresses.length > 0) && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl overflow-hidden"
                              >
                                {suggestions.length > 0 ? (
                                  <>
                                    <p className="text-[10px] text-gray-500 font-bold px-3 py-1 uppercase tracking-wider mb-1">Suggestions</p>
                                    {suggestions.map((addr, idx) => (
                                      <button 
                                        key={`sug-${idx}`}
                                        onClick={() => { setPickup(addr); setSuggestions([]); setActiveInput(null); }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group"
                                      >
                                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/20">
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white/90 truncate">{addr}</span>
                                      </button>
                                    ))}
                                  </>
                                ) : recentAddresses.length > 0 && (
                                  <>
                                    <p className="text-[10px] text-gray-500 font-bold px-3 py-1 uppercase tracking-wider mb-1">Récents</p>
                                    {recentAddresses.map((addr, idx) => (
                                      <button 
                                        key={`rec-${idx}`}
                                        onClick={() => { setPickup(addr); setActiveInput(null); }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span className="text-sm font-medium text-white/90 truncate">{addr}</span>
                                      </button>
                                    ))}
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Dropoff */}
                        <div className="relative">
                          <div className={`flex items-center gap-3 ${inputBg} rounded-full px-5 py-4`}>
                            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            </div>
                            <input 
                              type="text" 
                              placeholder="Votre destination" 
                              value={dropoff}
                              onChange={e => setDropoff(e.target.value)}
                              onFocus={() => setActiveInput("dropoff")}
                              onBlur={() => setTimeout(() => setActiveInput(null), 200)}
                              className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full font-medium"
                            />
                          </div>

                          {/* Dropdown Suggestions & Récents */}
                          <AnimatePresence>
                            {activeInput === "dropoff" && (suggestions.length > 0 || recentAddresses.length > 0) && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl overflow-hidden"
                              >
                                {suggestions.length > 0 ? (
                                  <>
                                    <p className="text-[10px] text-gray-500 font-bold px-3 py-1 uppercase tracking-wider mb-1">Suggestions</p>
                                    {suggestions.map((addr, idx) => (
                                      <button 
                                        key={`sug-drop-${idx}`}
                                        onClick={() => { setDropoff(addr); setSuggestions([]); setActiveInput(null); }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group"
                                      >
                                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/20">
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        </div>
                                        <span className="text-sm font-medium text-white/90 truncate">{addr}</span>
                                      </button>
                                    ))}
                                  </>
                                ) : recentAddresses.length > 0 && (
                                  <>
                                    <p className="text-[10px] text-gray-500 font-bold px-3 py-1 uppercase tracking-wider mb-1">Récents</p>
                                    {recentAddresses.map((addr, idx) => (
                                      <button 
                                        key={`rec-drop-${idx}`}
                                        onClick={() => { setDropoff(addr); setActiveInput(null); }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span className="text-sm font-medium text-white/90 truncate">{addr}</span>
                                      </button>
                                    ))}
                                  </>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                  )
                ) : (
                  <motion.div 
                    key="status-pending"
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
                            className="absolute inset-0 bg-white rounded-full"
                          />
                          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path>
                            </svg>
                          </div>
                        </div>
                        <h3 className="text-xl font-[800] mb-2">{driver.publicName} traite votre demande</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] mb-4">
                          Demande envoyée à <span className="text-white font-bold">{driver.publicName}</span>.
                        </p>
                        <button 
                          onClick={handleCancelBooking}
                          disabled={isCancelling}
                          className="mt-2 px-6 py-2 rounded-full bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 transition-colors border border-red-500/20"
                        >
                          {isCancelling ? "Annulation..." : "Annuler la demande"}
                        </button>
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
          ) : (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-[#111] backdrop-blur-2xl rounded-[2rem] p-6 pb-8 border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pointer-events-auto mt-auto mb-[-20px]"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-[900] text-white tracking-tight mb-1">En route</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <p className="text-white/80 font-bold text-sm">Arrivée estimée : {driverEta !== null ? (driverEta === 0 ? "Imminente" : `${driverEta} min`) : "Calcul en cours..."}</p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                   <img src={driver.profilePhotoUrl} alt={driver.publicName} className="w-full h-full object-cover" />
                </div>
              </div>
              
               <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5 shadow-inner mb-4">
                 <div>
                   <p className="font-[800] text-white text-lg">{driver.publicName}</p>
                   <p className="text-sm text-gray-400 font-medium">{driver.vehicle.model}</p>
                 </div>
                 <div className="bg-white text-black font-[900] px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                   4.9 ★
                 </div>
              </div>
              
              <button 
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="w-full py-4 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-colors border border-red-500/20 flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                {isCancelling ? "Annulation..." : "Annuler la course"}
              </button>
            </motion.div>
          )}

          {/* CTA BOUTON - HIDDEN IF ACTIVE BOOKING */}
          {!activeBookingId && driver.isAvailable && (
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

function InstallPWAOverlay({ driver }: { driver: any }) {
  const photoSrc = driver.profilePhotoUrl || "https://images.unsplash.com/photo-1626279140417-6d6f28f80455?q=80&w=800&auto=format&fit=crop";
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background with Driver Photo */}
      <div className="absolute inset-0 z-0">
        <img src={photoSrc} className="w-full h-full object-cover opacity-40 blur-sm scale-110" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden mx-auto mb-6 border-2 border-white/20 shadow-2xl">
            <img src={photoSrc} className="w-full h-full object-cover" alt={driver.publicName} />
          </div>
          <h1 className="text-3xl font-[900] tracking-tight mb-2 font-display uppercase tracking-tighter">
            {driver.publicName}
          </h1>
          <p className="text-gray-400 font-medium">Votre chauffeur privé personnel</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 w-full shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
          
          <h2 className="text-xl font-bold mb-6">Installez l'application</h2>
          <p className="text-sm text-gray-400 mb-10 leading-relaxed px-2">
            Pour réserver une course et suivre votre chauffeur en temps réel, veuillez ajouter cette page à votre écran d'accueil.
          </p>

          <div className="space-y-8 text-left">
            {deferredPrompt ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <button 
                  onClick={handleNativeInstall}
                  className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:brightness-110 transition-all text-lg"
                >
                  Installer l'application
                </button>
                <p className="text-xs text-gray-500 font-medium">Installation rapide et sécurisée via votre navigateur.</p>
              </div>
            ) : isIOS ? (
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-white mb-1">1. Cliquez sur "Partager"</p>
                  <p className="text-xs text-gray-500 font-medium">En bas au centre de votre Safari.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-white mb-1">1. Cliquez sur le menu</p>
                  <p className="text-xs text-gray-500 font-medium">Les 3 points en haut à droite de Chrome.</p>
                </div>
              </div>
            )}

            {!deferredPrompt && (
              <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div className="pt-1">
                <p className="text-sm font-bold text-white mb-1">2. "Sur l'écran d'accueil"</p>
                <p className="text-xs text-gray-500 font-medium">L'application s'installera instantanément.</p>
              </div>
            </div>
            )}
          </div>
        </motion.div>

        <div className="mt-auto pt-12">
           <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] opacity-80">Expérience Privée Haut de Gamme</p>
        </div>
      </div>
    </div>
  );
}
