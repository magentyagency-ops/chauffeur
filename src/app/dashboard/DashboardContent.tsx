"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockAvailability, isAvailabilityActive, getTimeRemaining, getPersistedAvailability, savePersistedAvailability } from "@/lib/mockAvailability";
import { getDriverBookings, updateBookingStatus } from "@/lib/actions/bookings";
import { updateDriverAvailability } from "@/lib/actions/profile";
import { getPersistedProfile } from "@/lib/mockProfile";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardContent({ user, profile: initialProfile }: { user: any; profile: any }) {
  const [availability, setAvailability] = useState(mockAvailability);
  const [profile, setProfile] = useState(initialProfile);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; label: string } | null>(null);
  
  const [incomingBooking, setIncomingBooking] = useState<any | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  
  useEffect(() => {
    const savedAvail = getPersistedAvailability();
    setAvailability(savedAvail);
    setIsActive(isAvailabilityActive(savedAvail));
    setTimeRemaining(getTimeRemaining(savedAvail.available_until));

    const userId = user?.id || "default";
    const savedProfile = getPersistedProfile(userId);
    
    // If we have a real profile from Supabase and no saved data in localStorage,
    // we should use the Supabase data instead of the default "Jean" data.
    if (initialProfile && !localStorage.getItem(`privechauffeur_driver_profile_${userId}`)) {
      const mergedProfile: any = {
        fullName: initialProfile.full_name || "",
        phone: initialProfile.phone || "",
        whatsapp: initialProfile.whatsapp || initialProfile.phone || "",
        city: initialProfile.city || "",
        bio: initialProfile.bio || "",
        publicSlug: initialProfile.public_slug || "",
      };
      setProfile(mergedProfile);
    } else {
      setProfile(savedProfile);
    }
  }, [user, initialProfile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(isAvailabilityActive(availability));
      setTimeRemaining(getTimeRemaining(availability.available_until));
    }, 60000);
    return () => clearInterval(interval);
  }, [availability]);

  async function disableAvailability() {
    const newAvail = { ...availability, is_available: false };
    setAvailability(newAvail);
    savePersistedAvailability(newAvail);
    setIsActive(false);
    await updateDriverAvailability(false);
  }

  async function enableAvailability() {
    const now = new Date();
    const availableUntil = new Date(now.getTime() + 8 * 60 * 60 * 1000); // +8h default
    const newAvail = { 
      ...availability, 
      is_available: true, 
      available_until: availableUntil.toISOString(),
    };
    setAvailability(newAvail);
    savePersistedAvailability(newAvail);
    setIsActive(true);
    await updateDriverAvailability(true);
  }

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const bookingsRes = await getDriverBookings({ status: "all", dateRange: "all" });
      setBookings((bookingsRes.bookings || []).filter((b: any) => b.status === "pending" || b.status === "accepted").slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  // Listen for incoming bookings in real-time
  useEffect(() => {
    if (!profile?.id) return;
    const supabase = createClient();
    const channel = supabase
      .channel("incoming-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `driver_id=eq.${profile.id}`,
        },
        (payload) => {
          if (payload.new.status === "pending") {
            // Check if it's not already in the list
            setIncomingBooking(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  async function handleAcceptBooking() {
    if (!incomingBooking) return;
    setProcessingAction(true);
    const res = await updateBookingStatus({
      bookingId: incomingBooking.id,
      newStatus: "accepted",
    });
    setProcessingAction(false);
    if (res.success && res.booking) {
      setIncomingBooking(null);
      // Add the accepted booking to the top of the list and remove duplicates
      setBookings((prev) => {
        const filtered = prev.filter(b => b.id !== res.booking.id);
        return [res.booking, ...filtered].slice(0, 5);
      });
    } else {
      alert("Erreur lors de l'acceptation de la course.");
    }
  }

  async function handleRefuseBooking() {
    if (!incomingBooking) return;
    setProcessingAction(true);
    const res = await updateBookingStatus({
      bookingId: incomingBooking.id,
      newStatus: "refused",
    });
    setProcessingAction(false);
    if (res.success) {
      setIncomingBooking(null);
    } else {
      alert("Erreur lors du refus de la course.");
    }
  }

  const firstName = profile?.fullName?.split(" ")[0] || profile?.full_name?.split(" ")[0] || "Chauffeur";

  return (
    <>
      <DashboardHeader>
        <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-4 py-2 rounded-full">
          <span className="text-[13px] font-[800] text-black hidden sm:block">
            {isActive ? "En ligne" : "Hors ligne"}
          </span>
          <button
            onClick={() => {
              if (isActive) disableAvailability();
              else enableAvailability();
            }}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${
              isActive ? "bg-[#34D399]" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                isActive ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-12 pb-32">
        
        {/* Welcome */}
        <section>
          <h2 className="text-4xl font-[800] tracking-tight mb-2 font-display text-black">Bonjour {firstName}</h2>
          <p className="text-gray-500 font-medium text-[16px]">Voici vos prochaines courses.</p>
        </section>



        {/* Upcoming Bookings */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-[800] tracking-tight text-black">Prochaines courses</h3>
            <Link href="/dashboard/bookings" className="text-[14px] font-bold text-gray-400 hover:text-black transition-all">Tout voir</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-12 text-center">
                <span className="animate-spin inline-block w-8 h-8 border-[3px] border-black border-t-transparent rounded-full" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-xl border border-dashed border-gray-200 rounded-[2rem] p-16 text-center">
                <p className="text-gray-500 font-bold text-sm">Aucune course à venir.</p>
              </div>
            ) : (
              bookings.map(b => {
                const date = new Date(b.scheduled_at || b.created_at);
                return (
                  <div key={b.id} className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-6 flex items-center justify-between group transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 shadow-inner">
                        <span className="text-[10px] font-[800] text-gray-400 uppercase tracking-wider">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                        <span className="text-xl font-[800] text-black leading-tight">{date.getDate()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-[800] text-[16px] text-black">{b.client_name}</span>
                          <span className={`text-[10px] px-2 py-1 rounded-full font-[800] uppercase tracking-wider ${
                            b.status === 'accepted' ? 'bg-[#34D399]/10 text-[#059669]' : 'bg-orange-500/10 text-orange-600'
                          }`}>
                            {b.status === 'accepted' ? 'Confirmé' : 'Attente'}
                          </span>
                        </div>
                        <div className="text-[13px] text-gray-400 font-medium flex items-center gap-1.5">
                          <span className="text-black font-[800]">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-gray-300">•</span>
                          <span className="truncate max-w-[150px] sm:max-w-xs">{b.pickup_address.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                    {b.estimated_price && (
                      <div className="font-[800] text-[18px] text-black hidden sm:block bg-gray-50 px-4 py-2 rounded-xl shadow-inner border border-gray-100">
                        {b.estimated_price}€
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Incoming Booking Modal */}
      <AnimatePresence>
        {incomingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-black text-white p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                <div className="relative z-20">
                  <div className="w-20 h-20 bg-[#34D399] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-[900] tracking-tight font-display text-white">Nouvelle Demande</h2>
                  <p className="text-[#34D399] mt-2 font-bold text-lg uppercase tracking-widest">{incomingBooking.booking_type === "now" ? "Départ Immédiat" : "Réservation Programmée"}</p>
                </div>
              </div>
              <div className="p-8 space-y-6 bg-gray-50">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Passager</p>
                  <p className="font-[800] text-xl text-black">{incomingBooking.client_name}</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                  <div className="relative pl-6 border-l-2 border-black">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-black" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Prise en charge</p>
                    <p className="font-[800] text-black leading-tight">{incomingBooking.pickup_address}</p>
                  </div>
                  <div className="relative pl-6 border-l-2 border-[#34D399]">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#34D399]" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Destination</p>
                    <p className="font-[800] text-black leading-tight">{incomingBooking.destination_address}</p>
                  </div>
                </div>
                
                {incomingBooking.scheduled_at && incomingBooking.booking_type === "later" && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date prévue</p>
                     <p className="font-[900] text-black">{new Date(incomingBooking.scheduled_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short'})}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleRefuseBooking}
                    disabled={processingAction}
                    className="flex-1 py-4 rounded-xl font-bold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-100 hover:text-black hover:border-gray-300 transition-all active:scale-[0.98]"
                  >
                    {processingAction ? "..." : "Refuser"}
                  </button>
                  <button
                    onClick={handleAcceptBooking}
                    disabled={processingAction}
                    className="flex-1 py-4 rounded-xl font-[900] text-black bg-[#34D399] hover:bg-[#10B981] transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(52,211,153,0.4)]"
                  >
                    {processingAction ? "..." : "Accepter"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
