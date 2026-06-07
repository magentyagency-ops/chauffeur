'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création de la session de paiement.');
      }
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Abonnement Premium
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
          Débloquez toutes les fonctionnalités de la plateforme avec notre abonnement unique et complet.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md mx-auto shadow-2xl relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Mensuel</h2>
            <div className="mt-4 flex items-center justify-center">
              <span className="px-3 flex items-start text-5xl tracking-tight text-white">
                <span className="mt-2 mr-2 text-3xl font-medium">€</span>
                <span className="font-extrabold">29</span>
              </span>
              <span className="text-xl font-medium text-gray-400">/mois</span>
            </div>
          </div>

          <ul className="mt-8 space-y-4 text-left">
            {[
              'Tableau de bord complet',
              'Profil Chauffeur public',
              'Gestion des réservations',
              'QR Codes personnalisés',
              'Statistiques détaillées',
              'Support prioritaire',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-3 text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Redirection...' : "S'abonner maintenant"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
