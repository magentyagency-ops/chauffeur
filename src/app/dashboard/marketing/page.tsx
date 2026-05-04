"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { 
  getMarketingState, 
  saveMarketingState, 
  PromoCode, 
  LoyaltyProgram, 
  VipSubscription,
  MarketingState
} from "@/lib/mockMarketing";

const TABS = [
  { id: "promos", label: "Codes Promo & Offres" },
  { id: "loyalty", label: "Fidélité" },
  { id: "subscriptions", label: "Abonnements VIP" },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("promos");
  const [state, setState] = useState<MarketingState | null>(null);

  useEffect(() => {
    setState(getMarketingState());
  }, []);

  const updateState = (newState: MarketingState) => {
    setState(newState);
    saveMarketingState(newState);
  };

  if (!state) return null;

  return (
    <>
      <DashboardHeader title="Marketing & Fidélisation" />

      <main className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8 pb-32">
        <section>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Boostez vos revenus</h2>
          <p className="text-muted text-[15px]">
            Créez des offres attractives, fidélisez vos clients réguliers et générez des revenus récurrents.
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="flex bg-surface-alt p-1 rounded-xl border border-border w-full md:w-fit overflow-x-auto">
          {TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${
                activeTab === tab.id 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up">
          {activeTab === "promos" && <PromosSection promos={state.promos} onUpdate={(promos) => updateState({ ...state, promos })} />}
          {activeTab === "loyalty" && <LoyaltySection loyalty={state.loyalty} onUpdate={(loyalty) => updateState({ ...state, loyalty })} />}
          {activeTab === "subscriptions" && <SubscriptionsSection subscriptions={state.subscriptions} onUpdate={(subscriptions) => updateState({ ...state, subscriptions })} />}
        </div>
      </main>
    </>
  );
}

function PromosSection({ promos, onUpdate }: { promos: PromoCode[], onUpdate: (p: PromoCode[]) => void }) {
  const [showNewPromo, setShowNewPromo] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newVal, setNewVal] = useState("");
  const [newType, setNewType] = useState<"percent" | "fixed">("percent");
  const [newDate, setNewDate] = useState("");
  const [newMax, setNewMax] = useState("0");

  const handleCreate = () => {
    if (!newCode.trim() || !newVal) return;
    const promo: PromoCode = {
      id: "promo-" + Date.now(),
      code: newCode.trim().toUpperCase(),
      discountValue: Number(newVal),
      discountType: newType,
      validUntil: newDate || null,
      maxUses: Number(newMax) || 0,
      currentUses: 0,
      isActive: true,
    };
    onUpdate([promo, ...promos]);
    setShowNewPromo(false);
    setNewCode("");
    setNewVal("");
    setNewDate("");
    setNewMax("0");
  };

  const togglePromo = (id: string) => {
    onUpdate(promos.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const deletePromo = (id: string) => {
    onUpdate(promos.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight">Vos offres</h3>
        <button onClick={() => setShowNewPromo(!showNewPromo)} className="btn-primary !py-2 !px-4 !text-[12px]">
          {showNewPromo ? "Annuler" : "+ Nouvelle offre"}
        </button>
      </div>

      {showNewPromo && (
        <div className="card p-6 border-foreground/20 bg-foreground/[0.02] space-y-6 animate-fade-in-up">
          <h4 className="font-bold text-[15px]">Créer un code promotionnel</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">Code (ex: ETE24)</label>
              <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="SUMMER2024" className="input uppercase" />
            </div>
            <div className="space-y-2">
              <label className="label">Réduction</label>
              <div className="flex gap-2">
                <input type="number" value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="15" className="input flex-1" />
                <select value={newType} onChange={e => setNewType(e.target.value as "percent" | "fixed")} className="input !w-auto bg-surface-alt">
                  <option value="percent">%</option>
                  <option value="fixed">€</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">Valable jusqu'au</label>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="input" />
            </div>
            <div className="space-y-2">
              <label className="label">Utilisations max (0 = illimité)</label>
              <input type="number" value={newMax} onChange={e => setNewMax(e.target.value)} placeholder="50" className="input" />
            </div>
          </div>
          <button onClick={handleCreate} disabled={!newCode.trim() || !newVal} className="btn-primary w-full md:w-auto">Créer l'offre</button>
        </div>
      )}

      {promos.length === 0 && !showNewPromo && (
        <div className="card p-10 text-center border-dashed">
          <p className="text-muted text-sm">Vous n'avez pas encore de code promo actif.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promos.map(promo => (
          <div key={promo.id} className={`card p-5 ${promo.isActive ? 'border-success/30 bg-success/[0.02]' : 'opacity-70 grayscale'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold text-lg font-mono ${promo.isActive ? 'text-success' : ''}`}>{promo.code}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${promo.isActive ? 'bg-success/20 text-success' : 'bg-surface-alt text-muted border border-border'}`}>
                    {promo.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-[13px] text-muted">
                  -{promo.discountValue}{promo.discountType === 'percent' ? '%' : '€'} 
                  {promo.validUntil ? ` jusqu'au ${new Date(promo.validUntil).toLocaleDateString('fr-FR')}` : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold tracking-tight">{promo.currentUses}{promo.maxUses ? `/${promo.maxUses}` : ''}</div>
                <div className="text-[10px] text-muted uppercase tracking-widest">Utilisés</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary flex-1 !py-2 !text-[12px]" onClick={() => navigator.clipboard.writeText(`Copiez ce code lors de votre réservation : ${promo.code}`)}>
                Copier
              </button>
              <button 
                onClick={() => togglePromo(promo.id)}
                className={`btn-secondary !py-2 !px-3 ${promo.isActive ? '!text-error hover:!bg-error/10 hover:!border-error/30' : ''}`}
              >
                {promo.isActive ? 'Désactiver' : 'Réactiver'}
              </button>
              {!promo.isActive && (
                <button onClick={() => deletePromo(promo.id)} className="btn-secondary !py-2 !px-3 !text-error hover:!bg-error/10 hover:!border-error/30">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoyaltySection({ loyalty, onUpdate }: { loyalty: LoyaltyProgram, onUpdate: (l: LoyaltyProgram) => void }) {
  const [active, setActive] = useState(loyalty.isActive);
  const [rides, setRides] = useState(loyalty.requiredRides.toString());
  const [maxValue, setMaxValue] = useState(loyalty.maxValue.toString());
  const [saved, setSaved] = useState(false);

  const toggleActive = () => {
    const newState = !active;
    setActive(newState);
    onUpdate({ ...loyalty, isActive: newState });
  };

  const handleSave = () => {
    onUpdate({
      ...loyalty,
      isActive: active,
      requiredRides: Number(rides) || 10,
      maxValue: Number(maxValue) || 50,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${active ? 'bg-success animate-pulse' : 'bg-muted'}`} />
            <h3 className="text-xl font-bold tracking-tight">Programme de fidélité</h3>
          </div>
          <p className="text-[14px] text-muted max-w-lg">
            Récompensez vos clients réguliers automatiquement. Ce programme s'affiche sur votre profil public pour encourager la fidélité.
          </p>
        </div>
        <div className="relative inline-flex items-center cursor-pointer shrink-0" onClick={toggleActive}>
          <input type="checkbox" className="sr-only peer" checked={active} readOnly />
          <div className="w-12 h-7 bg-surface-alt border border-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-muted after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-success peer-checked:after:bg-white peer-checked:border-success"></div>
        </div>
      </div>

      <div className={`space-y-6 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <h4 className="text-lg font-bold tracking-tight">Configuration de la récompense</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 border-foreground/30 ring-2 ring-foreground/5 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
              </div>
              <div className="w-5 h-5 rounded-full border-4 border-foreground bg-background" />
            </div>
            <h5 className="font-bold text-[15px] mb-1">Courses gratuites</h5>
            <p className="text-[13px] text-muted">
              Au bout de X courses achetées, offrez 1 course d'une valeur maximale de Y €.
            </p>
          </div>
          
          <div className="card p-5 hover:border-border-hover transition-colors opacity-50 cursor-not-allowed">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-surface-alt border border-border flex items-center justify-center text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-border bg-surface-alt" />
            </div>
            <h5 className="font-bold text-[15px] mb-1">Système à points</h5>
            <p className="text-[13px] text-muted">
              1€ dépensé = X points. Y points = Z€ de réduction.
            </p>
            <div className="mt-3 inline-block px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold rounded uppercase">Prochainement</div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="label">Courses requises</label>
              <div className="flex items-center gap-3">
                <input type="number" value={rides} onChange={e => setRides(e.target.value)} className="input" />
                <span className="text-sm font-medium">courses</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">Valeur maximale offerte</label>
               <div className="flex items-center gap-3">
                <input type="number" value={maxValue} onChange={e => setMaxValue(e.target.value)} className="input" />
                <span className="text-sm font-medium">€</span>
              </div>
            </div>
          </div>
          <button onClick={handleSave} className="btn-primary">
            {saved ? "✔ Enregistré" : "Enregistrer les règles"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionsSection({ subscriptions, onUpdate }: { subscriptions: VipSubscription[], onUpdate: (s: VipSubscription[]) => void }) {
  
  const toggleSub = (id: string) => {
    onUpdate(subscriptions.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const createFromTemplate = (name: string, price: number, features: string[]) => {
    const newSub: VipSubscription = {
      id: "sub-" + Date.now(),
      name,
      price,
      features,
      isActive: true
    };
    onUpdate([...subscriptions, newSub]);
  };

  const deleteSub = (id: string) => {
    onUpdate(subscriptions.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="p-6 md:p-8 border border-border rounded-[14px] bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-accent/20 text-accent border border-accent/30 rounded-lg text-[11px] font-bold uppercase tracking-widest mb-4">
            Bêta Test
          </div>
          <h3 className="text-2xl font-bold tracking-tight mb-2">Abonnements VIP pour vos clients</h3>
          <p className="text-[15px] text-background/70 max-w-lg mb-6 leading-relaxed">
            Créez une source de revenus récurrents. Proposez à vos clients réguliers ou aux entreprises un abonnement mensuel en échange d'avantages exclusifs.
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold tracking-tight mb-4">Vos forfaits actifs</h4>
        {subscriptions.length === 0 ? (
          <div className="card p-8 text-center border-dashed text-muted text-sm">
            Vous n'avez pas encore d'abonnement actif.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {subscriptions.map(sub => (
              <div key={sub.id} className={`card p-5 flex flex-col h-full ${!sub.isActive ? 'opacity-60 grayscale' : 'border-accent/20 bg-accent/[0.02]'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h5 className="font-bold text-[16px]">{sub.name}</h5>
                  <button onClick={() => deleteSub(sub.id)} className="text-error opacity-50 hover:opacity-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
                <div className={`text-2xl font-bold mb-4 ${sub.isActive ? 'text-accent' : ''}`}>{sub.price}€ <span className="text-sm font-medium text-muted">/ mois</span></div>
                <ul className="space-y-2 text-[13px] text-muted mb-6 flex-1">
                  {sub.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`${sub.isActive ? 'text-accent' : 'text-muted'} shrink-0 mt-0.5`}><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 !text-[12px]">Copier le lien d'inscription</button>
                  <button onClick={() => toggleSub(sub.id)} className="btn-secondary !text-[12px] !px-3">
                    {sub.isActive ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h4 className="text-lg font-bold tracking-tight mb-4 mt-8">Créer à partir d'un modèle</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 flex flex-col h-full hover:border-accent/20 transition-colors">
            <h5 className="font-bold text-[16px] mb-1">Pack Business</h5>
            <div className="text-2xl font-bold mb-4">150€ <span className="text-sm font-medium text-muted">/ mois</span></div>
            <ul className="space-y-2 text-[13px] text-muted mb-6 flex-1">
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                -20% sur toutes les courses
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                Priorité absolue de réservation
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                Facturation mensuelle globale
              </li>
            </ul>
            <button 
              onClick={() => createFromTemplate("Pack Business", 150, ["-20% sur toutes les courses", "Priorité absolue de réservation", "Facturation mensuelle globale"])}
              className="btn-secondary w-full !text-[12px]"
            >
              Ajouter ce modèle
            </button>
          </div>

          <div className="card p-5 flex flex-col h-full hover:border-accent/20 transition-colors">
            <h5 className="font-bold text-[16px] mb-1">Pack Aéroport</h5>
            <div className="text-2xl font-bold mb-4">80€ <span className="text-sm font-medium text-muted">/ mois</span></div>
            <ul className="space-y-2 text-[13px] text-muted mb-6 flex-1">
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                2 transferts aéroport inclus
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                -10% sur les courses supplémentaires
              </li>
            </ul>
            <button 
              onClick={() => createFromTemplate("Pack Aéroport", 80, ["2 transferts aéroport inclus", "-10% sur les courses supplémentaires"])}
              className="btn-secondary w-full !text-[12px]"
            >
              Ajouter ce modèle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
