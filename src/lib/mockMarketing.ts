export type PromoCode = {
  id: string;
  code: string;
  discountValue: number;
  discountType: "percent" | "fixed";
  validUntil: string | null;
  maxUses: number | null;
  currentUses: number;
  isActive: boolean;
};

export type LoyaltyProgram = {
  isActive: boolean;
  requiredRides: number;
  maxValue: number;
};

export type VipSubscription = {
  id: string;
  name: string;
  price: number;
  features: string[];
  isActive: boolean;
};

export type MarketingState = {
  promos: PromoCode[];
  loyalty: LoyaltyProgram;
  subscriptions: VipSubscription[];
};

const DEFAULT_MARKETING_STATE: MarketingState = {
  promos: [
    {
      id: "promo-1",
      code: "BIENVENUE10",
      discountValue: 10,
      discountType: "percent",
      validUntil: null,
      maxUses: 0,
      currentUses: 12,
      isActive: true,
    },
    {
      id: "promo-2",
      code: "PARIS2024",
      discountValue: 15,
      discountType: "fixed",
      validUntil: "2024-09-01",
      maxUses: 50,
      currentUses: 45,
      isActive: false,
    }
  ],
  loyalty: {
    isActive: true,
    requiredRides: 10,
    maxValue: 50,
  },
  subscriptions: [
    {
      id: "sub-1",
      name: "Pack Business",
      price: 150,
      features: [
        "-20% sur toutes les courses",
        "Priorité absolue de réservation",
        "Facturation mensuelle globale"
      ],
      isActive: true,
    },
    {
      id: "sub-2",
      name: "Pack Aéroport",
      price: 80,
      features: [
        "2 transferts aéroport inclus",
        "-10% sur les courses supplémentaires"
      ],
      isActive: true,
    }
  ]
};

export function getMarketingState(): MarketingState {
  if (typeof window === "undefined") return DEFAULT_MARKETING_STATE;
  const stored = localStorage.getItem("privechauffeur_marketing");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse marketing state", e);
    }
  }
  return DEFAULT_MARKETING_STATE;
}

export function saveMarketingState(state: MarketingState) {
  if (typeof window !== "undefined") {
    localStorage.setItem("privechauffeur_marketing", JSON.stringify(state));
  }
}
