export default function HowItWorks() {
  const steps = [
    {
      title: "Activez votre profil",
      description: "Configurez vos services, vos tarifs et vos zones d'intervention en quelques minutes."
    },
    {
      title: "Partagez votre lien",
      description: "Envoyez votre lien de réservation à vos clients par SMS ou intégrez-le sur vos réseaux."
    },
    {
      title: "Gérez vos courses",
      description: "Recevez des demandes en direct, confirmez-les et suivez votre planning simplement."
    }
  ];

  return (
    <section id="comment-ca-marche" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-32">
             <h2 className="display text-4xl md:text-6xl font-medium tracking-tight mb-8">
               Prêt en quelques minutes.
             </h2>
             <p className="text-text-muted text-lg font-medium leading-relaxed max-w-md">
               Une mise en place simple et rapide pour commencer à recevoir vos réservations directes dès aujourd&apos;hui.
             </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8 group">
                <div className="display text-4xl md:text-5xl font-medium text-foreground/10 group-hover:text-foreground transition-colors duration-500">
                  0{index + 1}
                </div>
                <div className="space-y-3">
                  <h3 className="display text-2xl font-medium tracking-tight">{step.title}</h3>
                  <p className="text-text-muted text-base font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
