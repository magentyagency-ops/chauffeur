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
      <div className="glass rounded-[2rem] p-8 md:p-10 border border-green-500/30 bg-gradient-to-br from-green-950/30 to-background text-center shadow-xl">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Demande envoyée !</h3>
        <p className="text-text-muted font-medium mb-4 max-w-xs mx-auto leading-relaxed">
          Votre chauffeur reviendra vers vous très rapidement par téléphone ou WhatsApp.
        </p>
        <div className="bg-surface/50 rounded-xl p-4 border border-surface-border mb-6 text-left space-y-2">
          <SummaryRow label="Départ" value={data.pickup} />
          <SummaryRow label="Arrivée" value={data.dropoff} />
          <SummaryRow label="Quand" value={data.timing === "now" ? "Dès que possible" : `${data.date} à ${data.time}`} />
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => window.open(`https://wa.me/33612345678?text=Bonjour, j'ai fait une demande de course.`, "_blank")} className="w-full py-3.5 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-all active:scale-95 flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Contacter sur WhatsApp
          </button>
          <button onClick={reset} className="w-full py-3.5 bg-surface border border-surface-border text-foreground rounded-xl text-sm font-bold hover:bg-surface-light transition-all active:scale-95">Faire une autre demande</button>
        </div>
      </div>
    );
  }

  // ─── Main Form ────────────────────────────────────────────────────────
  return (
    <div className="glass rounded-[2rem] border border-surface-border shadow-2xl overflow-hidden">
      <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4">
        <h3 className="text-xl font-black text-foreground tracking-tight mb-1">Réserver une course</h3>
        <p className="text-sm font-medium text-text-muted">Réponse en quelques minutes.</p>
      </div>

      {/* Progress */}
      <div className="px-6 md:px-8 pb-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex-1"><div className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 <= step ? "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-surface-border"}`} /></div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Étape {step}/{totalSteps}</span>
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            {step === 1 && "Trajet"}{step === 2 && "Quand"}{step === 3 && "Vos infos"}{step === 4 && "Confirmation"}
          </span>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="mx-6 md:mx-8 mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          <p className="mb-2">{serverError.message}</p>
          {serverError.code === "DRIVER_UNAVAILABLE" && (
            <button onClick={switchToLater} className="px-4 py-2 bg-surface border border-surface-border text-foreground rounded-lg text-xs font-bold hover:bg-surface-light transition-all active:scale-95">
              Réserver pour plus tard →
            </button>
          )}
          {serverError.code === "NETWORK_ERROR" && (
            <button onClick={() => window.open("https://wa.me/33612345678", "_blank")} className="px-4 py-2 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-lg text-xs font-bold hover:bg-[#25D366]/20 transition-all active:scale-95">
              Contacter par WhatsApp
            </button>
          )}
        </div>
      )}

      {/* Steps */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-5 min-h-[260px]">
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <FormField label="Adresse de départ" error={errors.pickup}>
              <input type="text" value={data.pickup} onChange={e => update("pickup", e.target.value)} placeholder="Ex: 15 rue de Rivoli, Paris" className={inputClass(errors.pickup)} />
            </FormField>
            <FormField label="Adresse d'arrivée" error={errors.dropoff}>
              <input type="text" value={data.dropoff} onChange={e => update("dropoff", e.target.value)} placeholder="Ex: Aéroport CDG Terminal 2" className={inputClass(errors.dropoff)} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => update("timing", "now")} className={`py-4 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${data.timing === "now" ? "bg-primary/10 border-primary text-primary shadow-md" : "bg-surface border-surface-border text-text-muted hover:text-foreground"}`}>
                Maintenant
              </button>
              <button onClick={() => update("timing", "later")} className={`py-4 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${data.timing === "later" ? "bg-primary/10 border-primary text-primary shadow-md" : "bg-surface border-surface-border text-text-muted hover:text-foreground"}`}>
                Plus tard
              </button>
            </div>
            {data.timing === "later" && (
              <div className="grid grid-cols-2 gap-4 animate-fadeIn">
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
          <div className="space-y-4 animate-fadeIn">
            <FormField label="Votre nom" error={errors.name}>
              <input type="text" value={data.name} onChange={e => update("name", e.target.value)} placeholder="Jean Martin" className={inputClass(errors.name)} />
            </FormField>
            <FormField label="Téléphone" error={errors.phone}>
              <input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="06 12 34 56 78" className={inputClass(errors.phone)} />
            </FormField>
            <FormField label="Email (optionnel)" error={errors.email}>
              <input type="email" value={data.email} onChange={e => update("email", e.target.value)} placeholder="jean@email.com" className={inputClass(errors.email)} />
            </FormField>
            <FormField label="Commentaire (optionnel)">
              <textarea rows={2} value={data.comment} onChange={e => update("comment", e.target.value)} placeholder="Nombre de bagages, siège enfant..." className={inputClass() + " resize-none"} />
            </FormField>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-surface/50 rounded-xl p-5 border border-surface-border space-y-3.5">
              <SummaryRow label="Départ" value={data.pickup} />
              <SummaryRow label="Arrivée" value={data.dropoff} />
              <SummaryRow label="Quand" value={data.timing === "now" ? "Dès que possible" : `${data.date} à ${data.time}`} />
              <div className="border-t border-surface-border pt-3.5 mt-1">
                <SummaryRow label="Nom" value={data.name} />
                <SummaryRow label="Téléphone" value={data.phone} />
                {data.email && <SummaryRow label="Email" value={data.email} />}
                {data.comment && <SummaryRow label="Note" value={data.comment} />}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 flex gap-3">
        {step > 1 && (
          <button onClick={back} className="px-5 py-3.5 bg-surface border border-surface-border text-text-secondary rounded-xl text-sm font-bold hover:bg-surface-light hover:text-foreground transition-all active:scale-95">
            Retour
          </button>
        )}
        {step < totalSteps ? (
          <button onClick={next} className="flex-1 py-3.5 bg-white text-background rounded-xl text-sm font-black hover:bg-gray-100 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Continuer
          </button>
        ) : (
          <button onClick={submit} disabled={sending} className="flex-1 py-3.5 bg-white text-background rounded-xl text-sm font-black hover:bg-gray-100 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-60 flex items-center justify-center gap-2">
            {sending ? (
              <><span className="w-5 h-5 rounded-full border-[3px] border-black/20 border-t-black animate-spin" />Envoi en cours...</>
            ) : "Envoyer ma demande"}
          </button>
        )}
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-text-secondary tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs font-bold text-red-400 flex items-center gap-1 mt-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs font-bold text-text-muted uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-4 py-3 rounded-xl bg-surface border text-foreground text-sm font-medium outline-none transition-all placeholder:text-text-muted/50 ${
    error ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50" : "border-surface-border focus:border-primary focus:ring-1 focus:ring-primary/50"
  }`;
}
