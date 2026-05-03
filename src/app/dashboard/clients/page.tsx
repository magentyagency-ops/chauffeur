"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockClients } from "@/lib/mock-data";

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const tags = ["all", "VIP", "Régulier", "Nouveau"];

  const filteredClients = mockClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchFilter = filter === "all" || c.tag === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <DashboardHeader title="Clients">
        <button className="hidden sm:flex px-5 py-2 bg-primary text-foreground rounded-xl text-sm font-bold hover:bg-primary-light transition-colors items-center gap-2 shadow-lg shadow-primary/20 active:scale-95">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Nouveau client
        </button>
      </DashboardHeader>

      <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-2 rounded-[1.5rem] border border-surface-border">
          <div className="relative w-full md:w-96 shrink-0 p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher (nom, téléphone)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-surface-light border border-surface-border text-sm font-medium text-foreground placeholder:text-text-muted/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full md:w-auto p-1">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all active:scale-95 ${
                  filter === tag 
                    ? "bg-primary text-foreground shadow-md" 
                    : "text-text-muted hover:text-foreground hover:bg-surface-light"
                }`}
              >
                {tag === "all" ? "Tous" : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile FAB Add Client */}
        <button className="sm:hidden fixed bottom-24 right-4 z-40 w-14 h-14 bg-primary text-foreground rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        </button>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredClients.length === 0 ? (
            <div className="col-span-full glass rounded-[2rem] p-12 md:p-20 flex flex-col items-center justify-center text-center border border-dashed border-surface-border">
              <div className="w-20 h-20 rounded-[1.5rem] bg-surface flex items-center justify-center mb-6 text-text-muted shadow-inner border border-surface-border">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-2 tracking-tight">Aucun client trouvé</h3>
              <p className="text-text-muted text-base font-medium max-w-sm">
                Modifiez vos filtres ou ajoutez un nouveau client à votre répertoire.
              </p>
            </div>
          ) : (
            filteredClients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))
          )}
        </div>

      </main>
    </>
  );
}

function ClientCard({ client }: { client: any }) {
  return (
    <div className="glass rounded-[1.5rem] p-5 md:p-6 border border-surface-border hover:border-surface-border/80 hover:bg-surface-light transition-all group flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface-border to-surface flex items-center justify-center font-black text-foreground text-xl shadow-inner border border-surface-border">
            {client.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-black text-foreground text-lg tracking-tight leading-none mb-1.5">{client.name}</h4>
            <div className="text-sm font-medium text-text-muted">{client.phone}</div>
          </div>
        </div>
        <div>
          {client.tag === 'VIP' && <span className="text-[10px] font-black bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">VIP</span>}
          {client.tag === 'Régulier' && <span className="text-[10px] font-black bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Régulier</span>}
          {client.tag === 'Nouveau' && <span className="text-[10px] font-black bg-green-500/10 border border-green-500/20 text-green-400 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">Nouveau</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 bg-background/50 rounded-xl p-4 border border-surface-border shadow-inner">
        <div>
          <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-0.5">Courses</div>
          <div className="font-black text-foreground text-lg">{client.trips_count}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-0.5">Dernière course</div>
          <div className="font-bold text-foreground text-sm">{new Date(client.last_trip).toLocaleDateString('fr-FR')}</div>
        </div>
      </div>

      <div className="flex-1">
        {client.notes ? (
          <div className="text-sm text-text-secondary font-medium italic line-clamp-2 bg-surface/30 p-3 rounded-xl border border-surface-border/50">
            « {client.notes} »
          </div>
        ) : (
          <div className="text-sm text-text-muted/50 italic line-clamp-2 p-3">
            Aucune note.
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-5 mt-auto">
        <button className="flex-1 py-3 bg-surface border border-surface-border text-foreground rounded-xl text-sm font-bold hover:bg-surface-light hover:border-surface-border/80 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Appeler
        </button>
        <button className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl text-sm font-bold hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          WhatsApp
        </button>
      </div>
    </div>
  );
}
