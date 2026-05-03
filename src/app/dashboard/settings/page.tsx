"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Paramètres" />

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Settings Nav */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-2 p-4 glass rounded-[1.5rem] border border-surface-border">
              <a href="#account" className="block px-4 py-3 rounded-xl bg-surface-light text-foreground font-bold text-sm shadow-sm border border-surface-border">Compte</a>
              <a href="#notifications" className="block px-4 py-3 rounded-xl text-text-muted hover:bg-surface-light hover:text-foreground font-bold text-sm transition-colors">Notifications</a>
              <a href="#billing" className="block px-4 py-3 rounded-xl text-text-muted hover:bg-surface-light hover:text-foreground font-bold text-sm transition-colors">Abonnement</a>
              <a href="#security" className="block px-4 py-3 rounded-xl text-text-muted hover:bg-surface-light hover:text-foreground font-bold text-sm transition-colors">Sécurité</a>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Account */}
            <section id="account" className="glass rounded-[1.5rem] p-6 md:p-8 scroll-mt-28 border border-surface-border">
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-8 tracking-tight flex items-center gap-3">
                Compte
                <div className="h-px bg-surface-border flex-1 ml-4" />
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-text-secondary tracking-wide">Email de connexion</label>
                  <input type="email" disabled defaultValue="jean.dupont@example.com" className="w-full px-5 py-3.5 rounded-xl bg-surface border border-surface-border text-text-muted text-base font-medium cursor-not-allowed opacity-70" />
                  <p className="text-sm font-medium text-text-muted">Contactez le support pour modifier votre email.</p>
                </div>
                <div className="pt-4 flex justify-end border-t border-surface-border mt-6">
                  <button className="px-6 py-3 bg-primary text-foreground rounded-xl text-sm font-bold hover:bg-primary-light transition-all active:scale-95 shadow-md shadow-primary/20">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section id="notifications" className="glass rounded-[1.5rem] p-6 md:p-8 scroll-mt-28 border border-surface-border">
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-8 tracking-tight flex items-center gap-3">
                Notifications
                <div className="h-px bg-surface-border flex-1 ml-4" />
              </h3>
              <div className="space-y-2 divide-y divide-surface-border/50">
                <ToggleRow title="Nouvelles réservations" description="Recevoir un email et un SMS pour chaque demande." defaultChecked={true} />
                <ToggleRow title="Rappels de trajet" description="Recevoir un SMS 1h avant le départ d'une course." defaultChecked={true} />
                <ToggleRow title="Messages clients" description="Notification push quand un client vous écrit sur votre page." defaultChecked={true} />
                <ToggleRow title="Mises à jour PrivéChauffeur" description="Nouveautés et astuces pour développer votre activité." defaultChecked={false} />
              </div>
            </section>

            {/* Billing */}
            <section id="billing" className="glass rounded-[1.5rem] p-6 md:p-8 scroll-mt-28 border border-surface-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-surface-border relative z-10">
                <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">Abonnement</h3>
                <span className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-wider rounded-lg shadow-sm">Pro</span>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
                <div>
                  <div className="text-foreground text-lg font-black mb-1 tracking-tight">Forfait Pro Mensuel</div>
                  <div className="text-base font-medium text-text-muted mb-2">29€ / mois — Prochain prélèvement le 04 Juin 2024</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-text-secondary bg-surface px-3 py-1.5 rounded-lg border border-surface-border w-fit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    Carte terminant par •••• 4242
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-6 py-3 bg-surface border border-surface-border rounded-xl text-sm font-bold text-foreground hover:bg-surface-light transition-all active:scale-95 shadow-sm">
                    Factures
                  </button>
                  <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-foreground rounded-xl text-sm font-bold hover:bg-primary-light transition-all active:scale-95 shadow-md shadow-primary/20">
                    Gérer
                  </button>
                </div>
              </div>
            </section>

            {/* Security & Danger */}
            <section id="security" className="glass rounded-[1.5rem] p-6 md:p-8 scroll-mt-28 border border-red-500/30 bg-gradient-to-br from-red-500/[0.02] to-transparent">
              <h3 className="text-xl md:text-2xl font-black text-red-400 mb-8 tracking-tight flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Zone de danger
                <div className="h-px bg-red-500/20 flex-1 ml-4" />
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="text-foreground text-lg font-black mb-1 tracking-tight">Supprimer le compte</div>
                  <div className="text-sm md:text-base font-medium text-text-muted">Une fois supprimé, toutes vos données et votre page publique seront perdues définitivement.</div>
                </div>
                <button className="w-full md:w-auto shrink-0 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all active:scale-95 shadow-sm">
                  Supprimer mon compte
                </button>
              </div>
            </section>

          </div>
        </div>

      </main>
    </>
  );
}

function ToggleRow({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
  return (
    <div className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
      <div className="pr-6">
        <div className="text-foreground font-bold mb-1">{title}</div>
        <div className="text-sm font-medium text-text-muted">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-12 h-7 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
      </label>
    </div>
  );
}
