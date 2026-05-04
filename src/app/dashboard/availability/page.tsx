"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { 
  mockAvailability, 
  isAvailabilityActive,
  getTimeRemaining,
  generateClientMessage,
  getAvailableUntilFromDuration,
  DURATION_OPTIONS,
  DriverAvailability,
  getPersistedAvailability,
  savePersistedAvailability
} from "@/lib/mockAvailability";
import { mockDriver } from "@/lib/mock-data";

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<DriverAvailability>(mockAvailability);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; label: string } | null>(null);
  
  useEffect(() => {
    const saved = getPersistedAvailability();
    setAvailability(saved);
    setIsActive(isAvailabilityActive(saved));
    setTimeRemaining(getTimeRemaining(saved.available_until));
  }, []);
  
  const [showConfig, setShowConfig] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  
  const [duration, setDuration] = useState("1h");
  const [zone, setZone] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentActive = isAvailabilityActive(availability);
      setIsActive(currentActive);
      setTimeRemaining(getTimeRemaining(availability.available_until));
      if (availability.is_available && !currentActive && availability.availability_mode !== 'manual') {
         setAvailability(prev => ({ ...prev, is_available: false }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [availability]);

  useEffect(() => {
    setIsActive(isAvailabilityActive(availability));
    setTimeRemaining(getTimeRemaining(availability.available_until));
  }, [availability]);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenConfig = () => {
    if (isActive) {
      setZone(availability.current_zone);
      setDuration(availability.availability_mode === 'manual' ? 'manual' : '1h');
    } else {
      setZone(mockDriver.city);
      setDuration("1h");
    }
    setShowConfig(true);
  };

  const handleSaveConfig = () => {
    if (!zone.trim()) { showToast("La zone est obligatoire.", "error"); return; }
    setSaving(true);
    setTimeout(() => {
      const mode = duration === "manual" ? "manual" : "timed";
      const until = getAvailableUntilFromDuration(duration);
      const finalMsg = generateClientMessage(zone, until, mode);
      const newAvail: DriverAvailability = {
        ...availability,
        is_available: true,
        current_zone: zone,
        availability_mode: mode,
        available_until: until,
        client_message: finalMsg,
        last_enabled_at: new Date().toISOString()
      };
      setAvailability(newAvail);
      savePersistedAvailability(newAvail);
      setSaving(false);
      setShowConfig(false);
      showToast("Disponibilité activée.");
    }, 500);
  };

  const handleDisable = () => {
    const newAvail: DriverAvailability = { ...availability, is_available: false, last_disabled_at: new Date().toISOString() };
    setAvailability(newAvail);
    savePersistedAvailability(newAvail);
    setShowDisableConfirm(false);
    showToast("Indisponible.");
  };

  return (
    <>
      <DashboardHeader title="Disponibilité" />

      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`px-5 py-3 rounded-full shadow-lg text-[13px] font-bold border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      <main className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-8 pb-32">
        
        {/* Status Card */}
        <section className={`p-8 border rounded-[14px] transition-all ${isActive ? "border-success/30 bg-success/[0.02]" : "bg-surface border-border"}`}>
          <div className="flex flex-col items-center text-center gap-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${isActive ? "bg-success text-background border-success" : "bg-surface-alt text-muted border-border"}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {isActive ? <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /> : <circle cx="12" cy="12" r="10" />}
                {isActive && <polyline points="22 4 12 14.01 9 11.01" />}
                {!isActive && <line x1="12" y1="8" x2="12" y2="12" />}
                {!isActive && <line x1="12" y1="16" x2="12.01" y2="16" />}
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">{isActive ? "Vous êtes en ligne" : "Vous êtes hors ligne"}</h2>
              <p className="text-muted text-[15px] max-w-sm mx-auto">
                {isActive 
                  ? `Zone ${availability.current_zone} · ${timeRemaining?.label || "..."} restantes`
                  : "Passez en ligne pour recevoir des demandes immédiates."
                }
              </p>
            </div>
            <div className="flex gap-3">
              {isActive ? (
                <>
                  <button onClick={() => setShowDisableConfirm(true)} className="btn-secondary">Désactiver</button>
                  <button onClick={handleOpenConfig} className="btn-primary">Modifier</button>
                </>
              ) : (
                <button onClick={handleOpenConfig} className="btn-primary !px-10">Passer en ligne</button>
              )}
            </div>
          </div>
        </section>

        {showConfig && (
          <section className="card p-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold tracking-tight">Configuration</h3>
              <button onClick={() => setShowConfig(false)} className="text-muted hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="label">Durée</label>
                <div className="grid grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setDuration(opt.value)} className={`py-2.5 rounded-xl text-[13px] font-bold border transition-all ${duration === opt.value ? "bg-foreground text-background border-foreground" : "bg-surface border-border text-muted hover:border-foreground"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="label">Zone</label>
                <input type="text" value={zone} onChange={e => setZone(e.target.value)} placeholder="Ex: Paris 8, Gare du Nord..." className="input" />
              </div>

              <button onClick={handleSaveConfig} disabled={saving || !zone.trim()} className="btn-primary w-full !py-4">
                {saving ? "..." : "Confirmer"}
              </button>
            </div>
          </section>
        )}

        {/* Hidden for now — stats and scheduled slots will be re-added later */}
      </main>

      {showDisableConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowDisableConfirm(false)} />
          <div className="card p-8 max-w-sm w-full relative z-10 shadow-2xl animate-scale-in text-center">
            <h3 className="text-xl font-bold mb-2">Désactiver ?</h3>
            <p className="text-muted text-sm mb-8">Vous ne recevrez plus de demandes immédiates.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDisableConfirm(false)} className="btn-secondary flex-1">Annuler</button>
              <button onClick={handleDisable} className="btn-secondary !text-error !border-error/20 hover:!bg-error/5 flex-1">Désactiver</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
