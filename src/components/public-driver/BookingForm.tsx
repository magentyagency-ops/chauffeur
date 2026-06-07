"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive, getPersistedAvailability } from "@/lib/mockAvailability";
import { getMarketingState, PromoCode } from "@/lib/mockMarketing";
import { createBooking, getBookingStatus, type CreateBookingInput } from "@/lib/actions/bookings";

type BookingData = {
  pickup: string;
  dropoff: string;
  timing: "now" | "later";
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
};

type BookingFormProps = {
  availability?: any;
  driverSlug?: string;
};

export default function BookingForm({ availability: initialAvailability, driverSlug }: BookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [availability, setAvailability] = useState(initialAvailability);
  const [data, setData] = useState<BookingData>({
    pickup: "", dropoff: "",
    timing: initialAvailability && isAvailabilityActive(initialAvailability) ? "now" : "later",
    date: "", time: "", name: "", phone: "", email: "", comment: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [trackingStep, setTrackingStep] = useState(1); // 1: Envoyé, 2: Confirmé, 3: En route
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [driverEta, setDriverEta] = useState<number | null>(null);
  const [serverError, setServerError] = useState<{ message: string; code?: string } | null>(null);
  
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const totalSteps = 3;

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  useEffect(() => {
    const saved = getPersistedAvailability();
    setAvailability(saved);
    setData(prev => ({ ...prev, timing: isAvailabilityActive(saved) ? "now" : "later" }));
  }, []);

  // Real-time polling progression
  useEffect(() => {
    if (!sent || !bookingId) return;

    const interval = setInterval(async () => {
      const statusRes = await getBookingStatus(bookingId);
      if (statusRes && statusRes.status === "accepted") {
        setTrackingStep(2); // Confirmed
        if (statusRes.eta !== null && statusRes.eta !== undefined) {
           setDriverEta(statusRes.eta);
           setTimeout(() => setTrackingStep(3), 1000); // Small delay before moving to step 3
        }
        clearInterval(interval);
      } else if (statusRes && statusRes.status === "refused") {
        setServerError({ message: "Le chauffeur n'est malheureusement pas disponible pour cette course." });
        setSent(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sent, bookingId]);

  if (!isOpen) return null;

  const handleApplyPromo = () => {
    if (!promoCodeInput.trim()) return;
    const state = getMarketingState();
    const promo = state.promos.find(p => p.code === promoCodeInput.trim().toUpperCase() && p.isActive);
    if (promo) {
      setAppliedPromo(promo);
      setPromoError(null);
      setPromoCodeInput("");
    } else {
      setPromoError("Code invalide ou expiré");
    }
  };

  function update(field: keyof BookingData, value: string) {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    if (serverError) setServerError(null);
  }

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!data.pickup.trim()) errs.pickup = "Requis";
      if (!data.dropoff.trim()) errs.dropoff = "Requis";
    }
    if (s === 2) {
      if (data.timing === "later") {
        if (!data.date) errs.date = "Requis";
        if (!data.time) errs.time = "Requis";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() { if (validateStep(step)) setStep(step + 1); }
  function back() { if (step > 1) setStep(step - 1); }

  async function submit() {
    if (!data.name.trim() || !data.phone.trim()) {
      setErrors({ name: !data.name.trim() ? "Requis" : "", phone: !data.phone.trim() ? "Requis" : "" });
      return;
    }
    setSending(true);
    const scheduledAt = data.timing === "later" && data.date && data.time
      ? new Date(`${data.date}T${data.time}`).toISOString()
      : undefined;

    const input: CreateBookingInput = {
      driverSlug: driverSlug || "jean-dupont",
      clientName: data.name.trim(),
      clientPhone: data.phone.trim(),
      clientEmail: data.email.trim() || undefined,
      pickupAddress: data.pickup.trim(),
      destinationAddress: data.dropoff.trim(),
      bookingType: data.timing,
      scheduledAt,
      notes: (data.comment.trim() + (appliedPromo ? `\n[Code promo appliqué : ${appliedPromo.code} (-${appliedPromo.discountValue}${appliedPromo.discountType === 'percent' ? '%' : '€'})]` : "")).trim() || undefined,
    };

    const result = await createBooking(input);
    setSending(false);
    if (result.success && result.booking) {
      setSent(true);
      setTrackingStep(1);
      setBookingId(result.booking.id);
    }
    else setServerError({ message: result.error || "Erreur." });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={!sent ? () => setIsOpen(false) : undefined} />
      
      <div className="card w-full sm:max-w-md relative z-10 shadow-2xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-up sm:animate-scale-in">
        
        {/* Header */}
        {!sent && (
          <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Réserver une course</h3>
              <p className="text-[12px] text-muted font-medium">Réponse immédiate du chauffeur.</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-alt hover:bg-border text-muted transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}

        {/* Tracking Screen */}
        {sent ? (
          <div className="p-6 md:p-8 flex flex-col items-center overflow-y-auto">
            <h3 className="text-xl font-bold mb-8">Suivi de votre course</h3>
            
            <div className="w-full space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border mb-10">
              
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${trackingStep >= 1 ? 'bg-foreground text-background' : 'bg-surface-alt text-muted'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card p-4 ml-4 md:ml-0">
                  <h4 className={`font-bold text-[14px] ${trackingStep >= 1 ? 'text-foreground' : 'text-muted'}`}>Demande envoyée</h4>
                  <p className="text-[12px] text-muted">En attente de confirmation...</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-500 ${trackingStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${trackingStep >= 2 ? 'bg-success text-background' : 'bg-surface-alt text-muted'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card p-4 ml-4 md:ml-0">
                  <h4 className={`font-bold text-[14px] ${trackingStep >= 2 ? 'text-success' : 'text-muted'}`}>Course confirmée</h4>
                  <p className="text-[12px] text-muted">Le chauffeur a accepté.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-500 ${trackingStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${trackingStep >= 3 ? 'bg-accent text-background' : 'bg-surface-alt text-muted'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] card p-4 ml-4 md:ml-0 border-accent/30 bg-accent/[0.02]">
                  <h4 className={`font-bold text-[14px] ${trackingStep >= 3 ? 'text-accent' : 'text-muted'}`}>Chauffeur en route</h4>
                  <p className="text-[12px] text-muted">Arrivée estimée : {driverEta !== null ? (driverEta === 0 ? "Imminente" : `${driverEta} min`) : "Calcul en cours..."}</p>
                </div>
              </div>
            </div>

            <div className="w-full card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold">J</div>
                <div>
                  <div className="font-bold text-[14px]">Jean Dupont</div>
                  <div className="text-[12px] text-muted">Mercedes Classe E · Noir</div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </button>
            </div>
            
            <button onClick={() => { setSent(false); setIsOpen(false); setBookingId(null); setTrackingStep(1); }} className="btn-secondary w-full mt-6">Fermer</button>
          </div>
        ) : (
          <>
            {/* Form Steps */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {step === 1 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="space-y-2">
                    <label className="label">Lieu de départ</label>
                    <input type="text" value={data.pickup} onChange={e => update("pickup", e.target.value)} placeholder="Ex: Paris 8, Gare du Nord..." className="input !py-3" autoFocus />
                    {errors.pickup && <p className="text-error text-[11px] font-bold">{errors.pickup}</p>}
                  </div>
                  <div className="relative flex items-center justify-center h-4">
                    <div className="absolute w-px h-full bg-border" />
                    <div className="relative z-10 w-6 h-6 rounded-full bg-surface border border-border flex items-center justify-center text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="label">Destination</label>
                    <input type="text" value={data.dropoff} onChange={e => update("dropoff", e.target.value)} placeholder="Ex: Aéroport CDG, Rouen..." className="input !py-3" />
                    {errors.dropoff && <p className="text-error text-[11px] font-bold">{errors.dropoff}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => update("timing", "now")} className={`py-3.5 rounded-xl text-[14px] font-bold border transition-all ${data.timing === "now" ? "bg-foreground text-background border-foreground shadow-md" : "bg-surface-alt border-border text-muted hover:border-muted"}`}>
                      Maintenant
                    </button>
                    <button onClick={() => update("timing", "later")} className={`py-3.5 rounded-xl text-[14px] font-bold border transition-all ${data.timing === "later" ? "bg-foreground text-background border-foreground shadow-md" : "bg-surface-alt border-border text-muted hover:border-muted"}`}>
                      Plus tard
                    </button>
                  </div>
                  {data.timing === "later" && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-surface-alt rounded-xl border border-border">
                      <div className="space-y-2">
                        <label className="label">Date</label>
                        <input type="date" value={data.date} onChange={e => update("date", e.target.value)} className="input !py-2.5 !text-[13px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="label">Heure</label>
                        <input type="time" value={data.time} onChange={e => update("time", e.target.value)} className="input !py-2.5 !text-[13px]" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-fade-in-up">
                  <div className="space-y-2">
                    <label className="label">Votre nom</label>
                    <input type="text" value={data.name} onChange={e => update("name", e.target.value)} placeholder="Ex: Jean Martin" className="input" autoFocus />
                  </div>
                  <div className="space-y-2">
                    <label className="label">Téléphone</label>
                    <input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="06 12 34 56 78" className="input" />
                  </div>
                  <div className="space-y-2">
                     <label className="label flex justify-between">Email <span className="text-muted font-normal">Optionnel</span></label>
                     <input type="email" value={data.email} onChange={e => update("email", e.target.value)} placeholder="jean@exemple.com" className="input" />
                  </div>
                  <div className="pt-4 border-t border-border">
                     <label className="label flex justify-between">Code promo <span className="text-muted font-normal">Optionnel</span></label>
                     {appliedPromo ? (
                       <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                         <div>
                           <div className="text-[13px] font-bold text-success flex items-center gap-2">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                             Code {appliedPromo.code}
                           </div>
                           <div className="text-[11px] text-success/80 font-medium mt-0.5">
                             Réduction de {appliedPromo.discountValue}{appliedPromo.discountType === 'percent' ? '%' : '€'} appliquée
                           </div>
                         </div>
                         <button onClick={() => setAppliedPromo(null)} className="text-muted hover:text-foreground text-[11px] font-bold underline">Retirer</button>
                       </div>
                     ) : (
                       <div className="space-y-1">
                         <div className="flex gap-2">
                           <input 
                             type="text" 
                             value={promoCodeInput}
                             onChange={e => { setPromoCodeInput(e.target.value.toUpperCase()); setPromoError(null); }}
                             placeholder="Ex: SUMMER24" 
                             className="input flex-1 uppercase" 
                           />
                           <button onClick={handleApplyPromo} className="btn-secondary !py-2 !px-4 !text-[12px]">Appliquer</button>
                         </div>
                         {promoError && <p className="text-error text-[11px] font-bold pl-1">{promoError}</p>}
                       </div>
                     )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border flex gap-3 shrink-0 bg-surface">
              {step > 1 && <button onClick={back} className="btn-secondary !py-3 !px-4"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg></button>}
              {step < totalSteps ? (
                <button onClick={next} className="btn-primary flex-1 !py-3 text-[15px]">Continuer</button>
              ) : (
                <button onClick={submit} disabled={sending} className="btn-primary flex-1 !py-3 text-[15px]">
                  {sending ? "Validation..." : "Confirmer la réservation"}
                </button>
              )}
            </div>

            {serverError && <div className="p-4 bg-error/10 text-error text-[13px] font-bold text-center border-t border-error/20 shrink-0">{serverError.message}</div>}
          </>
        )}
      </div>
    </div>
  );
}
