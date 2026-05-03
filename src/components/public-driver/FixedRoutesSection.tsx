"use client";

export default function FixedRoutesSection({ routes }: { routes: any[] }) {
  if (!routes || routes.length === 0) return null;

  const handleBookClick = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-2">Trajets fréquents</h2>
        <p className="text-text-muted font-medium">Réservez rapidement ces forfaits à prix fixe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map(route => (
          <div key={route.id} className="glass rounded-[1.5rem] p-6 border border-surface-border flex flex-col h-full hover:border-surface-border/80 transition-colors group">
            <div className="flex items-start justify-between mb-6">
              <h4 className="text-lg font-black text-foreground leading-tight pr-4">{route.title}</h4>
              <div className="text-2xl font-black text-primary shrink-0">{route.price} €</div>
            </div>

            <div className="space-y-4 relative pl-3 mb-6 bg-surface/30 p-4 rounded-xl border border-surface-border flex-1">
              <div className="absolute top-6 bottom-6 left-[19px] w-[2px] bg-surface-border rounded-full" />
              
              <div className="flex items-start gap-4 relative">
                <span className="w-3.5 h-3.5 rounded-full border-4 border-primary bg-background shrink-0 mt-1 relative z-10" />
                <div>
                  <div className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-wider">Départ</div>
                  <div className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{route.pickup}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 relative">
                <span className="w-3.5 h-3.5 rounded-full border-4 border-accent bg-background shrink-0 mt-1 relative z-10" />
                <div>
                  <div className="text-[10px] text-text-muted font-bold mb-0.5 uppercase tracking-wider">Arrivée</div>
                  <div className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{route.dropoff}</div>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-text-muted mb-6 line-clamp-2">
              {route.description}
            </p>

            <button 
              onClick={handleBookClick}
              className="w-full py-3 bg-surface border border-surface-border text-foreground rounded-xl text-sm font-bold hover:bg-surface-light hover:border-surface-border/80 transition-all active:scale-95 mt-auto shadow-sm"
            >
              Réserver ce trajet
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
