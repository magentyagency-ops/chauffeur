"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getDriverBookings, updateBookingStatus, getBookingDetail, updateInternalNote } from "@/lib/actions/bookings";

type Tab = { id: string; label: string };

const TABS: Tab[] = [
  { id: "all", label: "Toutes" },
  { id: "pending", label: "En attente" },
  { id: "accepted", label: "Acceptées" },
  { id: "completed", label: "Terminées" },
  { id: "refused", label: "Refusées" },
  { id: "cancelled", label: "Annulées" },
];

export default function BookingsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [detailEvents, setDetailEvents] = useState<any[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const loadBookings = useCallback(async () => {
    setLoading(true);
    const res = await getDriverBookings({ status: filter, search });
    setBookings(res.bookings || []);
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function handleAction(bookingId: string, newStatus: string, extra?: { estimatedPrice?: number; finalPrice?: number; reason?: string }) {
    setActionLoading(bookingId);
    const res = await updateBookingStatus({ bookingId, newStatus, ...extra });
    setActionLoading(null);
    if (res.success) {
      const labels: Record<string, string> = { accepted: "Réservation acceptée.", refused: "Réservation refusée.", completed: "Course terminée.", cancelled: "Réservation annulée." };
      showToast(labels[newStatus] || "Mise à jour effectuée.");
      loadBookings();
      if (showDetail && detail?.id === bookingId) openDetail(bookingId);
    }
  }

  async function openDetail(bookingId: string) {
    const res = await getBookingDetail(bookingId);
    if (res.success) { setDetail(res.booking); setDetailEvents(res.events || []); setShowDetail(true); }
  }

  function getCounts(status: string) {
    if (status === "all") return bookings.length;
    // We only have current filter loaded; show nothing for other tabs
    return undefined;
  }

  return (
    <>
      <DashboardHeader title="Réservations" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="px-5 py-3 rounded-full shadow-xl bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-md text-sm font-bold flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            {toast}
          </div>
        </div>
      )}

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-5xl mx-auto space-y-6 md:space-y-8 pb-32">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-2 rounded-[1.5rem] border border-surface-border">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full md:w-auto p-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${filter === tab.id ? "bg-primary text-foreground shadow-md" : "text-text-muted hover:text-foreground hover:bg-surface-light"}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80 shrink-0 p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher (nom, lieu)..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-sm font-medium text-foreground placeholder:text-text-muted/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="w-8 h-8 rounded-full border-[3px] border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass rounded-[2rem] p-12 md:p-20 flex flex-col items-center justify-center text-center border border-dashed border-surface-border">
              <div className="w-20 h-20 rounded-[1.5rem] bg-surface flex items-center justify-center mb-6 text-text-muted shadow-inner border border-surface-border">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-2 tracking-tight">Aucune réservation</h3>
              <p className="text-text-muted text-base font-medium max-w-sm mb-8">
                {filter === "all" ? "Vous n'avez pas encore reçu de réservation. Partagez votre lien public pour commencer." : "Aucune réservation avec ce statut."}
              </p>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="px-6 py-3 bg-surface-light border border-surface-border rounded-xl text-sm font-bold text-foreground hover:bg-surface transition-colors">Voir toutes</button>
              )}
            </div>
          ) : (
            bookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} onAction={handleAction} onDetail={() => openDetail(booking.id)} actionLoading={actionLoading} />
            ))
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {showDetail && detail && (
        <BookingDetailModal booking={detail} events={detailEvents} onClose={() => setShowDetail(false)} onAction={handleAction} actionLoading={actionLoading} showToast={showToast} />
      )}
    </>
  );
}

