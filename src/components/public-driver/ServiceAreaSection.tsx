export default function ServiceAreaSection({ areas, city }: { areas: string[], city: string }) {
  return (
    <section className="space-y-8 animate-fade-up">
      <h2 className="display text-3xl font-medium text-foreground tracking-tight">Zones desservies</h2>
      <div className="card p-8 border-surface-border relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
        
        <div className="flex items-center gap-6 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-full bg-surface-light border border-surface-border flex items-center justify-center text-foreground transition-all duration-300 group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <h3 className="display text-xl font-medium text-foreground tracking-tight">Basé à {city}</h3>
            <p className="text-sm font-medium text-text-muted">Interventions locales et nationales</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          {areas.map(area => (
            <div key={area} className="pill bg-surface-light text-foreground/80 border border-surface-border font-bold">
              {area}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
