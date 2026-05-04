"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockRoutes } from "@/lib/mock-data";

export default function RoutesPage() {
  return (
    <>
      <DashboardHeader title="Trajets fixes">
        <button className="btn-primary !py-2 !px-4 !text-[13px] flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau
        </button>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-5xl mx-auto w-full space-y-10 pb-32">
        
        {/* Why section */}
        <section className="card p-6 bg-foreground text-background flex flex-col md:flex-row items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1 tracking-tight">Boostez vos réservations</h3>
            <p className="text-[14px] opacity-70 leading-relaxed">Les trajets fixes rassurent vos clients sur le prix et permettent une réservation instantanée sans devis.</p>
          </div>
        </section>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockRoutes.map(route => (
            <div key={route.id} className={`card p-6 flex flex-col h-full hover:border-foreground/20 transition-all group ${!route.active ? "opacity-50 grayscale" : ""}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold tracking-tight mb-1">{route.title}</h4>
                  <div className="text-2xl font-bold text-accent">{route.price}€</div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={route.active} />
                  <div className="w-10 h-6 bg-surface-alt border border-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-muted after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success peer-checked:after:bg-white peer-checked:border-success"></div>
                </div>
              </div>

              <div className="space-y-4 mb-6 bg-surface-alt p-4 rounded-xl border border-border">
                <div className="flex gap-3">
                   <div className="w-1 h-auto bg-border rounded-full flex flex-col justify-between py-0.5 items-center">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      <div className="w-2 h-2 rounded-full bg-accent" />
                   </div>
                   <div className="space-y-4 py-0.5">
                      <div><div className="text-[9px] font-bold text-muted uppercase">Départ</div><div className="text-[13px] font-medium leading-snug">{route.pickup}</div></div>
                      <div><div className="text-[9px] font-bold text-muted uppercase">Arrivée</div><div className="text-[13px] font-medium leading-snug">{route.dropoff}</div></div>
                   </div>
                </div>
              </div>

              <p className="text-[13px] text-muted italic mb-8 flex-1">« {route.description} »</p>

              <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                <button className="btn-secondary flex-1 !py-2 !text-[12px]">Modifier</button>
                <button className="btn-secondary !p-2 !text-muted hover:!text-error hover:!border-error/20">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          ))}
          
          <button className="card min-h-[200px] border-dashed flex flex-col items-center justify-center gap-3 hover:border-foreground/20 hover:bg-surface-alt transition-all group">
             <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted group-hover:text-foreground group-hover:border-foreground/30 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
             </div>
             <span className="text-sm font-bold text-muted group-hover:text-foreground">Ajouter un trajet</span>
          </button>
        </div>

      </main>
    </>
  );
}
