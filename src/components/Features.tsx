export default function Features() {
  const features = [
    {
      title: "Page Chauffeur",
      description: "Une vitrine premium pour présenter vos services, vos tarifs et vos véhicules.",
      icon: "User"
    },
    {
      title: "Réservation Directe",
      description: "Vos clients réservent en 3 clics. Sans application à télécharger, sans friction.",
      icon: "Calendar"
    },
    {
      title: "Statut en Direct",
      description: "Affichez votre disponibilité en temps réel pour attirer les courses immédiates.",
      icon: "Zap"
    },
    {
      title: "Gestion Clients",
      description: "Centralisez vos contacts, suivez l'historique et fidélisez votre clientèle.",
      icon: "Users"
    },
    {
      title: "Paiement Direct",
      description: "Gardez 100% de vos revenus. Aucun frais de commission sur vos trajets.",
      icon: "Wallet"
    },
    {
      title: "Facturation Pro",
      description: "Générez des factures professionnelles automatiquement pour vos clients sociétés.",
      icon: "FileText"
    }
  ];

  return (
    <section id="fonctionnalites" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-20">
          <h2 className="display text-4xl md:text-5xl font-medium tracking-tight mb-6">
            Conçu pour l&apos;excellence opérationnelle.
          </h2>
          <p className="text-text-muted text-lg font-medium leading-relaxed">
            PrivéChauffeur vous donne les outils pour professionnaliser votre activité et reprendre le contrôle total de votre relation client.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature, index) => (
            <div key={index} className="space-y-4">
              <h3 className="display text-xl font-medium tracking-tight">{feature.title}</h3>
              <p className="text-text-muted text-sm font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
