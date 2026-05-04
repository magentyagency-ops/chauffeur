"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Comment réserver une course ?",
    a: "Remplissez le formulaire de réservation directement sur cette page avec vos adresses de départ et d'arrivée, puis vos coordonnées. Votre chauffeur vous recontactera dans les minutes qui suivent pour confirmer."
  },
  {
    q: "Est-ce que je peux réserver pour plus tard ?",
    a: "Oui, absolument ! Lors de la réservation, choisissez l'option « Plus tard » et sélectionnez la date et l'heure souhaitées. Vous pouvez réserver jusqu'à 30 jours à l'avance."
  },
  {
    q: "Comment savoir si le chauffeur est disponible ?",
    a: "Le statut de disponibilité est affiché en temps réel en haut de cette page. Un badge vert signifie que votre chauffeur peut venir vous chercher immédiatement."
  },
  {
    q: "Est-ce que je peux payer par carte ?",
    a: "Oui, le paiement par carte bancaire est accepté directement à bord du véhicule. Vous pouvez également régler en espèces."
  },
  {
    q: "Est-ce que je peux demander une facture ?",
    a: "Bien sûr. Une facture professionnelle peut vous être envoyée par email après chaque course, sur simple demande."
  },
  {
    q: "Le prix affiché est-il définitif ?",
    a: "Pour les trajets fixes (forfaits), le prix est garanti et ne changera pas. Pour les trajets à la demande, votre chauffeur vous communiquera un tarif avant de confirmer la course."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-28 space-y-12 animate-fade-up">
      <div>
        <h2 className="display text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-3">Questions fréquentes</h2>
        <p className="text-text-muted font-medium text-lg italic display">Tout ce que vous devez savoir avant de réserver.</p>
      </div>

      <div className="card !p-0 border-surface-border overflow-hidden divide-y divide-surface-border">
        {faqs.map((faq, i) => (
          <div key={i} className="group">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between gap-6 px-8 py-6 text-left transition-colors hover:bg-surface-light"
            >
              <span className="display text-lg md:text-xl font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-snug pr-4">{faq.q}</span>
              <div className={`w-8 h-8 rounded-full border border-surface-border flex items-center justify-center shrink-0 transition-all duration-500 ${
                openIndex === i ? "rotate-45 bg-foreground border-foreground text-background" : "text-text-muted"
              }`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
              <div className="px-8 pb-8 text-base font-medium text-text-muted leading-relaxed max-w-3xl">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
