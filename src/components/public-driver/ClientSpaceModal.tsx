"use client";

import { useState } from "react";
import { LoyaltyProgram } from "@/lib/mockMarketing";

type ClientSpaceModalProps = {
  onClose: () => void;
  loyalty: LoyaltyProgram;
};

export default function ClientSpaceModal({ onClose, loyalty }: ClientSpaceModalProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // Mock data for the client's progress
  const currentRides = 7;
  const isVip = true;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLogged(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="card p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {!isLogged ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Espace Client</h3>
              <p className="text-[13px] text-muted mt-2">Entrez votre numéro de téléphone pour voir vos avantages et votre fidélité.</p>
            </div>

            <div className="space-y-2">
              <label className="label">Numéro de téléphone</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="06 12 34 56 78" 
                className="input" 
                autoFocus 
              />
            </div>

            <button type="submit" disabled={phone.length < 10 || loading} className="btn-primary w-full !py-3">
              {loading ? "Connexion..." : "Accéder à mon espace"}
            </button>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-bold tracking-tight">Bonjour !</h3>
              <p className="text-[13px] text-muted mt-1">Voici votre statut avec votre chauffeur.</p>
            </div>

            {/* Loyalty Progress */}
            <div className="space-y-3">
              <div className="flex items-end justify-between mb-1">
                <h4 className="font-bold text-[15px]">Programme Fidélité</h4>
                <span className="text-[12px] font-bold text-accent">{currentRides} / {loyalty.requiredRides} courses</span>
              </div>
              
              <div className="h-3 bg-surface-alt rounded-full overflow-hidden border border-border">
                <div 
                  className="h-full bg-accent transition-all duration-1000 ease-out" 
                  style={{ width: `${(currentRides / loyalty.requiredRides) * 100}%` }}
                />
              </div>
              
              <p className="text-[12px] text-muted">
                Encore <strong className="text-foreground">{loyalty.requiredRides - currentRides} courses</strong> pour débloquer votre course gratuite (valeur max {loyalty.maxValue}€).
              </p>
            </div>

            {/* Subscriptions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="font-bold text-[15px]">Abonnements VIP</h4>
              
              {isVip ? (
                <div className="card p-4 border-success/30 bg-success/[0.02] flex items-start gap-3">
                   <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                   <div>
                     <div className="font-bold text-[13px] text-success mb-0.5">Pack Business Actif</div>
                     <p className="text-[11px] text-muted leading-tight">
                       Vos avantages (-20% et priorité) s'appliqueront automatiquement lors de votre prochaine réservation.
                     </p>
                   </div>
                </div>
              ) : (
                <div className="card p-4 text-center border-dashed">
                  <p className="text-[12px] text-muted">Vous n'avez pas d'abonnement actif.</p>
                </div>
              )}
            </div>

            <button onClick={onClose} className="btn-secondary w-full !py-3">
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
