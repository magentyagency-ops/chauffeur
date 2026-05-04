"use client";

import { useState, useEffect } from "react";
import { isAvailabilityActive, getPersistedAvailability } from "@/lib/mockAvailability";
import { createBooking, type CreateBookingInput } from "@/lib/actions/bookings";

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

export default function BookingForm({ availability: initialAvailability, driverSlug }: { availability?: any; driverSlug?: string }) {
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
  const [serverError, setServerError] = useState<{ message: string; code?: string } | null>(null);
  const totalSteps = 4;

  useEffect(() => {
    const saved = getPersistedAvailability();
    setAvailability(saved);
    setData(prev => ({ ...prev, timing: isAvailabilityActive(saved) ? "now" : "later" }));
  }, []);

  function update(field: keyof BookingData, value: string) {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    if (serverError) setServerError(null);
  }

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!data.pickup.trim() || data.pickup.trim().length < 3) errs.pickup = "Adresse de départ requise (min. 3 caractères).";
      if (!data.dropoff.trim() || data.dropoff.trim().length < 3) errs.dropoff = "Adresse d'arrivée requise (min. 3 caractères).";
    }
    if (s === 2 && data.timing === "later") {
      if (!data.date) errs.date = "Choisissez une date.";
      if (!data.time) errs.time = "Choisissez une heure.";
      if (data.date && data.time) {
        const dt = new Date(`${data.date}T${data.time}`);
        if (dt < new Date()) errs.date = "La date ne peut pas être dans le passé.";
      }
    }
    if (s === 3) {
      if (!data.name.trim()) errs.name = "Votre nom est requis.";
      if (!data.phone.trim()) errs.phone = "Votre téléphone est requis.";
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = "Email invalide.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() { if (validateStep(step)) setStep(step + 1); }
  function back() { if (step > 1) setStep(step - 1); }

  async function submit() {
    setSending(true);
    setServerError(null);

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
      notes: data.comment.trim() || undefined,
    };

    const result = await createBooking(input);
    setSending(false);

    if (result.success) {
      setSent(true);
    } else {
      if (result.errorCode === "DRIVER_UNAVAILABLE") {
        setServerError({ message: result.error!, code: "DRIVER_UNAVAILABLE" });
      } else {
        setServerError({ message: result.error || "Une erreur est survenue.", code: result.errorCode });
      }
    }
  }

  function switchToLater() {
    update("timing", "later");
    setServerError(null);
    setStep(2);
  }

  function reset() {
    setData({ pickup: "", dropoff: "", timing: isAvailabilityActive(availability) ? "now" : "later", date: "", time: "", name: "", phone: "", email: "", comment: "" });
    setStep(1); setSent(false); setErrors({}); setServerError(null);
  }

  // ─── Success State ────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="card p-8 md:p-10 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-green flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="display text-2xl font-medium text-foreground mb-3 tracking-tight">Demande envoyée !</h3>
        <p className="text-text-muted text-sm font-medium mb-8 max-w-xs mx-auto leading-relaxed">
          Votre chauffeur reviendra vers vous très rapidement par téléphone ou WhatsApp.
        </p>
        <div className="bg-surface-light rounded-xl p-5 border border-surface-border mb-8 text-left space-y-3">
          <SummaryRow label="Départ" value={data.pickup} />
          <SummaryRow label="Arrivée" value={data.dropoff} />
          <SummaryRow label="Quand" value={data.timing === "now" ? "Dès que possible" : `${data.date} à ${data.time}`} />
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => window.open(`https://wa.me/33612345678?text=Bonjour, j'ai fait une demande de course.`, "_blank")} className="btn-black w-full !bg-green !text-white flex items-center justify-center gap-2">
            Contacter sur WhatsApp
          </button>
          <button onClick={reset} className="btn-ghost w-full">Faire une autre demande</button>
        </div>
      </div>
    );
  }

  // ─── Main Form ────────────────────────────────────────────────────────
  return (
    <div className="card shadow-2xl overflow-hidden animate-fade-up">
      <div className="px-8 pt-8 pb-6">
        <h3 className="display text-2xl font-medium text-foreground tracking-tight mb-1">Réserver une course</h3>
        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Réponse rapide garantie</p>
      </div>

      {/* Progress */}
      <div className="px-8 pb-8">
        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1"><div className={`h-1 rounded-full transition-all duration-500 ${i + 1 <= step ? "bg-foreground" : "bg-surface-light"}`} /></div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Étape {step}/{totalSteps}</span>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">
            {step === 1 && "Trajet"}{step === 2 && "Quand"}{step === 3 && "Vos infos"}{step === 4 && "Récapitulatif"}
          </span>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mx-8 mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          <p className="mb-3">{serverError.message}</p>
          {serverError.code === "DRIVER_UNAVAILABLE" && (
            <button onClick={switchToLater} className="btn-ghost !text-xs !py-2 !px-4 !bg-white">
              Réserver pour plus tard →
            </button>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="px-8 pb-8 space-y-6 min-h-[260px]">
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <FormField label="Adresse de départ" error={errors.pickup}>
              <input type="text" value={data.pickup} onChange={e => update("pickup", e.target.value)} placeholder="Ex: 15 rue de Rivoli, Paris" className={inputClass(errors.pickup)} />
            </FormField>
            <FormField label="Adresse d'arrivée" error={errors.dropoff}>
              <input type="text" value={data.dropoff} onChange={e => update("dropoff", e.target.value)} placeholder="Ex: Aéroport CDG Terminal 2" className={inputClass(errors.dropoff)} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 gap-3 p-1 bg-surface-light rounded-xl">
              <button onClick={() => update("timing", "now")} className={`py-3 rounded-lg text-sm font-bold transition-all ${data.timing === "now" ? "bg-white text-foreground shadow-sm" : "text-text-muted hover:text-foreground"}`}>
                Maintenant
              </button>
              <button onClick={() => update("timing", "later")} className={`py-3 rounded-lg text-sm font-bold transition-all ${data.timing === "later" ? "bg-white text-foreground shadow-sm" : "text-text-muted hover:text-foreground"}`}>
                Plus tard
              </button>
            </div>
            {data.timing === "later" && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <FormField label="Date" error={errors.date}>
                  <input type="date" value={data.date} onChange={e => update("date", e.target.value)} min={new Date().toISOString().split("T")[0]} className={inputClass(errors.date)} />
                </FormField>
                <FormField label="Heure" error={errors.time}>
                  <input type="time" value={data.time} onChange={e => update("time", e.target.value)} className={inputClass(errors.time)} />
                </FormField>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <FormField label="Votre nom" error={errors.name}>
              <input type="text" value={data.name} onChange={e => update("name", e.target.value)} placeholder="Jean Martin" className={inputClass(errors.name)} />
            </FormField>
            <FormField label="Téléphone" error={errors.phone}>
              <input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="06 12 34 56 78" className={inputClass(errors.phone)} />
            </FormField>
            <FormField label="Email (optionnel)" error={errors.email}>
              <input type="email" value={data.email} onChange={e => update("email", e.target.value)} placeholder="jean@email.com" className={inputClass(errors.email)} />
            </FormField>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-surface-light rounded-xl p-6 border border-surface-border space-y-4">
              <SummaryRow label="Départ" value={data.pickup} />
              <SummaryRow label="Arrivée" value={data.dropoff} />
              <SummaryRow label="Quand" value={data.timing === "now" ? "Dès que possible" : `${data.date} à ${data.time}`} />
              <div className="border-t border-surface-border pt-4 mt-2">
                <SummaryRow label="Nom" value={data.name} />
                <SummaryRow label="Téléphone" value={data.phone} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-8 pb-8 flex gap-3">
        {step > 1 && (
          <button onClick={back} className="btn-ghost !py-3 !px-6">
            Retour
          </button>
        )}
        {step < totalSteps ? (
          <button onClick={next} className="btn-black flex-1 !py-3.5">
            Continuer
          </button>
        ) : (
          <button onClick={submit} disabled={sending} className="btn-black flex-1 !py-3.5 !bg-foreground !text-background disabled:opacity-50">
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-background/20 border-t-background animate-spin" />
                Envoi...
              </span>
            ) : "Confirmer ma demande"}
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
      {children}
      {error && <p className="text-[11px] font-bold text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-6">
      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-sm font-bold text-foreground text-right leading-tight">{value}</span>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-4 py-3 rounded-xl bg-surface border text-foreground text-sm font-medium outline-none transition-all placeholder:text-text-muted/40 ${
    error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-surface-border focus:border-foreground"
  }`;
}
