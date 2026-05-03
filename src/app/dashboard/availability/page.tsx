"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { 
  mockAvailability, 
  mockAvailabilityStats, 
  mockScheduledSlots,
  isAvailabilityActive,
  getTimeRemaining,
  generateClientMessage,
  getAvailableUntilFromDuration,
  DURATION_OPTIONS,
  QUICK_ZONES,
  DriverAvailability,
  getPersistedAvailability,
  savePersistedAvailability
} from "@/lib/mockAvailability";
import { mockDriver } from "@/lib/mock-data";

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<DriverAvailability>(mockAvailability);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; label: string } | null>(null);
  
  // Initialize from localStorage
  useEffect(() => {
    const saved = getPersistedAvailability();
    setAvailability(saved);
    setIsActive(isAvailabilityActive(saved));
    setTimeRemaining(getTimeRemaining(saved.available_until));
  }, []);
  
  const [showConfig, setShowConfig] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  
  // Config Form State
  const [duration, setDuration] = useState("1h");
  const [zone, setZone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  // Auto-expire / countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const currentActive = isAvailabilityActive(availability);
      setIsActive(currentActive);
      setTimeRemaining(getTimeRemaining(availability.available_until));
      
      // Auto-expire
      if (availability.is_available && !currentActive && availability.availability_mode !== 'manual') {
         setAvailability(prev => ({ ...prev, is_available: false }));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [availability]);

  // Update effect on dependency change
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
      // Pre-fill
      setZone(availability.current_zone);
      setMessage(availability.client_message);
      // Try to find duration... fallback to 1h
      setDuration(availability.availability_mode === 'manual' ? 'manual' : '1h');
    } else {
      setZone(mockDriver.city); // default to main city
      setMessage("");
      setDuration("1h");
    }
    setShowConfig(true);
  };

  const handleSaveConfig = () => {
    if (!zone.trim()) {
      showToast("La zone est obligatoire.", "error");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const mode = duration === "manual" ? "manual" : "timed";
      const until = getAvailableUntilFromDuration(duration);
      const finalMsg = message.trim() ? message : generateClientMessage(zone, until, mode);
      
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
      showToast("Disponibilité activée avec succès.");
    }, 800);
  };

  const handleDisable = () => {
    const newAvail: DriverAvailability = {
      ...availability,
      is_available: false,
      last_disabled_at: new Date().toISOString()
    };
    setAvailability(newAvail);
    savePersistedAvailability(newAvail);
    setShowDisableConfirm(false);
    showToast("Vous êtes maintenant indisponible.");
  };

  // Preview data based on form or current state
  const previewZone = showConfig ? zone : availability.current_zone;
  const previewUntil = showConfig ? getAvailableUntilFromDuration(duration) : availability.available_until;
  const previewMode = showConfig ? (duration === 'manual' ? 'manual' : 'timed') : availability.availability_mode;
  const previewMsg = showConfig 
    ? (message.trim() || generateClientMessage(previewZone || "[Zone]", previewUntil, previewMode))
    : availability.client_message;

  return (
    <>
      <DashboardHeader title="Disponibilité" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`px-5 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-bold border backdrop-blur-md ${
            toast.type === 'success' 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {toast.type === 'success' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-5xl mx-auto space-y-6 md:space-y-8 pb-32">
        
        {/* Main Status Card */}
        <div className={`glass rounded-[2rem] p-6 md:p-10 border-2 shadow-2xl transition-all relative overflow-hidden ${
          isActive 
            ? 'border-green-500/30 bg-gradient-to-br from-green-950/40 to-background shadow-green-500/10' 
            : 'border-surface-border'
        }`}>
          {isActive && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner ${
                isActive ? 'bg-green-500 text-foreground shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-surface-light text-text-muted border border-surface-border'
              }`}>
                {isActive ? (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                )}
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isActive ? 'text-green-400' : 'text-foreground'}`}>
                    {isActive ? "Vous êtes disponible" : "Vous êtes indisponible"}
                  </h2>
                  {isActive && <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-wider rounded-lg"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> LIVE</span>}
                </div>
                
                {isActive ? (
                  <div className="flex flex-col gap-1 text-sm md:text-base font-medium text-text-secondary">
                    <span className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {availability.current_zone}</span>
                    <span className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {availability.availability_mode === 'manual' ? 'Jusqu\'à désactivation' : `Jusqu'à ${new Date(availability.available_until!).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}`} {timeRemaining && <span className="text-primary ml-2 font-bold">({timeRemaining.label} restants)</span>}</span>
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-text-muted font-medium max-w-md">
                    Vos clients peuvent toujours réserver pour plus tard, mais ils ne verront pas le bouton de demande immédiate.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              {isActive ? (
                <>
                  <button onClick={() => setShowDisableConfirm(true)} className="flex-1 px-6 py-4 bg-surface border border-surface-border text-foreground rounded-xl text-sm font-bold hover:bg-surface-light active:scale-95 transition-all shadow-sm">
                    Désactiver
                  </button>
                  <button onClick={handleOpenConfig} className="flex-1 px-6 py-4 bg-white text-background rounded-xl text-sm font-black hover:bg-gray-100 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                    Modifier
                  </button>
                </>
              ) : (
                <button onClick={handleOpenConfig} className="w-full px-8 py-4 bg-primary text-foreground rounded-xl text-base font-black hover:bg-primary-light active:scale-95 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Me rendre disponible
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Config Panel (Inline expansion) */}
        {showConfig && (
          <div className="glass rounded-[2rem] p-6 md:p-8 border-2 border-primary/30 shadow-xl space-y-8 animate-fade-in-up relative overflow-hidden bg-gradient-to-b from-primary/[0.02] to-transparent">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                Configuration
              </h3>
              <button onClick={() => setShowConfig(false)} className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-surface-light active:scale-95 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Settings */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Durée</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DURATION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDuration(opt.value)}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 ${
                          duration === opt.value
                            ? 'bg-primary/10 border-primary text-primary shadow-sm'
                            : 'bg-surface border-surface-border text-text-muted hover:text-foreground hover:bg-surface-light'
                        } ${opt.value === 'manual' || opt.value === 'day' ? 'col-span-3 sm:col-span-1' : ''}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Zone actuelle <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Ex: Rouen centre, Gare de Rouen..."
                    className="w-full px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-foreground text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none shadow-sm"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QUICK_ZONES.map(qz => (
                      <button
                        key={qz}
                        onClick={() => setZone(qz === "Ma ville principale" ? mockDriver.city : qz)}
                        className="px-3 py-1.5 rounded-lg bg-surface-light border border-surface-border text-xs font-bold text-text-muted hover:text-foreground transition-colors"
                      >
                        {qz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Message client (Optionnel)</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={generateClientMessage(zone || "[Zone]", getAvailableUntilFromDuration(duration), duration === 'manual' ? 'manual' : 'timed')}
                    className="w-full px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-foreground text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none shadow-sm"
                  />
                  <p className="text-xs text-text-muted font-medium">Si vide, le message généré dans l'aperçu sera utilisé.</p>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={saving || !zone.trim()}
                  className="w-full py-4 bg-primary text-foreground rounded-xl text-base font-black hover:bg-primary-light active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {saving ? (
                    <span className="w-5 h-5 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
                  ) : (
                    "Activer ma disponibilité"
                  )}
                </button>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-text-secondary tracking-wide">Aperçu côté client</label>
                <div className="glass rounded-[1.5rem] p-6 border-2 border-green-500/30 bg-gradient-to-b from-green-950/20 to-background shadow-lg shadow-green-500/5 sticky top-28">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    <span className="text-xs font-black text-green-400 uppercase tracking-wider">Disponible maintenant</span>
                  </div>
                  <p className="text-foreground font-medium text-lg leading-snug mb-6">
                    {previewMsg}
                  </p>
                  <button className="w-full py-3.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold pointer-events-none">
                    Demander une course maintenant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Public Preview Static */}
        {!showConfig && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground tracking-tight">Ce que voient vos clients</h3>
            <div className={`glass rounded-[1.5rem] p-6 border-2 transition-all ${isActive ? 'border-green-500/30 bg-gradient-to-b from-green-950/20 to-background' : 'border-surface-border'}`}>
               <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-surface-border'}`} />
                  <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-green-400' : 'text-text-muted'}`}>
                    {isActive ? 'Disponible maintenant' : 'Sur réservation'}
                  </span>
                </div>
                <p className="text-foreground font-medium text-lg leading-snug mb-6">
                  {isActive ? availability.client_message : 'Vous pouvez réserver un trajet pour plus tard.'}
                </p>
                <button className={`w-full md:w-auto px-6 py-3.5 rounded-xl text-sm font-bold pointer-events-none border ${
                  isActive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-surface border-surface-border text-text-muted'
                }`}>
                  {isActive ? 'Demander une course maintenant' : 'Réserver plus tard'}
                </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="glass p-5 md:p-6 rounded-[1.5rem] border border-surface-border">
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Temps dispo aujourd'hui</div>
            <div className="text-2xl font-black text-foreground">{mockAvailabilityStats.time_available_today}</div>
          </div>
          <div className="glass p-5 md:p-6 rounded-[1.5rem] border border-surface-border">
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Demandes immédiates reçues</div>
            <div className="text-2xl font-black text-foreground">{mockAvailabilityStats.requests_during_availability}</div>
          </div>
          <div className="glass p-5 md:p-6 rounded-[1.5rem] border border-surface-border">
            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Dernière activation</div>
            <div className="text-lg font-bold text-foreground mt-1">{mockAvailabilityStats.last_activation}</div>
          </div>
        </div>

        {/* Scheduled Availabilities */}
        <div className="space-y-6 pt-8">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-black text-foreground tracking-tight mb-1">Disponibilités programmées</h3>
              <p className="text-sm font-medium text-text-muted">Préparez vos créneaux récurrents à l'avance.</p>
            </div>
            <button className="hidden sm:flex px-4 py-2 bg-surface border border-surface-border text-foreground rounded-xl text-sm font-bold hover:bg-surface-light active:scale-95 transition-all shadow-sm">
              Ajouter
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockScheduledSlots.map(slot => (
              <div key={slot.id} className={`glass rounded-[1.5rem] p-5 border flex items-center justify-between gap-4 transition-all ${slot.active ? 'border-surface-border' : 'border-surface-border/30 opacity-60'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-foreground text-lg">{slot.day}</span>
                    <span className="text-text-muted font-medium text-sm">{slot.start} - {slot.end}</span>
                  </div>
                  <div className="text-sm font-bold text-primary flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{slot.zone}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked={slot.active} />
                  <div className="w-12 h-7 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                </label>
              </div>
            ))}
            <button className="h-full min-h-[100px] glass rounded-[1.5rem] border-2 border-dashed border-surface-border flex items-center justify-center text-text-muted hover:border-primary/50 hover:text-primary transition-all active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>

      </main>

      {/* Disable Confirmation Modal */}
      {showDisableConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowDisableConfirm(false)} />
          <div className="glass rounded-[2rem] p-8 max-w-md w-full relative z-10 border border-surface-border shadow-2xl animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">Désactiver votre disponibilité ?</h3>
            <p className="text-text-muted font-medium text-sm leading-relaxed mb-8">
              Vos clients ne verront plus le bouton "Course immédiate", mais pourront toujours réserver un trajet pour plus tard.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDisableConfirm(false)} className="flex-1 py-3.5 bg-surface border border-surface-border text-foreground rounded-xl text-sm font-bold hover:bg-surface-light transition-all active:scale-95">
                Annuler
              </button>
              <button onClick={handleDisable} className="flex-1 py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all active:scale-95">
                Désactiver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
