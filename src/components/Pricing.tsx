"use client";

import { useState } from "react";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: annual ? 24 : 29,
      description: "Idéal pour démarrer votre activité de chauffeur indépendant.",
      features: [
        "Page chauffeur personnalisée",
        "Réservation directe",
        "Disponibilité en temps réel",
        "Jusqu'à 50 clients",
        "Notifications par email",
        "Support par email",
      ],
      cta: "Commencer avec Starter",
      popular: false,
    },
    {
      name: "Pro",
      price: annual ? 65 : 79,
      description: "Pour les chauffeurs qui veulent développer leur clientèle.",
      features: [
        "Tout dans Starter",
        "CRM client complet",
        "Clients illimités",
        "Tarifs personnalisés",
        "Notifications SMS + email",
        "Statistiques avancées",
        "Support prioritaire",
        "Lien personnalisé",
      ],
      cta: "Commencer avec Pro",
      popular: true,
    },
    {
      name: "Premium",
      price: annual ? 119 : 149,
      description: "L'offre complète pour les chauffeurs premium exigeants.",
      features: [
        "Tout dans Pro",
        "Multi-véhicules",
        "Facturation automatique",
        "Intégration agenda",
        "API personnalisée",
        "Marque blanche",
        "Account manager dédié",
        "Onboarding personnalisé",
      ],
      cta: "Commencer avec Premium",
      popular: false,
    },
  ];

  return (
    <section id="tarifs" className="section-spacing relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            Tarifs
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Un prix simple,{" "}
            <span className="gradient-text">sans commission</span>
          </h2>
          <p className="mt-6 text-lg text-text-muted leading-relaxed">
            Choisissez le plan adapté à votre activité. Pas de frais cachés, pas
            de commission sur vos courses.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-text-muted"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              annual ? "bg-primary" : "bg-surface-light border border-surface-border"
            }`}
            aria-label="Toggle annual pricing"
          >
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                annual ? "translate-x-7.5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-text-muted"}`}>
            Annuel
          </span>
          {annual && (
            <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full animate-scale-in">
              -20%
            </span>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group hover-card rounded-2xl p-8 ${
                plan.popular
                  ? "glass gradient-border bg-surface/80 scale-[1.02] md:scale-105"
                  : "glass"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-foreground text-xs font-bold uppercase tracking-wider">
                  Le plus populaire
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-muted mb-6">
                  {plan.description}
                </p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-bold gradient-text">
                    {plan.price}€
                  </span>
                  <span className="text-text-muted mb-2">/mois</span>
                </div>
                {annual && (
                  <p className="text-xs text-text-muted mt-2">
                    Facturé {plan.price * 12}€/an
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-primary">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className={`block text-center py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "btn-primary justify-center w-full"
                    : "btn-secondary justify-center w-full"
                }`}
              >
                <span>{plan.cta}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center mt-12 text-sm text-text-muted">
          Essai gratuit 14 jours • Sans engagement • Annulation à tout moment
        </p>
      </div>
    </section>
  );
}
