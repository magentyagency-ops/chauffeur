export default function CTA() {
  return (
    <section className="py-24 md:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-7xl font-medium tracking-tight mb-8">
            Rejoignez l&apos;élite des chauffeurs privés.
          </h2>
          <p className="text-text-muted text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Prenez le contrôle de votre business, fidélisez vos clients et développez votre activité sans intermédiaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-black !py-4 !px-10 text-lg w-full sm:w-auto">
              Démarrer l&apos;essai gratuit
            </button>
            <button className="btn-ghost !py-4 !px-10 text-lg w-full sm:w-auto">
              Voir la démo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
