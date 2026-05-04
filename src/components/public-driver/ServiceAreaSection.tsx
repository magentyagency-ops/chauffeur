export default function ServiceAreaSection({ areas, city }: { areas: string[], city: string }) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Zones desservies</h2>
      <div className="glass rounded-[2rem] p-6 md:p-8 border border-surface-border h-full bg-gradient-to-br from-surface to-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h3 className="text-lg font-black text-foreground tracking-tight">Basé à {city}</h3>
            <p className="text-sm font-medium text-text-muted">Déplacements locaux et longues distances</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {areas.map(area => (
            <div key={area} className="px-4 py-2 bg-surface border border-surface-border rounded-xl text-sm font-bold text-text-secondary shadow-sm">
              {area}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
