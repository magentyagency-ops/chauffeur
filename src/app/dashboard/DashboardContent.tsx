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
        <div className={`md:hidden flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-tight transition-colors ${
          isActive ? "bg-success/10 border-success/20 text-success" : "bg-surface border-border text-muted"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success animate-pulse" : "bg-muted"}`} />
          {isActive ? "En ligne" : "Hors ligne"}
        </div>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-10 pb-32">
        
        {/* Welcome */}
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Bonjour {firstName}</h2>
          <p className="text-muted text-[15px]">Voici vos prochaines courses.</p>
        </section>

        {/* Availability Banner */}
        <section className={`card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${isActive ? "border-success/30 bg-success/[0.02]" : ""}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-success text-background" : "bg-surface-alt text-muted"}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {isActive ? <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /> : <circle cx="12" cy="12" r="10" />}
                {isActive && <polyline points="22 4 12 14.01 9 11.01" />}
                {!isActive && <line x1="12" y1="8" x2="12" y2="12" />}
                {!isActive && <line x1="12" y1="16" x2="12.01" y2="16" />}
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-0.5">
                {isActive ? "Vous êtes en ligne" : "Vous êtes hors ligne"}
              </h3>
              <p className="text-[13px] text-muted">
                {isActive 
                  ? `Zone ${availability.current_zone} · ${timeRemaining?.label || "..."}`
                  : "Activez pour recevoir des demandes directes."
                }
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {isActive ? (
              <button onClick={disableAvailability} className="btn-secondary !py-2 !text-[13px] !text-error !border-error/20 hover:!bg-error/5">Désactiver</button>
            ) : (
              <Link href="/dashboard/availability" className="btn-primary !py-2 !text-[13px]">Se rendre disponible</Link>
            )}
          </div>
        </section>

        {/* Marketing Summary & Quick QR */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 p-6 bg-foreground text-background rounded-[14px] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex-1">
              <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-50 mb-3">Statut Marketing</h4>
              <div className="flex gap-6">
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-[15px] font-mono opacity-70">privechauffeur.com/{profile?.publicSlug || profile?.public_slug || "..."}</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold">7</div>
                  <div className="text-[10px] uppercase font-bold opacity-50">Clients Fidèles</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-[10px] uppercase font-bold opacity-50">Abonnés VIP</div>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/chauffeur/' + (profile?.public_slug || 'jean-dupont'));
                    alert("Lien copié !");
                  }}
                  className="py-1.5 px-3 rounded-lg bg-white/10 text-white text-[11px] font-bold hover:bg-white/20 transition-colors"
                >
                  Copier le lien
                </button>
                <Link href="/dashboard/marketing" className="py-1.5 px-3 rounded-lg bg-accent text-background text-[11px] font-bold hover:opacity-90 transition-opacity">
                  Gérer les offres
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 bg-surface-alt border border-border rounded-[14px] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-foreground/20 transition-all" onClick={() => window.open(`/chauffeur/${profile?.public_slug || 'jean-dupont'}`, '_blank')}>
            <div className="w-20 h-20 bg-white p-2 rounded-lg shadow-sm mb-3 transition-transform group-hover:scale-105">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/chauffeur/${profile?.public_slug || 'jean-dupont'}` : '')}`} 
                alt="QR Code"
                className="w-full h-full"
              />
            </div>
            <span className="text-[13px] font-bold">Votre QR Code</span>
            <span className="text-[10px] text-muted font-medium">Cliquez pour voir votre page</span>
          </div>
        </section>

        {/* Upcoming Bookings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight">Prochaines courses</h3>
            <Link href="/dashboard/bookings" className="text-[13px] font-semibold text-muted hover:text-foreground transition-colors">Tout voir</Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="card p-12 text-center"><span className="animate-spin inline-block w-5 h-5 border-2 border-foreground border-t-transparent rounded-full" /></div>
            ) : bookings.length === 0 ? (
              <div className="card p-16 text-center border-dashed">
                <p className="text-muted text-sm">Aucune course à venir.</p>
              </div>
            ) : (
              bookings.map(b => {
                const date = new Date(b.scheduled_at || b.created_at);
                return (
                  <div key={b.id} className="card p-5 flex items-center justify-between group hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-surface-alt flex flex-col items-center justify-center border border-border">
                        <span className="text-[9px] font-bold text-muted uppercase">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
                        <span className="text-base font-bold leading-tight">{date.getDate()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[14px]">{b.client_name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            b.status === 'accepted' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
                          }`}>
                            {b.status === 'accepted' ? 'Confirmé' : 'Attente'}
                          </span>
                        </div>
                        <div className="text-[12px] text-muted font-medium">
                          <span className="text-foreground font-semibold">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          {' · '}
                          <span>{b.pickup_address.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                    {b.estimated_price && (
                      <div className="font-bold text-[15px] hidden sm:block">{b.estimated_price}€</div>
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
