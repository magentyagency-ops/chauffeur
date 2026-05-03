export default function Problem() {
  const problems = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8l-8 8" />
          <path d="M8.5 8H8v.5" />
          <path d="M16 15.5v.5h-.5" />
        </svg>
      ),
      title: "Commissions élevées",
      description:
        "Les plateformes prélèvent jusqu'à 25% de commission sur chaque course, réduisant drastiquement vos revenus.",
      stat: "25%",
      statLabel: "de commissions prélevées",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Dépendance aux plateformes",
      description:
        "Vous ne contrôlez ni vos tarifs, ni vos conditions, ni votre visibilité. Votre activité dépend entièrement d'un algorithme.",
      stat: "0%",
      statLabel: "de contrôle sur votre activité",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="17" y1="8" x2="23" y2="8" />
        </svg>
      ),
      title: "Impossible de fidéliser",
      description:
        "Vos clients ne sont pas les vôtres. Impossible de les recontacter, de leur proposer vos services directement.",
      stat: "0",
      statLabel: "accès à vos données clients",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      title: "Manque de contrôle",
      description:
        "Aucun outil pour gérer votre planning, vos tarifs ou votre image. Vous subissez les règles au lieu de les créer.",
      stat: "100%",
      statLabel: "des règles imposées",
    },
  ];

  return (
    <section id="probleme" className="section-spacing relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Le problème
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Les chauffeurs privés méritent{" "}
            <span className="gradient-text">mieux</span>
          </h2>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            En tant que chauffeur indépendant, vous faites face à des obstacles
            qui freinent votre croissance et limitent vos revenus.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group hover-card glass rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/15 transition-colors duration-300">
                    {problem.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-surface-border flex items-center gap-3">
                  <span className="text-2xl font-bold text-red-400">
                    {problem.stat}
                  </span>
                  <span className="text-sm text-text-muted">
                    {problem.statLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
