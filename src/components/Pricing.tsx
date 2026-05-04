"use client";

import { useState } from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Indépendant",
      price: "29€",
      description: "Pour les chauffeurs qui souhaitent gérer leur propre clientèle.",
      features: [
        "Page chauffeur personnalisée",
        "Réservations directes illimitées",
        "Gestion de planning",
        "0% de commission",
        "Paiements directs clients"
      ]
    },
    {
      name: "Premium",
      price: "79€",
      description: "Pour ceux qui veulent automatiser leur croissance.",
      features: [
        "Tout du plan Indépendant",
        "Facturation automatique pro",
        "Gestion client (CRM) avancée",
        "Statistiques de revenus",
        "Support prioritaire 24/7"
      ],
      popular: true
    }
  ];

  return (
    <section id="tarifs" className="py-24 md:py-32 bg-surface-light/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="display text-4xl md:text-6xl font-medium tracking-tight mb-6">
            Simple et transparent.
          </h2>
          <p className="text-text-muted text-lg font-medium leading-relaxed">
            Gardez 100% de vos revenus. Pas de commissions cachées, juste un abonnement pour vos outils.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`card p-10 flex flex-col h-full ${plan.popular ? 'border-foreground/10 shadow-xl' : ''}`}>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="display text-2xl font-medium tracking-tight">{plan.name}</h3>
                   {plan.popular && <span className="pill bg-foreground text-background font-black !py-1">Populaire</span>}
                </div>
                <div className="display text-5xl font-medium mb-4">{plan.price}<span className="text-lg text-text-muted">/mois</span></div>
                <p className="text-text-muted text-sm font-medium leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green"><polyline points="20 6 9 17 4 12"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full !py-4 ${plan.popular ? 'btn-black' : 'btn-ghost'}`}>
                Commencer l&apos;essai gratuit
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
