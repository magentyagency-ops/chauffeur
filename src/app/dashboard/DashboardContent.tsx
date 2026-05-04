"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockAvailability, isAvailabilityActive, getTimeRemaining, getPersistedAvailability, savePersistedAvailability } from "@/lib/mockAvailability";
import { getDriverBookings } from "@/lib/actions/bookings";
import { getPersistedProfile } from "@/lib/mockProfile";
import Link from "next/link";

export default function DashboardContent({ user, profile: initialProfile }: { user: any; profile: any }) {
  const [availability, setAvailability] = useState(mockAvailability);
  const [profile, setProfile] = useState(initialProfile);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; label: string } | null>(null);
  
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

  function disableAvailability() {
    const newAvail = { ...availability, is_available: false };
    setAvailability(newAvail);
    savePersistedAvailability(newAvail);
    setIsActive(false);
  }

  function enableAvailability() {
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
    </>
  );
}
