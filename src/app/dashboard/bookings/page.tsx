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
        <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] w-full md:w-auto overflow-x-auto mx-auto sm:mx-0">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setFilter(tab.id)} className={`px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap ${filter === tab.id ? "bg-black text-white shadow-md" : "text-gray-400 hover:text-black hover:bg-gray-50"}`}>
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
    <div className={`bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-6 transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 group ${isPending ? "ring-2 ring-orange-500/20" : ""}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner flex flex-col items-center justify-center shrink-0 group-hover:bg-white transition-colors">
            <span className="text-[10px] font-[800] text-gray-400 uppercase tracking-wider">{date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
            <span className="text-xl font-[800] text-black leading-tight">{date.getDate()}</span>
          </div>
          <div className="min-w-0 flex-1">
             <div className="flex items-center gap-3 mb-1">
                <span className="font-[800] text-[16px] text-black truncate">{booking.client_name}</span>
                <StatusBadge status={booking.status} />
             </div>
             <div className="text-[13px] text-gray-400 font-medium flex items-center gap-1.5">
                <span className="text-black font-[800]">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-gray-300">•</span>
                <span className="truncate">{booking.pickup_address.split(',')[0]} → {booking.destination_address.split(',')[0]}</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 border-t border-gray-100 md:border-t-0 pt-5 md:pt-0">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-[800] text-gray-400 uppercase tracking-wider block">{booking.booking_type === 'now' ? '⚡ Immédiat' : '📅 Réservé'}</div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isPending && (
              <>
                <button onClick={() => onAction(booking.id, "accepted")} className="bg-[#34D399] text-black hover:shadow-[0_4px_12px_rgba(52,211,153,0.3)] rounded-full transition-all font-bold px-5 py-3 text-[13px] w-full sm:w-auto">Accepter</button>
                <button onClick={() => onAction(booking.id, "refused")} className="bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-all font-bold px-5 py-3 text-[13px] w-full sm:w-auto">Refuser</button>
              </>
            )}
            {!isPending && (
               <button onClick={onDetail} className="bg-black shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 rounded-full transition-all font-[900] px-8 py-3 text-[16px] text-white w-full sm:w-auto uppercase tracking-wider">GO</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-orange-500/10 text-orange-600",
    accepted: "bg-[#34D399]/10 text-[#059669]",
    completed: "bg-gray-100 text-gray-500",
    cancelled: "bg-red-500/10 text-red-600",
    refused: "bg-red-500/10 text-red-600",
  };
  const labels: any = { pending: "Attente", accepted: "Confirmé", completed: "Terminé", cancelled: "Annulé", refused: "Refusé" };
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full font-[800] uppercase tracking-wider ${styles[status] || styles.completed}`}>
      {labels[status] || status}
    </span>
  );
}

function DetailModal({ booking, onClose, onAction, actionLoading }: any) {
  const date = new Date(booking.scheduled_at || booking.created_at);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full relative z-10 shadow-2xl animate-scale-in space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-[800] tracking-tight mb-1 text-black font-display">{booking.client_name}</h3>
            <p className="text-gray-500 text-sm font-medium">{date.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-all">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>



        <div className="space-y-4 bg-gray-50 rounded-2xl p-5 border border-gray-100">
           <div className="flex gap-5">
              <div className="w-1.5 bg-gray-200 rounded-full flex flex-col justify-between py-1.5 items-center">
                 <div className="w-3 h-3 rounded-full bg-black border-2 border-white -mx-1" />
                 <div className="w-3 h-3 rounded-full bg-[#34D399] border-2 border-white -mx-1" />
              </div>
              <div className="space-y-6 py-1">
                 <div><div className="text-[11px] font-[800] text-gray-400 uppercase tracking-wider mb-1">Départ</div><div className="text-[15px] font-[800] text-black leading-snug">{booking.pickup_address}</div></div>
                 <div><div className="text-[11px] font-[800] text-gray-400 uppercase tracking-wider mb-1">Arrivée</div><div className="text-[15px] font-[800] text-black leading-snug">{booking.destination_address}</div></div>
              </div>
           </div>
        </div>

        {booking.notes && (
           <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
              <div className="text-[11px] font-[800] text-orange-500 uppercase tracking-wider mb-1">Note client</div>
              <p className="text-[14px] text-orange-900 font-medium italic">"{booking.notes}"</p>
           </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
           <a 
             href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.destination_address)}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-black text-white hover:shadow-lg rounded-full transition-all font-[900] px-6 py-4 w-full text-center tracking-wider text-[15px] flex items-center justify-center gap-2"
           >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
             OUVRIR LE GPS
           </a>
           {booking.status === 'accepted' && (
              <button onClick={() => onAction(booking.id, "completed")} className="bg-white border border-gray-200 text-black hover:shadow-md hover:bg-gray-50 rounded-full transition-all font-bold px-6 py-4 w-full text-[14px]">Terminer la course</button>
           )}
        </div>
      </div>
    </div>
  );
}
