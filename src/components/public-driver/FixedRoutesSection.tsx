"use client";

export default function FixedRoutesSection({ routes }: { routes: any[] }) {
  if (!routes || routes.length === 0) return null;

  const handleBookClick = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="space-y-12 animate-fade-up">
      <div>
        <h2 className="display text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-3">Trajets fréquents</h2>
        <p className="text-text-muted font-medium text-lg">Forfaits tout compris pour vos destinations habituelles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {routes.map(route => (
          <div key={route.id} className="card p-8 flex flex-col h-full group hover:shadow-xl transition-all duration-500">
            <div className="flex items-start justify-between mb-8">
              <h4 className="display text-xl font-medium text-foreground tracking-tight leading-tight pr-4 group-hover:text-primary transition-colors">{route.title}</h4>
              <div className="display text-2xl font-medium text-foreground shrink-0">{route.price}€</div>
            </div>

            <div className="space-y-6 relative mb-8 flex-1">
              <div className="absolute top-[22px] bottom-[22px] left-[7px] w-[1.5px] bg-surface-border rounded-full" />
              
              <div className="flex items-center gap-4 relative">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-foreground bg-white shrink-0 relative z-10" />
                <div className="text-sm font-medium text-text-muted line-clamp-1">{route.pickup}</div>
              </div>
              
              <div className="flex items-center gap-4 relative">
                <div className="w-3.5 h-3.5 rounded-sm border-2 border-primary bg-white shrink-0 relative z-10" />
                <div className="text-sm font-medium text-text-muted line-clamp-1">{route.dropoff}</div>
              </div>
            </div>

            <button 
              onClick={handleBookClick}
              className="w-full !py-3.5 btn-ghost text-xs uppercase font-black tracking-widest mt-auto group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-300"
            >
              Réserver ce forfait
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
