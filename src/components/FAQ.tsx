"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Est-ce que je peux garder mes clients ?",
      answer:
        "Absolument ! Contrairement aux plateformes classiques, tous vos clients vous appartiennent. Vous avez accès à leurs coordonnées, leur historique de courses et pouvez les contacter directement à tout moment. C'est votre base client, pas la nôtre.",
    },
    {
      question: "Est-ce que je peux recevoir des réservations directement ?",
      answer:
        "Oui, c'est le cœur de PrivéChauffeur. Vos clients peuvent réserver directement depuis votre page personnalisée. Vous recevez une notification instantanée et pouvez confirmer ou ajuster la réservation en un clic. Aucun intermédiaire entre vous et vos clients.",
    },
    {
      question: "Est-ce que je peux désactiver ma disponibilité ?",
      answer:
        "Bien sûr ! Vous contrôlez votre disponibilité en temps réel depuis votre tableau de bord ou l'application mobile. Un simple bouton on/off suffit. Quand vous êtes indisponible, vos clients le voient immédiatement sur votre page.",
    },
    {
      question: "Est-ce que la plateforme prend une commission ?",
      answer:
        "Jamais. PrivéChauffeur fonctionne avec un abonnement mensuel fixe, transparent et prévisible. Nous ne prenons aucune commission sur vos courses. Que vous fassiez 10 ou 100 courses par mois, votre abonnement reste le même. Vous gardez 100% de vos revenus.",
    },
    {
      question: "Puis-je essayer gratuitement ?",
      answer:
        "Oui ! Tous nos plans incluent un essai gratuit de 14 jours, sans carte bancaire requise. Vous pouvez tester toutes les fonctionnalités et ne payer que si vous êtes convaincu.",
    },
    {
      question: "Comment mes clients me trouvent-ils ?",
      answer:
        "Vous recevez un lien personnalisé (ex: privechauffeur.com/votre-nom) que vous pouvez partager par SMS, WhatsApp, email ou imprimer sur vos cartes de visite. Vous pouvez aussi l'intégrer à vos réseaux sociaux.",
    },
  ];

  return (
    <section id="faq" className="section-spacing relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Questions{" "}
            <span className="gradient-text">fréquentes</span>
          </h2>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index ? "ring-1 ring-primary/20" : ""
              }`}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span
                  className={`font-semibold text-base transition-colors duration-300 pr-4 ${
                    openIndex === index ? "text-foreground" : "text-text-secondary"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-primary/10 text-primary rotate-180"
                      : "bg-surface-light text-text-muted"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-text-muted leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-muted mb-4">
            Vous avez d&apos;autres questions ?
          </p>
          <a href="#" className="btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Contactez-nous</span>
          </a>
        </div>
      </div>
    </section>
  );
}
