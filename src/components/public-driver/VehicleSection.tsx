export default function VehicleSection({ vehicle }: { vehicle: any }) {
  return (
    <section id="véhicule" className="scroll-mt-28 animate-fade-up">
      <h2 className="display text-3xl font-medium text-foreground mb-10 tracking-tight">Le véhicule</h2>
      
      <div className="card p-8 border-surface-border flex flex-col md:flex-row gap-10 items-center relative overflow-hidden group">
        <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl bg-surface-light flex items-center justify-center relative overflow-hidden border border-surface-border group-hover:border-foreground/10 transition-colors">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
           <div className="absolute inset-0 bg-gradient-to-t from-surface-light/80 to-transparent pointer-events-none" />
           <div className="absolute bottom-4 left-4">
             <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-lg text-text-muted font-bold text-[10px] uppercase tracking-widest border border-surface-border">Visuel de référence</div>
           </div>
        </div>

        <div className="w-full md:w-1/2 space-y-8">
          <div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">Prestige & Confort</div>
            <h3 className="display text-3xl font-medium text-foreground tracking-tight leading-tight">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-text-muted font-medium mt-2 text-lg italic display">{vehicle.color} • {vehicle.seats} passagers</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest">Équipements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {vehicle.options.map((opt: string) => (
                <div key={opt} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-green" />
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
