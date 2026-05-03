import { mockAvailability } from "./mockAvailability";

export const mockPublicDriver = {
  id: "driver-123",
  slug: "jean-dupont",
  publicName: "Jean Dupont VTC",
  firstName: "Jean",
  city: "Paris",
  shortDescription: "Votre chauffeur privé de confiance sur Paris et Île-de-France.",
  longDescription: "Chauffeur privé indépendant depuis plus de 5 ans, je vous accompagne dans tous vos déplacements professionnels et personnels avec discrétion, ponctualité et courtoisie. Je mets un point d'honneur à offrir un service irréprochable à chacun de mes passagers.",
  phone: "+33612345678",
  whatsapp: "33612345678",
  profilePhotoUrl: null, // Simulate no photo for fallback initials
  coverPhotoUrl: null,
  rating: 4.9,
  reviewCount: 128,
  vehicle: {
    brand: "Mercedes-Benz",
    model: "Classe E",
    color: "Noir obsidienne",
    seats: 4,
    options: ["Climatisation multi-zone", "Wi-Fi à bord", "Chargeurs multi-ports", "Bouteilles d'eau", "Presse du jour", "Siège enfant (sur demande)"]
  },
  availability: mockAvailability,
  serviceAreas: ["Paris intramuros", "Aéroport CDG", "Aéroport Orly", "La Défense", "Versailles", "Disneyland Paris"],
  services: [
    { id: "s1", title: "Transferts Aéroports", description: "Accueil personnalisé avec pancarte, suivi du vol en temps réel." },
    { id: "s2", title: "Gares Parisiennes", description: "Dépose minute ou accueil en tête de train sans stress." },
    { id: "s3", title: "Mise à disposition", description: "Pour vos rendez-vous d'affaires, shopping ou événements (à l'heure)." },
    { id: "s4", title: "Longues distances", description: "Trajets vers la province ou l'étranger dans le plus grand confort." }
  ],
  fixedRoutes: [
    { id: "fr1", title: "Forfait Aéroport CDG", pickup: "Paris (Tous arrondissements)", dropoff: "Aéroport Roissy-Charles de Gaulle", price: 65, description: "Tarif fixe sans surprise, incluant les bagages et l'accueil." },
    { id: "fr2", title: "Forfait Aéroport Orly", pickup: "Paris (Tous arrondissements)", dropoff: "Aéroport de Paris-Orly", price: 55, description: "Transfert direct vers ou depuis Orly." },
    { id: "fr3", title: "Forfait La Défense", pickup: "Paris Centre", dropoff: "Quartier d'affaires La Défense", price: 45, description: "Idéal pour vos rendez-vous professionnels matinaux." }
  ],
  reviews: [
    { id: "r1", author: "Marc L.", rating: 5, date: "Il y a 2 jours", comment: "Excellent service. Jean est ponctuel, le véhicule est impeccable et la conduite est très souple. Je recommande vivement." },
    { id: "r2", author: "Sophie T.", rating: 5, date: "La semaine dernière", comment: "Parfait pour mon transfert vers Orly tôt le matin. Chauffeur très agréable." },
    { id: "r3", author: "Antoine D.", rating: 4, date: "Il y a 1 mois", comment: "Très bonne prestation globale pour un trajet professionnel." }
  ]
};
