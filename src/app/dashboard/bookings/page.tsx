"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getDriverBookings, updateBookingStatus, getBookingDetail, updateInternalNote } from "@/lib/actions/bookings";

const TABS = [
  { id: "all", label: "Tout" },
  { id: "pending", label: "En cours" },
  { id: "completed", label: "Passées" },
];

export default function BookingsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
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

  async function handleAction(bookingId: string, newStatus: string, extra?: any) {
    setActionLoading(bookingId);
    const res = await updateBookingStatus({ bookingId, newStatus, ...extra });
    setActionLoading(null);
    if (res.success) {
      showToast("Mise à jour effectuée.");
      loadBookings();
      if (showDetail) setShowDetail(false);
    }
  }

  async function openDetail(bookingId: string) {
    const res = await getBookingDetail(bookingId);
    if (res.success) { setDetail(res.booking); setShowDetail(true); }
  }

  return (
    <>
      <DashboardHeader title="Réservations" />

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="px-5 py-2.5 rounded-full shadow-lg bg-foreground text-background text-[13px] font-bold">
            {toast}
          </div>
        </div>
      )}

      <main className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-8 pb-32">
        
        {/* Filter Bar */}
        <div className="flex bg-surface-alt p-1 rounded-xl border border-border w-full md:w-auto overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${filter === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center"><span className="animate-spin inline-block w-6 h-6 border-2 border-foreground border-t-transparent rounded-full" /></div>
          ) : bookings.length === 0 ? (
            <div className="card p-20 text-center border-dashed">
              <h3 className="text-lg font-bold mb-1">Aucun résultat</h3>
              <p className="text-muted text-sm">Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            bookings.map(b => (
              <BookingRow key={b.id} booking={b} onAction={handleAction} onDetail={() => openDetail(b.id)} actionLoading={actionLoading} />
            ))
          )}
        </div>
      </main>

      {showDetail && detail && (
        <DetailModal booking={detail} onClose={() => setShowDetail(false)} onAction={handleAction} actionLoading={actionLoading} />
      )}
    </>
  );
}

function BookingRow({ booking, onAction, onDetail, actionLoading }: any) {
  const date = new Date(booking.scheduled_at || booking.created_at);
  const isPending = booking.status === "pending";
  const isAccepted = booking.status === "accepted";

  return (
    <div className={`card p-5 transition-all hover:border-foreground/20 group ${isPending ? "border-accent/30 bg-accent/[0.01]" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-5 flex-1">
          <div className="w-12 h-12 rounded-xl bg-surface-alt border border-border flex flex-col items-center justify-center shrink-0 group-hover:bg-background transition-colors">
            <span className="text-[10px] font-bold text-muted uppercase">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
            <span className="text-lg font-bold leading-tight">{date.getDate()}</span>
          </div>
          <div className="min-w-0 flex-1">
             <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-[16px] truncate">{booking.client_name}</span>
                <StatusBadge status={booking.status} />
             </div>
             <div className="text-[13px] text-muted font-medium flex items-center gap-2">
                <span className="text-foreground font-semibold">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>·</span>
                <span className="truncate">{booking.pickup_address.split(',')[0]} → {booking.destination_address.split(',')[0]}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-[17px]">{booking.estimated_price}€</div>
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider">{booking.booking_type === 'now' ? '⚡ Immédiat' : '📅 Réservé'}</div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isPending && (
              <>
                <button onClick={() => onAction(booking.id, "accepted")} className="btn-primary !py-2 !px-4 !text-[12px] bg-success hover:bg-success/90 border-success">Accepter</button>
                <button onClick={() => onAction(booking.id, "refused")} className="btn-secondary !py-2 !px-4 !text-[12px] !text-error !border-error/20 hover:!bg-error/5">Refuser</button>
              </>
            )}
            {!isPending && (
               <button onClick={onDetail} className="btn-secondary !py-2 !px-4 !text-[12px] w-full sm:w-auto">Détails</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-accent/10 text-accent border-accent/20",
    accepted: "bg-success/10 text-success border-success/20",
    completed: "bg-surface-alt text-muted border-border",
    cancelled: "bg-error/5 text-error/60 border-error/10",
    refused: "bg-error/5 text-error/60 border-error/10",
  };
  const labels: any = { pending: "Attente", accepted: "Confirmé", completed: "Terminé", cancelled: "Annulé", refused: "Refusé" };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight border ${styles[status] || styles.completed}`}>
      {labels[status] || status}
    </span>
  );
}

function DetailModal({ booking, onClose, onAction, actionLoading }: any) {
  const date = new Date(booking.scheduled_at || booking.created_at);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="card p-8 max-w-lg w-full relative z-10 shadow-2xl animate-scale-in space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-1">{booking.client_name}</h3>
            <p className="text-muted text-sm">{date.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-foreground">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="card p-4 bg-surface-alt">
              <div className="text-[10px] font-bold text-muted uppercase mb-1">Téléphone</div>
              <div className="text-sm font-bold">{booking.client_phone}</div>
           </div>
           <div className="card p-4 bg-surface-alt">
              <div className="text-[10px] font-bold text-muted uppercase mb-1">Prix Estimé</div>
              <div className="text-sm font-bold">{booking.estimated_price}€</div>
           </div>
        </div>

        <div className="space-y-4">
           <div className="flex gap-4">
              <div className="w-1.5 bg-border rounded-full flex flex-col justify-between py-1 items-center">
                 <div className="w-3 h-3 rounded-full bg-foreground border-4 border-background -mx-1" />
                 <div className="w-3 h-3 rounded-full bg-accent border-4 border-background -mx-1" />
              </div>
              <div className="space-y-6 py-0.5">
                 <div><div className="text-[10px] font-bold text-muted uppercase">Départ</div><div className="text-[14px] font-medium leading-snug">{booking.pickup_address}</div></div>
                 <div><div className="text-[10px] font-bold text-muted uppercase">Arrivée</div><div className="text-[14px] font-medium leading-snug">{booking.destination_address}</div></div>
              </div>
           </div>
        </div>

        {booking.notes && (
           <div className="p-4 bg-surface-alt rounded-xl border border-border">
              <div className="text-[10px] font-bold text-muted uppercase mb-1">Note client</div>
              <p className="text-[13px] text-foreground italic">"{booking.notes}"</p>
           </div>
        )}

        <div className="flex gap-3 pt-4">
           {booking.status === 'accepted' && (
              <button onClick={() => onAction(booking.id, "completed")} className="btn-primary flex-1">Marquer terminée</button>
           )}
           <a href={`tel:${booking.client_phone}`} className="btn-secondary flex-1 flex items-center justify-center gap-2">Appeler</a>
        </div>
      </div>
    </div>
  );
}
