export default function VehicleSection({ vehicle }: { vehicle: any }) {
  return (
    <section id="véhicule" className="scroll-mt-28">
      <h2 className="text-2xl md:text-3xl font-black text-foreground mb-8 tracking-tight">Le véhicule</h2>
      
      <div className="glass rounded-[2rem] p-6 md:p-8 border border-surface-border flex flex-col md:flex-row gap-8 md:gap-12 items-center relative overflow-hidden">
        {/* Placeholder image area */}
        <div className="w-full md:w-1/2 aspect-[16/9] rounded-[1.5rem] bg-gradient-to-br from-surface-border to-surface flex items-center justify-center relative overflow-hidden shadow-inner border border-surface-border/50">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
           <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
           <div className="absolute bottom-4 left-4">
             <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-foreground font-bold text-sm border border-white/10">Photo non contractuelle</div>
           </div>
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Prestige & Confort</div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-text-muted font-medium mt-1">Couleur : {vehicle.color} • {vehicle.seats} places passagers</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Options à bord</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicle.options.map((opt: string) => (
                <div key={opt} className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
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
