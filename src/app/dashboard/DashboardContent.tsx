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
        <div className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
          isActive ? "bg-green-500/15 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "bg-surface border-surface-border text-text-muted"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" : "bg-text-muted"}`} />
          {isActive ? "En ligne" : "Hors ligne"}
        </div>
      </DashboardHeader>

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1.5 tracking-tight">
            Bonjour {firstName} 👋
          </h2>
          <p className="text-text-muted text-sm md:text-base">Voici un résumé de votre activité.</p>
        </div>

        {/* Central Availability Card */}
        <div className={`relative overflow-hidden rounded-[2rem] p-6 md:p-8 transition-all duration-500 shadow-xl ${
          isActive ? "bg-gradient-to-br from-green-950/40 to-background border-2 border-green-500/30" : "glass border-2 border-surface-border/50 hover:border-surface-border"
        }`}>
          {isActive && (
            <>
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
            </>
          )}
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                isActive ? "bg-green-500 text-foreground shadow-[0_0_20px_rgba(34,197,94,0.4)]" : "bg-surface-light text-text-muted"
              }`}>
                {isActive ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                )}
              </div>
              <div>
                <h3 className={`text-xl md:text-2xl font-bold mb-1 tracking-tight ${isActive ? "text-green-400" : "text-foreground"}`}>
                  {isActive ? "Disponible maintenant" : "Indisponible"}
                </h3>
                {isActive ? (
                  <div className="flex items-center gap-2 text-sm md:text-base text-text-secondary font-medium">
                    <span className="flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {availability.current_zone}</span>
                    <span className="text-surface-border">|</span>
                    {timeRemaining && <span className="font-bold text-primary">{timeRemaining.label} restants</span>}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-text-muted font-medium">
                    Activez votre disponibilité pour recevoir des courses immédiates.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {isActive ? (
                <>
                  <Link href="/dashboard/availability" className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface border border-surface-border text-foreground font-semibold hover:bg-surface-light active:scale-95 transition-all text-center">
                    Modifier
                  </Link>
                  <button onClick={disableAvailability} className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all text-center">
                    Désactiver
                  </button>
                </>
              ) : (
                <Link href="/dashboard/availability" className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-background font-bold hover:bg-gray-100 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] text-center">
                  Me rendre disponible
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Nouvelle dispo", href: "/dashboard/availability", icon: ClockIcon, color: "text-blue-400", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30" },
            { label: "Voir courses", href: "/dashboard/bookings", icon: CalendarIcon, color: "text-purple-400", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/30" },
            { label: "Partager lien", href: "/dashboard/profile", icon: ShareIcon, color: "text-green-400", bg: "bg-green-500/10", border: "group-hover:border-green-500/30" },
            { label: "Ajouter client", href: "/dashboard/clients", icon: UserPlusIcon, color: "text-amber-400", bg: "bg-amber-500/10", border: "group-hover:border-amber-500/30" },
          ].map((action, i) => (
            <Link key={i} href={action.href} className={`flex flex-col items-center justify-center p-5 glass rounded-[1.5rem] border border-surface-border transition-all duration-300 group ${action.border} active:scale-95`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.color} ${action.bg} group-hover:scale-110 transition-transform duration-300 mb-3`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[13px] md:text-sm font-semibold text-text-secondary group-hover:text-foreground transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard title="Demandes du jour" value={stats.today_requests} />
          <StatCard title="Courses à venir" value={stats.confirmed_bookings} />
          <StatCard title="Base clients" value={stats.private_clients} />
          <StatCard title="Revenus (Mois)" value={`${stats.estimated_revenue} €`} highlight />
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Left Column: Upcoming Bookings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">Prochaines courses</h3>
              <Link href="/dashboard/bookings" className="text-sm font-semibold text-primary hover:text-primary-light px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">Tout voir</Link>
            </div>
            
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <EmptyState icon={<CalendarIcon className="w-8 h-8"/>} title="Aucune course prévue" description="Vos prochaines réservations apparaîtront ici." />
              ) : (
                bookings.map(booking => {
                  const dt = booking.scheduled_at ? new Date(booking.scheduled_at) : new Date(booking.created_at);
                  return (
                  <div key={booking.id} className="glass rounded-[1.5rem] p-5 flex flex-col md:flex-row gap-5 justify-between border border-surface-border hover:border-surface-border/80 transition-colors">
                    <div className="flex gap-5">
                      <div className="text-center w-16 shrink-0 bg-surface-light rounded-xl py-2 flex flex-col justify-center border border-surface-border">
                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{dt.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                        <div className="text-2xl font-black text-foreground my-0.5">{dt.getDate()}</div>
                        <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{dt.toLocaleDateString('fr-FR', { month: 'short' })}</div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-foreground text-lg tracking-tight">{booking.client_name}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {booking.status === 'accepted' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                        <div className="font-mono text-primary text-sm font-bold bg-primary/10 px-2 py-0.5 rounded w-fit mb-3">
                          {dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="space-y-1.5 relative pl-3">
                          <div className="absolute top-2 bottom-2 left-[5px] w-[2px] bg-surface-border rounded-full" />
                          <div className="flex items-center gap-3 text-sm text-text-secondary relative">
                            <span className="absolute -left-[10px] w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
                            <span className="truncate max-w-[200px] md:max-w-[300px] font-medium">{booking.pickup_address}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-text-secondary relative">
                            <span className="absolute -left-[10px] w-2.5 h-2.5 rounded-full border-2 border-accent bg-background" />
                            <span className="truncate max-w-[200px] md:max-w-[300px] font-medium">{booking.destination_address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-surface-border pt-4 md:pt-0 md:pl-5 mt-2 md:mt-0 gap-4">
                      {booking.estimated_price && <div className="text-xl font-black text-foreground">{booking.estimated_price} €</div>}
                      <Link href="/dashboard/bookings" className="w-full px-5 py-2 bg-surface border border-surface-border text-text-secondary rounded-xl text-sm font-bold hover:text-foreground hover:bg-surface-light transition-colors active:scale-95 text-center">Détails</Link>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Latest Clients & Link */}
          <div className="space-y-6 md:space-y-8">
            
            {/* Private Link Block */}
            <div className="glass rounded-[1.5rem] p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/[0.05] to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ShareIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground text-lg tracking-tight">Lien de réservation</h3>
                </div>
                <p className="text-sm text-text-muted mb-5 leading-relaxed font-medium">
                  Envoyez ce lien à vos clients pour qu&apos;ils réservent directement avec vous.
                </p>
                <div className="flex bg-background rounded-xl overflow-hidden border border-surface-border mb-4 shadow-inner">
                  <div className="px-4 py-3 text-sm text-text-secondary truncate flex-1 font-mono flex items-center">
                    privechauffeur.com/{profile?.public_slug || "..."}
                  </div>
                  <button className="bg-surface hover:bg-surface-light border-l border-surface-border text-text-secondary hover:text-foreground px-4 flex items-center justify-center transition-colors active:bg-surface-border">
                    <CopyIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard/profile" className="py-2.5 text-sm font-bold text-foreground bg-surface border border-surface-border rounded-xl hover:bg-surface-light transition-colors text-center active:scale-95">
                    Gérer la page
                  </Link>
                  <button className="py-2.5 text-sm font-bold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-colors flex justify-center items-center gap-2 active:scale-95">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* Latest Clients */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-bold text-foreground tracking-tight">Derniers clients</h3>
                <Link href="/dashboard/clients" className="text-sm font-semibold text-primary hover:text-primary-light px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">Tout voir</Link>
              </div>
              <div className="glass rounded-[1.5rem] overflow-hidden border border-surface-border">
                {clients.length === 0 ? (
                   <div className="p-8 text-center text-text-muted text-sm font-medium">Aucun client pour le moment</div>
                ) : (
                  clients.slice(0, 3).map((client: any, i: number) => (
                    <div key={client.id} className={`p-4 flex items-center justify-between ${i !== 0 ? 'border-t border-surface-border' : ''} hover:bg-surface-light transition-colors`}>
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-surface-border to-surface flex items-center justify-center font-bold text-foreground shadow-inner">
                          {client.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-2 tracking-tight">
                            {client.full_name}
                            {client.tag === 'VIP' && <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">VIP</span>}
                          </div>
                          <div className="text-xs text-text-muted font-medium mt-0.5">{client.total_bookings || 0} course{(client.total_bookings || 0) > 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <button className="w-9 h-9 rounded-full bg-surface border border-surface-border flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-light transition-colors active:scale-95 shadow-sm">
                        <PhoneIcon className="w-4 h-4" />
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

// Subcomponents
function StatCard({ title, value, highlight = false }: { title: string, value: string | number, highlight?: boolean }) {
  return (
    <div className={`glass rounded-[1.5rem] p-5 md:p-6 border transition-all duration-300 hover:bg-surface-light ${highlight ? 'border-primary/30 bg-primary/[0.03] shadow-[0_0_15px_rgba(59,130,246,0.05)]' : 'border-surface-border'}`}>
      <div className="text-sm font-semibold text-text-muted mb-2 tracking-wide">{title}</div>
      <div className={`text-2xl md:text-3xl font-black tracking-tight ${highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent' : 'text-foreground'}`}>{value}</div>
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
