"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockRoutes } from "@/lib/mock-data";

export default function RoutesPage() {
  return (
    <>
      <DashboardHeader title="Trajets fixes">
        <button className="px-5 py-2.5 bg-primary text-foreground rounded-xl text-sm font-bold hover:bg-primary-light transition-colors flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="hidden sm:inline">Nouveau trajet</span>
        </button>
      </DashboardHeader>

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        <div className="glass p-6 md:p-8 rounded-[1.5rem] border-2 border-primary/20 flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center bg-gradient-to-r from-primary/[0.05] to-transparent shadow-lg shadow-primary/5">
          <div className="w-14 h-14 rounded-2xl bg-primary text-foreground flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground mb-1 tracking-tight">Pourquoi créer des trajets fixes ?</h3>
            <p className="text-sm md:text-base text-text-muted leading-relaxed font-medium">
              Les forfaits (ex: Paris &rarr; CDG, Mariage) apparaissent en premier sur votre profil. Ils rassurent vos clients sur le prix et leur permettent de réserver en 2 clics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {mockRoutes.map(route => (
            <RouteCard key={route.id} route={route} />
          ))}
          
          <button className="h-full min-h-[240px] glass rounded-[1.5rem] border-2 border-dashed border-surface-border flex flex-col items-center justify-center gap-4 text-text-muted hover:border-primary/50 hover:bg-primary/5 transition-all group active:scale-95">
            <div className="w-16 h-16 rounded-full bg-surface border border-surface-border flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all shadow-inner">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <div className="text-center">
              <span className="block text-lg font-black group-hover:text-primary transition-colors mb-1 tracking-tight">Créer un nouveau trajet</span>
              <span className="text-sm font-medium">Aéroport, Gare, Mise à disposition...</span>
            </div>
          </button>
        </div>

      </main>
    </>
  );
}

function RouteCard({ route }: { route: any }) {
  return (
    <div className={`glass rounded-[1.5rem] p-6 transition-all relative flex flex-col h-full border-2 ${route.active ? 'border-surface-border hover:border-surface-border/80 shadow-md' : 'border-surface-border/30 opacity-60 grayscale-[30%]'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xl font-black text-foreground leading-tight tracking-tight mb-2">{route.title}</h4>
          <div className="text-3xl font-black text-primary tracking-tight">{route.price} €</div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
          <input type="checkbox" className="sr-only peer" defaultChecked={route.active} />
          <div className="w-12 h-7 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
        </label>
      </div>

      <div className="space-y-4 relative pl-3 mb-6 bg-surface/30 p-4 rounded-xl border border-surface-border">
        <div className="absolute top-6 bottom-6 left-[19px] w-[2px] bg-surface-border rounded-full" />
        
        <div className="flex items-start gap-4 relative">
          <span className="w-3.5 h-3.5 rounded-full border-4 border-primary bg-background shrink-0 mt-1 relative z-10" />
          <div>
            <div className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-wider">Départ</div>
            <div className="text-sm font-semibold text-foreground leading-snug">{route.pickup}</div>
          </div>
        </div>
        
        <div className="flex items-start gap-4 relative">
          <span className="w-3.5 h-3.5 rounded-full border-4 border-accent bg-background shrink-0 mt-1 relative z-10" />
          <div>
            <div className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-wider">Arrivée</div>
            <div className="text-sm font-semibold text-foreground leading-snug">{route.dropoff}</div>
          </div>
        </div>
      </div>

      <p className="text-sm text-text-secondary font-medium mb-6 line-clamp-2 italic flex-1">
        « {route.description} »
      </p>

      <div className="flex gap-3 pt-5 border-t border-surface-border mt-auto">
        <button className="flex-1 py-3 bg-surface border border-surface-border text-text-secondary rounded-xl text-sm font-bold hover:bg-surface-light hover:text-foreground transition-all active:scale-95 shadow-sm">
          Modifier
        </button>
        <button className="px-5 py-3 bg-surface border border-surface-border text-text-secondary rounded-xl text-sm hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    </div>
  );
}
