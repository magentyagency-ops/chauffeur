export default function CTA() {
  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-accent/20" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center py-16 md:py-24 px-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-3xl mx-auto">
              Prêt à prendre le contrôle de{" "}
              <span className="gradient-text">votre activité</span> ?
            </h2>
            <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
              Rejoignez plus de 500 chauffeurs privés qui ont choisi
              l&apos;indépendance. Essai gratuit 14 jours, sans engagement.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#tarifs" className="btn-primary text-lg !py-4 !px-8">
                <span>Créer mon espace chauffeur</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a href="#" className="btn-secondary text-lg !py-4 !px-8">
                <span>Parler à un conseiller</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