// ─── BookingCard ────────────────────────────────────────────────────────
function BookingCard({ booking, onAction, onDetail, actionLoading }: { booking: any; onAction: (id: string, status: string) => void; onDetail: () => void; actionLoading: string | null }) {
  const isPending = booking.status === "pending";
  const isAccepted = booking.status === "accepted";
  const isLoading = actionLoading === booking.id;
  const dt = booking.scheduled_at ? new Date(booking.scheduled_at) : new Date(booking.created_at);

  return (
    <div className={`glass rounded-[1.5rem] p-5 md:p-6 transition-all duration-300 border-2 ${isPending ? "border-amber-500/30 bg-amber-500/[0.02]" : isAccepted ? "border-green-500/30 bg-green-500/[0.02]" : "border-surface-border"}`}>
      <div className="flex flex-col md:flex-row gap-5 md:gap-6">
        {/* Date */}
        <div className="flex md:flex-col items-center md:items-start gap-4 md:w-28 shrink-0 md:border-r border-surface-border pr-4">
          <div className="text-center w-16 shrink-0 bg-background/50 rounded-xl py-2 border border-surface-border">
            <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{dt.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
            <div className="text-2xl font-black text-foreground my-0.5">{dt.getDate()}</div>
            <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{dt.toLocaleDateString("fr-FR", { month: "short" })}</div>
          </div>
          <div className="font-mono text-primary text-base font-black bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 w-full text-center">
            {dt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="md:hidden ml-auto"><StatusBadge status={booking.status} type={booking.booking_type} /></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-xl md:text-2xl font-black text-foreground tracking-tight mb-1">{booking.client_name}</h4>
              <div className="text-sm font-medium text-text-muted flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {booking.client_phone}
              </div>
            </div>
            <div className="hidden md:block"><StatusBadge status={booking.status} type={booking.booking_type} /></div>
          </div>

          <div className="space-y-4 relative pl-3 bg-surface/30 p-4 rounded-xl border border-surface-border">
            <div className="absolute top-6 bottom-6 left-[19px] w-[2px] bg-surface-border rounded-full" />
            <div className="flex items-start gap-4 relative">
              <span className="w-3.5 h-3.5 rounded-full border-4 border-primary bg-background shrink-0 mt-1 relative z-10" />
              <div><div className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-wider">Départ</div><div className="text-sm md:text-base font-semibold text-foreground leading-snug">{booking.pickup_address}</div></div>
            </div>
            <div className="flex items-start gap-4 relative">
              <span className="w-3.5 h-3.5 rounded-full border-4 border-accent bg-background shrink-0 mt-1 relative z-10" />
              <div><div className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-wider">Arrivée</div><div className="text-sm md:text-base font-semibold text-foreground leading-snug">{booking.destination_address}</div></div>
            </div>
          </div>
          {booking.notes && <p className="text-xs text-text-muted font-medium mt-3 italic">"{booking.notes}"</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center md:w-36 shrink-0 md:border-l border-surface-border md:pl-6 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 gap-3">
          {booking.estimated_price && <div className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{booking.estimated_price} €</div>}
          <div className="flex flex-row md:flex-col gap-2.5 w-full">
            {isPending && !isLoading && (
              <>
                <button onClick={() => onAction(booking.id, "accepted")} className="flex-1 md:w-full py-2.5 md:py-3 bg-green-500/10 text-green-400 rounded-xl text-sm font-bold hover:bg-green-500/20 border border-green-500/20 transition-all active:scale-95 shadow-sm">Accepter</button>
                <button onClick={() => onAction(booking.id, "refused")} className="flex-1 md:w-full py-2.5 md:py-3 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/20 border border-red-500/20 transition-all active:scale-95 shadow-sm">Refuser</button>
              </>
            )}
            {isAccepted && !isLoading && (
              <>
                <button onClick={() => onAction(booking.id, "completed")} className="flex-1 md:w-full py-2.5 md:py-3 bg-green-500/10 text-green-400 rounded-xl text-sm font-bold hover:bg-green-500/20 border border-green-500/20 transition-all active:scale-95 shadow-sm">Terminée</button>
                <button onClick={() => onAction(booking.id, "cancelled")} className="flex-1 md:w-full py-2.5 md:py-3 bg-surface border border-surface-border text-text-muted rounded-xl text-sm font-bold hover:bg-surface-light transition-all active:scale-95">Annuler</button>
              </>
            )}
            {isLoading && <span className="w-6 h-6 rounded-full border-[3px] border-primary/30 border-t-primary animate-spin mx-auto" />}
            <button onClick={onDetail} className="flex-1 md:w-full py-2.5 md:py-3 bg-surface-light border border-surface-border text-text-secondary rounded-xl text-sm font-bold hover:text-foreground hover:bg-surface transition-all active:scale-95">Détails</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── StatusBadge ────────────────────────────────────────────────────────
function StatusBadge({ status, type }: { status: string; type?: string }) {
  const base = "px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-sm border inline-flex items-center gap-1.5";
  const typeLabel = type === "now" ? "⚡" : "";
  if (status === "pending") return <span className={`${base} bg-amber-500/10 border-amber-500/20 text-amber-500`}>{typeLabel} En attente</span>;
  if (status === "accepted") return <span className={`${base} bg-green-500/10 border-green-500/20 text-green-400`}>{typeLabel} Acceptée</span>;
  if (status === "completed") return <span className={`${base} bg-surface border-surface-border text-text-secondary`}>Terminée</span>;
  if (status === "refused") return <span className={`${base} bg-red-500/10 border-red-500/20 text-red-400`}>Refusée</span>;
  if (status === "cancelled") return <span className={`${base} bg-surface-light border-surface-border text-text-muted`}>Annulée</span>;
  return <span className={`${base} bg-surface-light border-surface-border text-text-muted`}>{status}</span>;
}

// ─── BookingDetailModal ─────────────────────────────────────────────────
function BookingDetailModal({ booking, events, onClose, onAction, actionLoading, showToast }: any) {
  const [note, setNote] = useState(booking.internal_driver_note || "");
  const [savingNote, setSavingNote] = useState(false);
  const dt = booking.scheduled_at ? new Date(booking.scheduled_at) : new Date(booking.created_at);

  async function saveNote() {
    setSavingNote(true);
    await updateInternalNote(booking.id, note);
    setSavingNote(false);
    showToast("Note sauvegardée.");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="glass rounded-t-[2rem] md:rounded-[2rem] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 border border-surface-border shadow-2xl animate-scale-in space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-foreground tracking-tight">{booking.client_name}</h3>
            <p className="text-sm text-text-muted font-medium">{dt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {dt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-foreground transition-all active:scale-95">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <StatusBadge status={booking.status} type={booking.booking_type} />

        {/* Client */}
        <div className="bg-surface/50 rounded-xl p-4 border border-surface-border space-y-2">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Client</div>
          <div className="text-foreground font-bold">{booking.client_name}</div>
          <div className="text-text-secondary text-sm flex items-center gap-2">📞 {booking.client_phone}</div>
          {booking.client_email && <div className="text-text-secondary text-sm flex items-center gap-2">📧 {booking.client_email}</div>}
          {booking.clients?.tag && <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 inline-block">{booking.clients.tag}</span>}
        </div>

        {/* Route */}
        <div className="bg-surface/50 rounded-xl p-4 border border-surface-border space-y-3">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Trajet</div>
          <div className="flex items-start gap-3"><span className="w-3 h-3 rounded-full border-4 border-primary bg-background mt-1 shrink-0" /><div className="text-foreground font-medium text-sm">{booking.pickup_address}</div></div>
          <div className="flex items-start gap-3"><span className="w-3 h-3 rounded-full border-4 border-accent bg-background mt-1 shrink-0" /><div className="text-foreground font-medium text-sm">{booking.destination_address}</div></div>
          {booking.notes && <div className="text-text-muted text-xs italic pt-2 border-t border-surface-border">Note client: "{booking.notes}"</div>}
        </div>

        {/* Pricing */}
        {(booking.estimated_price || booking.final_price) && (
          <div className="flex gap-4">
            {booking.estimated_price && <div className="flex-1 bg-surface/50 rounded-xl p-4 border border-surface-border"><div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Estimation</div><div className="text-xl font-black text-foreground">{booking.estimated_price} €</div></div>}
            {booking.final_price && <div className="flex-1 bg-surface/50 rounded-xl p-4 border border-surface-border"><div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Prix final</div><div className="text-xl font-black text-primary">{booking.final_price} €</div></div>}
          </div>
        )}

        {/* Internal Note */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Note interne (invisible du client)</div>
          <textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Votre note privée..." className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-foreground text-sm font-medium outline-none focus:border-primary/50 transition-all resize-none" />
          <button onClick={saveNote} disabled={savingNote} className="px-4 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold text-text-secondary hover:text-foreground hover:bg-surface-light transition-all active:scale-95">
            {savingNote ? "..." : "Sauvegarder la note"}
          </button>
        </div>

        {/* Timeline */}
        {events.length > 0 && (
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Historique</div>
            <div className="space-y-2">
              {events.map((ev: any) => (
                <div key={ev.id} className="flex items-start gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <span className="text-foreground font-medium">{ev.message || ev.event_type}</span>
                    <span className="text-text-muted text-xs ml-2">{new Date(ev.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {(booking.status === "pending" || booking.status === "accepted") && (
          <div className="flex gap-3 pt-4 border-t border-surface-border">
            {booking.status === "pending" && (
              <>
                <button onClick={() => onAction(booking.id, "accepted")} disabled={actionLoading === booking.id} className="flex-1 py-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold text-sm hover:bg-green-500/20 active:scale-95 transition-all">Accepter</button>
                <button onClick={() => onAction(booking.id, "refused")} disabled={actionLoading === booking.id} className="flex-1 py-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500/20 active:scale-95 transition-all">Refuser</button>
              </>
            )}
            {booking.status === "accepted" && (
              <>
                <button onClick={() => onAction(booking.id, "completed")} disabled={actionLoading === booking.id} className="flex-1 py-3.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold text-sm hover:bg-green-500/20 active:scale-95 transition-all">Terminée</button>
                <button onClick={() => onAction(booking.id, "cancelled")} disabled={actionLoading === booking.id} className="flex-1 py-3.5 bg-surface border border-surface-border text-text-muted rounded-xl font-bold text-sm hover:bg-surface-light active:scale-95 transition-all">Annuler</button>
              </>
            )}
            <a href={`tel:${booking.client_phone}`} className="w-12 h-12 shrink-0 bg-surface border border-surface-border rounded-xl flex items-center justify-center text-text-muted hover:text-foreground transition-all active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
