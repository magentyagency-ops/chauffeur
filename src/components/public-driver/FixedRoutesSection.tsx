"use client";

export default function FixedRoutesSection({ routes }: { routes: any[] }) {
  if (!routes || routes.length === 0) return null;

  const handleBookClick = () => {
    window.dispatchEvent(new Event('open-booking-modal'));
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Forfaits à prix fixe</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map(route => (
          <div key={route.id} className="card p-5 flex flex-col h-full hover:border-foreground/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-[15px] leading-tight pr-2">{route.title}</h4>
              <div className="text-lg font-bold text-accent shrink-0">{route.price}€</div>
            </div>

            <div className="text-[12px] text-muted mb-4 space-y-1">
              <div>{route.pickup} → {route.dropoff}</div>
            </div>

            <button 
              onClick={handleBookClick}
              className="btn-secondary w-full !py-2 !text-[12px] mt-auto"
            >
              Réserver
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
