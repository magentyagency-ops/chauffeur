"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Pourquoi choisir PrivéChauffeur plutôt qu'une autre plateforme ?",
      answer: "Contrairement aux plateformes traditionnelles, nous ne sommes pas un intermédiaire. Vous gardez 100% de vos revenus et vous restez propriétaire de votre base client. C'est votre outil, pas votre patron."
    },
    {
      question: "Comment fonctionne la réservation directe ?",
      answer: "Vos clients accèdent à votre page, choisissent leur trajet et réservent en 3 clics. Vous recevez une notification immédiate et validez la course. C'est aussi simple qu'Uber, mais c'est vous qui encaissez."
    },
    {
      question: "Est-ce qu'il y a des frais cachés ?",
      answer: "Aucun. Vous payez un abonnement mensuel fixe et prévisible. Pas de frais de dossier, pas de commission sur les courses, pas de frais de résiliation. La transparence totale."
    },
    {
      question: "Puis-je utiliser mon propre terminal de paiement ?",
      answer: "Absolument. Vous encaissez vos clients comme vous le souhaitez : espèces, CB à bord, virement ou lien de paiement. Nous ne touchons jamais à votre argent."
    }
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="display text-4xl md:text-6xl font-medium tracking-tight mb-6">
            Des réponses claires.
          </h2>
          <p className="text-text-muted text-lg font-medium leading-relaxed">
            Tout ce que vous devez savoir pour lancer votre activité avec nous.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-surface-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className="display text-xl md:text-2xl font-medium tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                  {faq.question}
                </span>
                <div className={`shrink-0 w-10 h-10 rounded-full border border-surface-border flex items-center justify-center transition-transform duration-500 ${openIndex === index ? 'rotate-180 bg-surface-light' : ''}`}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="pb-8 text-text-muted text-base font-medium leading-relaxed max-w-3xl">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
