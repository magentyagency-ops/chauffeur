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
        <button className="btn-primary !py-2 !px-4 !text-[13px] hidden sm:flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Nouveau
        </button>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8 pb-32">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex bg-surface-alt p-1 rounded-xl border border-border w-full md:w-auto overflow-x-auto">
            {tags.map(tag => (
              <button key={tag} onClick={() => setFilter(tag)} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${filter === tag ? "bg-background text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}>
                {tag === "all" ? "Tous" : tag}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="input !py-2.5 !pl-10 !text-sm" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.length === 0 ? (
            <div className="col-span-full card p-20 text-center border-dashed">
              <p className="text-muted text-sm">Aucun client trouvé.</p>
            </div>
          ) : (
            filteredClients.map(client => (
              <div key={client.id} className="card p-6 flex flex-col h-full hover:border-foreground/20 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-alt border border-border flex items-center justify-center font-bold text-foreground text-lg group-hover:bg-background transition-colors">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-[16px] leading-none mb-1.5">{client.name}</h4>
                      <div className="text-[13px] font-medium text-muted">{client.phone}</div>
                    </div>
                  </div>
                  {client.tag && <StatusBadge tag={client.tag} />}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-surface-alt rounded-lg border border-border">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Courses</div>
                    <div className="font-bold text-foreground">{client.trips_count}</div>
                  </div>
                  <div className="p-3 bg-surface-alt rounded-lg border border-border">
                    <div className="text-[10px] text-muted uppercase font-bold mb-1">Dernière</div>
                    <div className="font-bold text-foreground text-[12px]">{new Date(client.last_trip).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>

                <div className="flex-1 mb-6">
                  {client.notes ? (
                    <p className="text-[13px] text-muted italic line-clamp-2">« {client.notes} »</p>
                  ) : (
                    <p className="text-[13px] text-muted/30 italic">Aucune note.</p>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                   <button className="btn-secondary flex-1 !py-2 !text-[12px] flex items-center justify-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      Appeler
                   </button>
                   <button className="btn-secondary flex-1 !py-2 !text-[12px] !text-success !border-success/20 hover:!bg-success/5">WhatsApp</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}

function StatusBadge({ tag }: { tag: string }) {
  const styles: any = {
    VIP: "bg-accent/10 text-accent border-accent/20",
    Régulier: "bg-success/10 text-success border-success/20",
    Nouveau: "bg-surface-alt text-muted border-border",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight border ${styles[tag] || styles.Nouveau}`}>
      {tag}
    </span>
  );
}
