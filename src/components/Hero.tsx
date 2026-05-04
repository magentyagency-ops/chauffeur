export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-glow bg-grid overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
      <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-28 pb-20">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-text-muted">
            Plateforme conçue pour les chauffeurs indépendants
          </span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up stagger-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-5xl mx-auto">
          Développez votre clientèle privée{" "}
          <span className="gradient-text">sans dépendre des plateformes</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up stagger-2 mt-6 md:mt-8 text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
          Créez votre page de réservation, fidélisez vos clients et recevez des
          demandes directes en quelques minutes.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up stagger-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/auth/register" className="btn-primary text-lg !py-4 !px-8">
            <span>Créer mon espace chauffeur</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a href="#comment-ca-marche" className="btn-secondary text-lg !py-4 !px-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            <span>Voir une démo</span>
          </a>
        </div>

        {/* Social proof */}
        <div className="animate-fade-in-up stagger-4 mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[
                "bg-gradient-to-br from-blue-400 to-blue-600",
                "bg-gradient-to-br from-purple-400 to-purple-600",
                "bg-gradient-to-br from-cyan-400 to-cyan-600",
                "bg-gradient-to-br from-indigo-400 to-indigo-600",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${bg} border-2 border-background flex items-center justify-center text-xs font-bold text-foreground`}
                >
                  {["C", "M", "S", "A"][i]}
                </div>
              ))}
            </div>
            <span>+500 chauffeurs actifs</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-surface-border" />
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="ml-1">4.9/5 — avis vérifiés</span>
          </div>
        </div>

        {/* Floating preview */}
        <div className="animate-fade-in-up stagger-5 mt-16 md:mt-20 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-1 animate-pulse-glow">
            <div className="bg-surface rounded-xl p-6 md:p-8">
              {/* Mock UI */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 h-7 bg-surface-light rounded-lg flex items-center px-3">
                  <span className="text-xs text-text-muted">privechauffeur.com/thomas-dupont</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="h-4 bg-surface-light rounded w-3/4" />
                  <div className="h-3 bg-surface-light rounded w-1/2" />
                  <div className="mt-4 px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center font-medium flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Disponible maintenant
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="h-4 bg-surface-light rounded w-full" />
                  <div className="h-4 bg-surface-light rounded w-5/6" />
                  <div className="h-4 bg-surface-light rounded w-2/3" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="h-20 bg-surface-light rounded-lg p-3 flex flex-col justify-between">
                      <div className="h-3 bg-primary/10 rounded w-2/3" />
                      <div className="h-5 bg-primary/10 rounded w-1/2" />
                    </div>
                    <div className="h-20 bg-surface-light rounded-lg p-3 flex flex-col justify-between">
                      <div className="h-3 bg-accent/10 rounded w-2/3" />
                      <div className="h-5 bg-accent/10 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="mt-2 h-12 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <span className="text-foreground font-semibold text-sm">Réserver maintenant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
