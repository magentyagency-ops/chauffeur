export default function Features() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      title: "Page chauffeur personnalisée",
      description:
        "Votre vitrine professionnelle en ligne : photo, bio, véhicule, avis clients et bouton de réservation.",
      color: "from-blue-500/20 to-blue-600/10",
      borderColor: "group-hover:border-blue-500/20",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: "Réservation directe",
      description:
        "Vos clients réservent directement depuis votre page. Confirmez en un clic, sans intermédiaire.",
      color: "from-indigo-500/20 to-indigo-600/10",
      borderColor: "group-hover:border-indigo-500/20",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Disponibilité en temps réel",
      description:
        "Activez ou désactivez votre disponibilité d'un geste. Vos clients voient votre statut en direct.",
      color: "from-green-500/20 to-green-600/10",
      borderColor: "group-hover:border-green-500/20",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: "CRM client intégré",
      description:
        "Gérez votre base clients : historique des courses, préférences, coordonnées et notes personnelles.",
      color: "from-purple-500/20 to-purple-600/10",
      borderColor: "group-hover:border-purple-500/20",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Tarifs fixes personnalisés",
      description:
        "Définissez vos propres tarifs par trajet, par heure ou par kilomètre. Transparence totale pour vos clients.",
      color: "from-amber-500/20 to-amber-600/10",
      borderColor: "group-hover:border-amber-500/20",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      title: "Notifications intelligentes",
      description:
        "Recevez des alertes instantanées pour chaque nouvelle réservation, message ou demande client.",
      color: "from-cyan-500/20 to-cyan-600/10",
      borderColor: "group-hover:border-cyan-500/20",
    },
  ];

  return (
    <section id="fonctionnalites" className="section-spacing relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Tout ce qu&apos;il faut pour{" "}
            <span className="gradient-text">développer votre activité</span>
          </h2>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            Des outils puissants pensés pour les chauffeurs privés qui veulent
            prendre le contrôle de leur business.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group hover-card glass rounded-2xl p-8 relative overflow-hidden`}
            >
              {/* Background glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-foreground mb-6 transition-transform duration-300 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
