export default function Solution() {
  return (
    <section id="solution" className="section-spacing relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4">
              La solution
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Votre mini centrale de réservation{" "}
              <span className="gradient-text">privée</span>
            </h2>
            <p className="mt-6 text-lg text-text-muted leading-relaxed">
              Vroom vous donne tous les outils pour construire votre
              activité de chauffeur privé indépendant, sans commissions et sans
              intermédiaire.
            </p>

            <div className="mt-10 space-y-6">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ),
                  title: "Zéro commission",
                  desc: "Gardez 100% de vos revenus. Pas de frais cachés, pas de pourcentage prélevé.",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ),
                  title: "Vos clients, votre contrôle",
                  desc: "Accédez à vos données clients, recontactez-les et fidélisez-les directement.",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ),
                  title: "Image professionnelle",
                  desc: "Une page personnalisée qui inspire confiance et reflète votre excellence.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a href="#tarifs" className="btn-primary">
                <span>Découvrir la plateforme</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <div className="glass rounded-2xl p-6 md:p-8 relative">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl opacity-50" />

              <div className="relative space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold gradient-text">0%</div>
                    <div className="text-sm text-text-muted mt-1">Commission</div>
                  </div>
                  <div className="bg-surface rounded-xl p-5 text-center">
                    <div className="text-3xl font-bold gradient-text">100%</div>
                    <div className="text-sm text-text-muted mt-1">Vos revenus</div>
                  </div>
                </div>

                {/* Mini dashboard preview */}
                <div className="bg-surface rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-foreground">Réservations du jour</span>
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { time: "09:30", from: "CDG", to: "Paris 8e", price: "85€" },
                      { time: "14:00", from: "La Défense", to: "Versailles", price: "65€" },
                      { time: "18:30", from: "Gare de Lyon", to: "Orly", price: "55€" },
                    ].map((trip, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-text-muted font-mono w-12">{trip.time}</span>
                          <div>
                            <div className="text-sm text-foreground flex items-center gap-1.5">
                              {trip.from}
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                              {trip.to}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-primary">{trip.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability badge */}
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-semibold text-sm">Disponible — En attente de réservations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
