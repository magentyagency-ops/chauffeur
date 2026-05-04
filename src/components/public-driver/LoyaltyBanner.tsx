"use client";

import { useEffect, useState } from "react";
import { getMarketingState, LoyaltyProgram } from "@/lib/mockMarketing";
import ClientSpaceModal from "./ClientSpaceModal";

export default function LoyaltyBanner() {
  const [loyalty, setLoyalty] = useState<LoyaltyProgram | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const state = getMarketingState();
    if (state && state.loyalty && state.loyalty.isActive) {
      setLoyalty(state.loyalty);
    }
  }, []);

  if (!loyalty) return null;

  return (
    <>
      <div className="card p-5 border-accent/30 bg-accent/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[15px] mb-0.5">Programme de fidélité actif</h3>
            <p className="text-[13px] text-muted leading-snug">
              Vos {loyalty.requiredRides}ème courses sont <strong className="text-foreground">offertes</strong> (jusqu'à {loyalty.maxValue}€). Identifiez-vous lors de la réservation !
            </p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-secondary !py-2 !px-4 !text-[12px] w-full sm:w-auto shrink-0 whitespace-nowrap">
          Mon espace client
        </button>
      </div>

      {showModal && <ClientSpaceModal onClose={() => setShowModal(false)} loyalty={loyalty} />}
    </>
  );
}
