"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockDriver } from "@/lib/mock-data";
import { useState } from "react";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(mockDriver);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <>
      <DashboardHeader title="Profil public">
        <button className="hidden sm:flex px-5 py-2.5 bg-surface border border-surface-border text-text-secondary rounded-xl text-sm font-bold hover:text-foreground hover:bg-surface-light transition-colors active:scale-95 shadow-sm">
          Prévisualiser
        </button>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-primary text-foreground rounded-xl text-sm font-bold hover:bg-primary-light transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-md shadow-primary/20"
        >
          {saving ? (
            <span className="w-5 h-5 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          )}
          <span className="hidden sm:inline">Enregistrer</span>
        </button>
      </DashboardHeader>

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Link banner */}
        <div className="glass rounded-[1.5rem] p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-2 border-primary/20 bg-gradient-to-r from-primary/[0.05] to-transparent shadow-lg shadow-primary/5">
          <div>
            <div className="text-sm font-bold text-foreground mb-1.5 tracking-tight">Votre page est en ligne !</div>
            <div className="text-sm md:text-base text-primary font-mono bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg inline-block">
              privechauffeur.com/{formData.public_slug}
            </div>
          </div>
          <a href={`/chauffeur/${formData.public_slug}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 bg-surface border border-surface-border rounded-xl text-sm font-bold hover:bg-surface-light hover:text-foreground transition-colors flex items-center justify-center gap-2 active:scale-95 shadow-sm text-text-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Ouvrir la page
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation/Tabs (desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-2 p-4 glass rounded-[1.5rem] border border-surface-border">
              <a href="#infos" className="block px-4 py-3 rounded-xl bg-surface-light text-foreground font-bold text-sm shadow-sm border border-surface-border">Informations</a>
              <a href="#bio" className="block px-4 py-3 rounded-xl text-text-muted hover:bg-surface-light hover:text-foreground font-bold text-sm transition-colors">Présentation</a>
              <a href="#vehicle" className="block px-4 py-3 rounded-xl text-text-muted hover:bg-surface-light hover:text-foreground font-bold text-sm transition-colors">Véhicule & Options</a>
              <a href="#media" className="block px-4 py-3 rounded-xl text-text-muted hover:bg-surface-light hover:text-foreground font-bold text-sm transition-colors">Médias</a>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-3 space-y-8">
            
            <Section id="infos" title="Informations principales">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <Input label="Nom complet affiché" defaultValue={formData.full_name} />
                <Input label="Lien public (slug)" defaultValue={formData.public_slug} prefix="privechauffeur.com/" />
                <Input label="Téléphone" defaultValue={formData.phone} />
                <Input label="WhatsApp" defaultValue={formData.whatsapp} />
                <Input label="Email public" defaultValue={formData.email} className="sm:col-span-2" />
                <Input label="Ville principale" defaultValue={formData.city} className="sm:col-span-2" />
              </div>
            </Section>

            <Section id="bio" title="Présentation">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Phrase d'accroche</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-foreground text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    defaultValue="Votre chauffeur privé de confiance sur Paris"
                  />
                  <p className="text-xs font-medium text-text-muted">Apparaît en grand, juste sous votre nom.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Biographie complète</label>
                  <textarea 
                    rows={5}
                    className="w-full px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-foreground text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                    defaultValue={formData.bio}
                  />
                </div>
              </div>
            </Section>

            <Section id="vehicle" title="Véhicule & Options">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <Input label="Marque" defaultValue={formData.vehicle_brand} />
                <Input label="Modèle" defaultValue={formData.vehicle_model} />
                <Input label="Couleur" defaultValue={formData.vehicle_color} />
                <Input label="Nombre de places" type="number" defaultValue={formData.vehicle_seats.toString()} />
                
                <div className="sm:col-span-2 space-y-2 mt-2">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Options à bord</label>
                  <div className="flex flex-wrap gap-2.5">
                    {formData.vehicle_options.map(opt => (
                      <div key={opt} className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-sm font-medium text-foreground flex items-center gap-3 shadow-sm">
                        {opt}
                        <button className="text-text-muted hover:text-red-400 bg-background/50 hover:bg-red-500/10 rounded-full p-1 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                      </div>
                    ))}
                    <button className="px-4 py-2 rounded-xl bg-surface border-2 border-dashed border-surface-border text-sm font-bold text-text-muted hover:text-foreground hover:border-surface-border/80 transition-colors active:scale-95">
                      + Ajouter option
                    </button>
                  </div>
                </div>
              </div>
            </Section>

            <Section id="media" title="Médias">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-text-secondary tracking-wide mb-4">Photo de profil</label>
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground text-3xl font-black shadow-xl border-4 border-surface">
                      {formData.full_name.charAt(0)}
                    </div>
                    <button className="px-5 py-2.5 bg-surface border border-surface-border rounded-xl text-sm font-bold hover:bg-surface-light text-text-secondary hover:text-foreground transition-colors active:scale-95 shadow-sm">
                      Changer la photo
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary tracking-wide mb-4">Photo du véhicule (recommandé)</label>
                  <div className="w-full h-48 rounded-[1.5rem] border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-text-muted hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-surface/30">
                    <div className="w-14 h-14 rounded-full bg-surface-light border border-surface-border flex items-center justify-center mb-3 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-primary transition-colors"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <span className="text-base font-bold group-hover:text-primary transition-colors">Cliquez pour ajouter une photo</span>
                    <span className="text-sm font-medium mt-1 opacity-70">Format paysage recommandé</span>
                  </div>
                </div>
              </div>
            </Section>

          </div>
        </div>

      </main>
    </>
  );
}

function Section({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  return (
    <div id={id} className="glass rounded-[1.5rem] p-6 md:p-8 scroll-mt-28 border border-surface-border">
      <h3 className="text-xl md:text-2xl font-black text-foreground mb-8 tracking-tight flex items-center gap-3">
        {title}
        <div className="h-px bg-surface-border flex-1 ml-4" />
      </h3>
      {children}
    </div>
  );
}

function Input({ label, defaultValue, type = "text", prefix, className = "" }: any) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-bold text-text-secondary tracking-wide">{label}</label>
      {prefix ? (
        <div className="flex rounded-xl overflow-hidden border border-surface-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-sm">
          <div className="px-4 py-3.5 bg-surface-light text-text-muted text-sm font-bold border-r border-surface-border flex items-center">
            {prefix}
          </div>
          <input 
            type={type} 
            className="w-full px-4 py-3.5 bg-surface text-foreground text-base font-medium focus:outline-none"
            defaultValue={defaultValue}
          />
        </div>
      ) : (
        <input 
          type={type} 
          className="w-full px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-foreground text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none shadow-sm"
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}
