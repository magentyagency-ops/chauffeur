export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center overflow-hidden">
      {/* Subtle radial glow background */}
      <div 
        aria-hidden="true" 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none z-0 opacity-50"
        style={{
          background: `radial-gradient(circle at center, var(--green) 10%, transparent 60%)`,
          filter: "blur(60px)"
        }}
      />

      <div className="relative z-10">
        {/* Badge */}
        <div className="animate-fade-up inline-flex items-center gap-2.5 px-4 py-2 bg-surface border border-surface-border rounded-full mb-10 shadow-sm">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green text-white">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
          <span className="text-sm font-medium text-foreground">
            +500 chauffeurs déjà en activité
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-up text-5xl sm:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight mb-8">
          <span className="display italic font-normal">Votre</span> clientèle privée,<br />
          <span className="text-text-muted italic display font-normal">sans intermédiaire.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up mt-8 text-xl text-text-muted max-w-xl mx-auto leading-relaxed font-normal">
          Créez votre page de réservation, gérez vos clients et recevez des demandes directes — en quelques minutes.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/auth/register" className="btn-black text-lg px-8 py-4">
            <span>Créer mon espace</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a href="/chauffeur/demo" className="btn-ghost text-lg px-8 py-4">
            <span>Voir une démo client</span>
          </a>
        </div>

        {/* Social proof */}
        <div className="animate-fade-up mt-8 text-sm text-text-muted font-mono uppercase tracking-widest">
          14 jours gratuits · Sans CB · Sans engagement
        </div>

        {/* Mock dashboard preview */}
        <div className="animate-fade-up mt-24 max-w-5xl mx-auto relative group">
          <div className="bg-surface border border-surface-border rounded-2xl p-1.5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]">
            <div className="bg-background rounded-xl overflow-hidden min-h-[400px] flex">
              {/* Window Bar */}
              <div className="absolute top-5 left-8 flex gap-1.5 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              
              {/* Sidebar */}
              <div className="w-52 border-r border-surface-border bg-surface p-5 flex flex-col gap-6 pt-14 text-left hidden md:flex">
                <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Espace Pro</div>
                <div className="flex flex-col gap-1">
                  {["Accueil", "Réservations", "Clients", "Tarifs"].map((l, i) => (
                    <div key={l} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${i === 0 ? "bg-surface-light text-foreground" : "text-text-muted"}`}>
                      <div className={`w-3.5 h-3.5 rounded-sm ${i === 0 ? "bg-foreground" : "bg-text-muted/20"}`} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-8 pt-14 text-left">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="display text-3xl font-medium tracking-tight mb-1">Bonjour Jean.</h2>
                    <p className="text-xs text-text-muted">Mardi 14 Janvier · 3 courses prévues</p>
                  </div>
                  <div className="pill bg-green-light text-green border border-green/20 gap-2">
                    <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                    Disponible
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { v: "5", l: "Demandes", c: "text-foreground" },
                    { v: "3", l: "Confirmées", c: "text-green" },
                    { v: "42", l: "Clients", c: "text-foreground" },
                    { v: "285€", l: "Aujourd'hui", c: "text-foreground" },
                  ].map(({ v, l, c }) => (
                    <div key={l} className="card p-4">
                      <div className={`display text-2xl font-medium ${c}`}>{v}</div>
                      <div className="text-[10px] font-bold text-text-muted tracking-wide uppercase mt-1">{l}</div>
                    </div>
                  ))}
                </div>

                <div className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-light border border-surface-border flex items-center justify-center font-bold">S</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Sophie M. · 14:30</div>
                    <div className="text-xs text-text-muted">CDG T2E → Hôtel Ritz</div>
                  </div>
                  <div className="display text-xl font-medium">85€</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
