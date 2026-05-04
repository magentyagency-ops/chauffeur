"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockAvailability, isAvailabilityActive, getTimeRemaining, getPersistedAvailability, savePersistedAvailability } from "@/lib/mockAvailability";
import { getDriverBookings, getDashboardStats, updateBookingStatus } from "@/lib/actions/bookings";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DashboardContent({ user, profile }: { user: any; profile: any }) {
  // Use mock availability for sprint 5, real logic later
  const [availability, setAvailability] = useState(mockAvailability);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; label: string } | null>(null);
  
  // Sync on mount
  useEffect(() => {
    const saved = getPersistedAvailability();
    setAvailability(saved);
    setIsActive(isAvailabilityActive(saved));
    setTimeRemaining(getTimeRemaining(saved.available_until));
  }, []);

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

  // Real data
  const [stats, setStats] = useState({ today_requests: 0, confirmed_bookings: 0, private_clients: 0, estimated_revenue: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setDataLoading(true);
      const [statsRes, bookingsRes, clientsRes] = await Promise.all([
        getDashboardStats(),
        getDriverBookings({ status: "all", dateRange: "all" }),
        (async () => {
          const sb = createClient();
          const { data } = await sb.from("clients").select("*").order("last_booking_at", { ascending: false }).limit(5);
          return data || [];
        })()
      ]);
      if (statsRes) setStats(statsRes);
      setBookings((bookingsRes.bookings || []).filter((b: any) => b.status === "pending" || b.status === "accepted").slice(0, 3));
      setClients(clientsRes);
      setDataLoading(false);
    }
    load();
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] || "Chauffeur";

  return (
    <>
      <DashboardHeader>
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
          isActive ? "bg-green-light border-green/20 text-green" : "bg-surface border-surface-border text-text-muted"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green animate-pulse" : "bg-text-muted"}`} />
          {isActive ? "En ligne" : "Hors ligne"}
        </div>
      </DashboardHeader>

      <main className="p-6 lg:p-10 flex-1 w-full max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="display text-4xl md:text-5xl font-medium tracking-tight mb-2">
              Bonjour <span className="italic font-normal">{firstName}.</span>
            </h2>
            <p className="text-text-muted text-sm uppercase font-bold tracking-widest">
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`pill ${isActive ? "bg-green-light text-green border border-green/20" : "bg-surface-light text-text-muted border border-surface-border"} md:hidden`}>
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green animate-pulse" : "bg-text-muted"}`} />
                {isActive ? "En ligne" : "Hors ligne"}
             </div>
             <div className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-sm font-bold shadow-sm">
               {firstName.charAt(0)}
             </div>
          </div>
        </div>

        {/* Availability Banner */}
        <div className={`card p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 ${
          isActive ? "bg-green-light/30 border-green/20" : "bg-surface"
        }`}>
          <div className="text-center md:text-left">
            <h3 className="display text-2xl font-medium mb-1 tracking-tight">
              {isActive ? "Vous êtes disponible" : "Vous êtes actuellement hors ligne"}
            </h3>
            <p className="text-text-muted text-sm font-medium">
              {isActive ? `${availability.current_zone} · Encore ${timeRemaining?.label || "quelques heures"} disponibles` : "Activez votre statut pour recevoir des demandes directes."}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {isActive ? (
              <>
                <Link href="/dashboard/availability" className="btn-ghost !py-3 !px-6 flex-1 md:flex-none">
                  Modifier
                </Link>
                <button onClick={disableAvailability} className="btn-ghost !text-red-500 !bg-red-50 !border-red-100 !py-3 !px-6 flex-1 md:flex-none">
                  Désactiver
                </button>
              </>
            ) : (
              <Link href="/dashboard/availability" className="btn-black !py-3.5 !px-8 w-full md:w-auto text-center">
                Me rendre disponible
              </Link>
            )}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Demandes du jour", value: stats.today_requests },
            { label: "Courses à venir", value: stats.confirmed_bookings },
            { label: "Base clients", value: stats.private_clients },
            { label: "Revenus (Mois)", value: `${stats.estimated_revenue}€` },
          ].map((stat, i) => (
            <div key={i} className="card p-6 flex flex-col gap-1 hover:translate-y-[-2px] transition-transform cursor-default">
              <div className="display text-3xl font-medium tracking-tight text-foreground">{stat.value}</div>
              <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Recent Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="display text-2xl font-medium tracking-tight">Prochaines courses</h3>
              <Link href="/dashboard/bookings" className="text-sm font-bold text-text-muted hover:text-foreground transition-colors">Voir tout</Link>
            </div>
            
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="card p-12 text-center border-dashed">
                  <div className="w-12 h-12 rounded-full bg-surface-light border border-surface-border flex items-center justify-center mx-auto mb-4 opacity-50">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <p className="text-text-muted font-medium">Aucune course prévue pour le moment.</p>
                </div>
              ) : (
                bookings.map(booking => {
                  const dt = booking.scheduled_at ? new Date(booking.scheduled_at) : new Date(booking.created_at);
                  return (
                  <div key={booking.id} className="card p-5 flex flex-col sm:flex-row items-center gap-6 group hover:border-foreground/20 transition-all">
                    <div className="flex items-center gap-5 flex-1 w-full">
                      <div className="w-14 h-14 bg-surface-light border border-surface-border rounded-xl flex flex-col items-center justify-center text-foreground font-bold overflow-hidden">
                         <div className="text-[9px] uppercase tracking-tighter opacity-50 font-black">{dt.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                         <div className="text-xl leading-none">{dt.getDate()}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-base">{booking.client_name}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                            booking.status === 'accepted' ? 'bg-green-light text-green border border-green/20' : 'bg-amber-50 text-amber-500 border border-amber-100'
                          }`}>
                            {booking.status === 'accepted' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                        <div className="text-xs text-text-muted font-medium flex items-center gap-3">
                           <span className="text-foreground font-black">{dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                           <span className="opacity-40">/</span>
                           <span className="truncate max-w-[120px] md:max-w-none">{booking.pickup_address} → {booking.destination_address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-surface-border sm:pl-6">
                      <div className="display text-xl font-medium flex-1 text-right sm:text-left">{booking.estimated_price || 0}€</div>
                      <Link href="/dashboard/bookings" className="btn-ghost !py-2 !px-4 !text-xs !font-bold">Détails</Link>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-10">
            
            {/* Booking Link */}
            <div className="space-y-4">
              <h3 className="display text-xl font-medium tracking-tight">Partager votre page</h3>
              <div className="card p-6 bg-foreground text-background space-y-5">
                <p className="text-xs font-medium opacity-60 leading-relaxed uppercase tracking-widest">
                  Lien de réservation directe
                </p>
                <div className="flex items-center bg-white/10 rounded-lg p-3 group/link cursor-pointer hover:bg-white/15 transition-colors">
                  <div className="flex-1 text-xs font-mono truncate opacity-90">
                    privechauffeur.com/{profile?.public_slug || "..."}
                  </div>
                  <CopyIcon className="w-4 h-4 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/dashboard/profile" className="py-2.5 rounded-lg bg-background text-foreground text-xs font-bold text-center hover:opacity-90 transition-opacity">
                    Gérer la page
                  </Link>
                  <button className="py-2.5 rounded-lg bg-green text-white text-xs font-bold text-center hover:opacity-90 transition-opacity">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Clients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="display text-xl font-medium tracking-tight">Derniers clients</h3>
                <Link href="/dashboard/clients" className="text-sm font-bold text-text-muted hover:text-foreground transition-colors">Voir tout</Link>
              </div>
              <div className="card divide-y divide-surface-border overflow-hidden">
                {clients.length === 0 ? (
                  <div className="p-6 text-center text-xs text-text-muted font-medium">Aucun client répertorié.</div>
                ) : (
                  clients.slice(0, 3).map((client: any) => (
                    <div key={client.id} className="p-4 flex items-center justify-between hover:bg-surface-light transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-light border border-surface-border flex items-center justify-center font-bold text-foreground">
                          {client.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{client.full_name}</div>
                          <div className="text-[10px] text-text-muted font-bold tracking-widest uppercase">{client.total_bookings || 0} course{(client.total_bookings || 0) > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface active:scale-95">
                        <PhoneIcon className="w-3.5 h-3.5 text-text-muted" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass rounded-[1.5rem] p-10 flex flex-col items-center justify-center text-center border border-surface-border border-dashed">
      <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-5 text-text-muted shadow-inner border border-surface-border">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-text-muted text-sm font-medium">{description}</p>
    </div>
  );
}

// Icons
function ClockIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function CalendarIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function ShareIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>; }
function UserPlusIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>; }
function CopyIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>; }
function PhoneIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
