"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GlobalBookingListener({ driverId }: { driverId: string }) {
  const [incomingBooking, setIncomingBooking] = useState<any | null>(null);
  const [cancelledNotification, setCancelledNotification] = useState<any | null>(null);
  const [processingAction, setProcessingAction] = useState(false);
  const router = useRouter();

  // Listen for incoming bookings globally (Robust Polling)
  useEffect(() => {
    if (!driverId) return;
    const supabase = createClient();

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("driver_id", driverId)
          .eq("status", "pending")
          .neq("status", `dummy-${Date.now()}`) // Cache-buster
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setIncomingBooking((current: any) => {
            if (current && current.id === data[0].id) return current;
            return data[0];
          });
        } else {
          // If the current incoming booking was cancelled, it will no longer be pending.
          // But we also want to poll for cancellation notifications explicitly:
        }

        const { data: cancelledData, error: cancelledError } = await supabase
          .from("notifications")
          .select("*")
          .eq("driver_id", driverId)
          .eq("type", "booking_cancelled")
          .eq("read", false)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!cancelledError && cancelledData && cancelledData.length > 0) {
          setCancelledNotification(cancelledData[0]);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [driverId]);

  const [showEtaSelection, setShowEtaSelection] = useState(false);

  async function handleAcceptBooking(etaMinutes?: number) {
    if (!incomingBooking) return;
    setProcessingAction(true);
    const res = await updateBookingStatus({
      bookingId: incomingBooking.id,
      newStatus: "accepted",
      etaMinutes: etaMinutes
    });
    setProcessingAction(false);
    if (res.success && res.booking) {
      setIncomingBooking(null);
      setShowEtaSelection(false);
      router.refresh(); // Refresh current page to update lists instantly
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
      setShowEtaSelection(false);
      router.refresh();
    } else {
      alert("Erreur lors du refus de la course.");
    }
  }

  async function handleDismissCancelled() {
    if (!cancelledNotification) return;
    setProcessingAction(true);
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", cancelledNotification.id);
    
    setProcessingAction(false);
    setCancelledNotification(null);
    router.refresh();
  }

  return (
    <AnimatePresence>
      {incomingBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
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
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-[900] tracking-tight font-display text-white">Nouvelle Demande</h2>
                <p className="text-white mt-2 font-bold text-lg uppercase tracking-widest">{incomingBooking.booking_type === "now" ? "Départ Immédiat" : "Réservation Programmée"}</p>
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
                <div className="relative pl-6 border-l-2 border-gray-400">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gray-400" />
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
                {!showEtaSelection ? (
                  <>
                    <button
                      onClick={handleRefuseBooking}
                      disabled={processingAction}
                      className="flex-1 py-4 rounded-xl font-bold text-gray-500 bg-white border-2 border-gray-200 hover:bg-gray-100 hover:text-black hover:border-gray-300 transition-all active:scale-[0.98]"
                    >
                      {processingAction ? "..." : "Refuser"}
                    </button>
                    <button
                      onClick={() => setShowEtaSelection(true)}
                      disabled={processingAction}
                      className="flex-1 py-4 rounded-xl font-[900] text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
                    >
                      Accepter
                    </button>
                  </>
                ) : (
                  <div className="w-full space-y-4 animate-fade-in">
                    <p className="text-center font-[800] text-black">Temps d'arrivée estimé :</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleAcceptBooking(0)} disabled={processingAction} className="py-3 rounded-xl font-[800] text-black bg-white border-2 border-gray-200 hover:border-black transition-all">Maintenant</button>
                      <button onClick={() => handleAcceptBooking(10)} disabled={processingAction} className="py-3 rounded-xl font-[800] text-black bg-white border-2 border-gray-200 hover:border-black transition-all">10 min</button>
                      <button onClick={() => handleAcceptBooking(15)} disabled={processingAction} className="py-3 rounded-xl font-[800] text-black bg-white border-2 border-gray-200 hover:border-black transition-all">15 min</button>
                      <button onClick={() => handleAcceptBooking(20)} disabled={processingAction} className="py-3 rounded-xl font-[800] text-black bg-white border-2 border-gray-200 hover:border-black transition-all">20 min</button>
                      <button onClick={() => handleAcceptBooking(30)} disabled={processingAction} className="py-3 rounded-xl font-[800] text-black bg-white border-2 border-gray-200 hover:border-black transition-all">30 min</button>
                      <button onClick={() => setShowEtaSelection(false)} disabled={processingAction} className="py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Popup for Cancelled Booking */}
      {cancelledNotification && !incomingBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="bg-red-600 text-white p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-red-800 via-red-600/80 to-transparent z-10" />
              <div className="relative z-20">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <h2 className="text-3xl font-[900] tracking-tight font-display text-white">Course Annulée</h2>
              </div>
            </div>
            <div className="p-8 space-y-6 bg-gray-50 text-center">
              <p className="font-bold text-xl text-black">{cancelledNotification.message}</p>
              
              <div className="pt-4">
                <button
                  onClick={handleDismissCancelled}
                  disabled={processingAction}
                  className="w-full py-4 rounded-xl font-[900] text-white bg-black hover:bg-gray-800 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
                >
                  {processingAction ? "..." : "Compris"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
