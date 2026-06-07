"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE — PrivéChauffeur
   ═══════════════════════════════════════════════════════════ */

import Image from "next/image";

// ─── Logo ──────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="relative w-28 h-8 flex items-center">
      <Image src="/logonoir.png" alt="Vroom Logo" fill className="object-contain object-left" priority />
    </Link>
  );
}

// ─── Reveal on scroll ──────────────────────────────────────
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1, rootMargin: "-40px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Check icon ────────────────────────────────────────────
function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-success">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

// ─── Arrow icon ────────────────────────────────────────────
function Arrow() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ═══ NAVBAR ═══ */}
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(250,250,248,.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-6">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {["Fonctionnalités", "Tarifs", "FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-[13px] font-medium text-muted hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary !py-2 !px-5 !text-[13px]">Connexion</Link>
            <Link href="/auth/register" className="btn-primary !py-2 !px-5 !text-[13px]">Commencer</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="fade-up inline-flex items-center gap-2 pill bg-surface border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-[13px] text-muted font-medium">+500 chauffeurs en activité</span>
          </div>

          <h1 className="fade-up text-[clamp(40px,7vw,72px)] font-semibold tracking-[-0.04em] leading-[1.05] mb-6" style={{ animationDelay: ".04s" }}>
            Votre clientèle privée,<br />
            <span className="text-muted">sans intermédiaire.</span>
          </h1>

          <p className="fade-up text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: ".08s" }}>
            Créez votre page de réservation, gérez vos clients et recevez des demandes directes — en quelques minutes.
          </p>

          <div className="fade-up flex flex-wrap justify-center gap-3" style={{ animationDelay: ".12s" }}>
            <Link href="/auth/register" className="btn-primary !py-3.5 !px-8 !text-[15px]">
              Créer mon espace <Arrow />
            </Link>
            <Link href="/chauffeur/jean-dupont" className="btn-secondary !py-3.5 !px-8 !text-[15px]">
              Voir une démo
            </Link>
          </div>

          <p className="fade-up text-sm text-muted mt-6" style={{ animationDelay: ".16s" }}>
            14 jours gratuits · Sans CB · Sans engagement
          </p>
        </div>

      </section>

      {/* ═══ FEATURES ═══ */}
      <Reveal>
        <section id="fonctionnalités" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="section-label mb-4">Fonctionnalités</p>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  Tout pour développer<br />
                  <span className="text-muted">votre activité.</span>
                </h2>
              </div>
              <p className="text-[15px] text-muted max-w-sm leading-relaxed">
                Une plateforme complète pour chauffeurs indépendants. Pas de commission, pas d'intermédiaire.
              </p>
            </div>

            <div className="stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {[
                { title: "Page chauffeur", desc: "Votre vitrine pro en ligne. Photo, bio, véhicule et bouton de réservation.", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
                { title: "Réservation directe", desc: "Vos clients réservent depuis votre page. Confirmez en un clic.", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
                { title: "Disponibilité live", desc: "Activez votre dispo d'un geste. Vos clients voient votre statut en direct.", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
                { title: "CRM intégré", desc: "Historique, préférences et notes pour chaque client.", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
                { title: "Tarifs personnalisés", desc: "Fixez vos prix par trajet, heure ou kilomètre. Transparence totale.", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
                { title: "Notifications", desc: "Alertes instantanées pour chaque nouvelle réservation.", icon: "M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 003.4 0" },
              ].map(({ title, desc, icon }) => (
                <div key={title} className="bg-surface p-8">
                  <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center mb-5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">{title}</h3>
                  <p className="text-[14px] text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ HOW IT WORKS ═══ */}
      <Reveal>
        <section className="py-24 px-6 bg-surface border-y border-border">
          <div className="max-w-6xl mx-auto">
            <p className="section-label mb-4">Comment ça marche</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-16">
              3 étapes, <span className="text-muted">c'est tout.</span>
            </h2>

            <div className="stagger grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: "01", title: "Créez votre compte", desc: "Inscrivez-vous en 2 minutes. Aucune carte bancaire requise." },
                { num: "02", title: "Configurez votre page", desc: "Ajoutez vos informations, votre véhicule et vos tarifs." },
                { num: "03", title: "Partagez votre lien", desc: "Envoyez votre lien à vos clients par SMS ou WhatsApp." },
              ].map(({ num, title, desc }) => (
                <div key={num} className="border-t border-border pt-8">
                  <span className="text-[12px] font-mono text-muted">{num}</span>
                  <h3 className="text-xl font-semibold tracking-tight mt-4 mb-3">{title}</h3>
                  <p className="text-[14px] text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ SOCIAL PROOF ═══ */}
      <Reveal>
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="section-label mb-4">Témoignages</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-16">
              Ils ont repris <span className="text-muted">le contrôle.</span>
            </h2>

            <div className="stagger grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { name: "Karim B.", role: "VTC · Paris", text: "Avant, je payais 25% de commission. Aujourd'hui, je garde tout. Mes clients réservent direct sur ma page." },
                { name: "Stéphane M.", role: "Chauffeur privé · Lyon", text: "Le CRM m'a changé la vie. Je sais ce que mes clients préfèrent, leurs habitudes." },
                { name: "Aïcha D.", role: "VTC · Marseille", text: "Mes clients adorent pouvoir réserver à n'importe quelle heure sans passer par une appli." },
              ].map(t => (
                <div key={t.name} className="card p-7 flex flex-col gap-5">
                  <p className="text-[15px] leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <div className="w-9 h-9 rounded-full bg-surface-alt flex items-center justify-center text-[13px] font-bold">{t.name[0]}</div>
                    <div>
                      <div className="text-[13px] font-semibold">{t.name}</div>
                      <div className="text-[12px] text-muted">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-border text-center">
              {[
                ["500+", "Chauffeurs actifs"],
                ["12K+", "Courses / mois"],
                ["4.8★", "Note moyenne"],
                ["0%", "Commission"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-3xl font-semibold tracking-tight">{v}</div>
                  <div className="text-[12px] text-muted mt-1 font-medium uppercase tracking-wide">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ PRICING ═══ */}
      <Reveal>
        <section id="tarifs" className="py-24 px-6 bg-surface border-y border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="section-label mb-4">Tarifs</p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Un prix simple, <span className="text-muted">sans commission.</span>
              </h2>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted"}`}>Mensuel</span>
              <button
                onClick={() => setAnnual(!annual)}
                className="relative w-11 h-6 rounded-full transition-colors"
                style={{ background: annual ? "var(--foreground)" : "var(--border)" }}
              >
                <div className="absolute top-1 w-4 h-4 rounded-full bg-surface shadow-sm transition-all" style={{ left: annual ? 22 : 4 }} />
              </button>
              <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted"}`}>Annuel</span>
              <span className="text-[11px] font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">−20%</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Starter", price: annual ? 24 : 29, tagline: "Pour démarrer", pop: false, features: ["Page chauffeur publique", "Réservation directe", "Jusqu'à 50 clients", "Notifications email"] },
                { name: "Pro", price: annual ? 65 : 79, tagline: "Le plus populaire", pop: true, features: ["Tout Starter +", "CRM clients complet", "Clients illimités", "Notifications SMS", "Statistiques avancées", "Support prioritaire"] },
                { name: "Premium", price: annual ? 119 : 149, tagline: "Pour les flottes", pop: false, features: ["Tout Pro +", "Multi-véhicules", "Facturation automatique", "API & Marque blanche"] },
              ].map(plan => (
                <div
                  key={plan.name}
                  className="rounded-2xl p-7 transition-shadow"
                  style={{
                    background: plan.pop ? "var(--foreground)" : "var(--background)",
                    color: plan.pop ? "var(--background)" : "var(--foreground)",
                    border: plan.pop ? "none" : "1px solid var(--border)",
                    boxShadow: plan.pop ? "0 16px 40px -8px rgba(0,0,0,.25)" : "none",
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">{plan.name}</h3>
                      <p className="text-[12px] mt-1" style={{ opacity: .6 }}>{plan.tagline}</p>
                    </div>
                    {plan.pop && <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />}
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-semibold tracking-tight">{plan.price}€</span>
                    <span className="text-sm" style={{ opacity: .5 }}>/mois</span>
                  </div>
                  {annual && <p className="text-[11px] font-mono mb-6" style={{ opacity: .5 }}>Facturé annuellement</p>}
                  {!annual && <div className="h-4 mb-6" />}

                  <Link
                    href="/auth/register"
                    className="block text-center w-full py-3 text-sm font-semibold rounded-lg transition-opacity hover:opacity-90"
                    style={{
                      background: plan.pop ? "var(--background)" : "var(--foreground)",
                      color: plan.pop ? "var(--foreground)" : "var(--background)",
                    }}
                  >
                    Commencer
                  </Link>

                  <div className="mt-6 pt-5 flex flex-col gap-2.5" style={{ borderTop: `1px solid ${plan.pop ? "rgba(255,255,255,.12)" : "var(--border)"}` }}>
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2.5 text-[13px]">
                        {!f.includes("+") && <Check />}
                        {f.includes("+") && <span className="w-3.5" />}
                        <span className={f.includes("+") ? "font-semibold" : ""} style={{ opacity: f.includes("+") ? .7 : 1 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ CTA ═══ */}
      <Reveal>
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-foreground text-background rounded-3xl p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,193,103,.15),transparent_60%)]" />
              <div className="relative">
                <p className="section-label !text-background/40 mb-6">Commencez aujourd'hui</p>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                  Prêt à reprendre<br />le contrôle ?
                </h2>
                <p className="text-[16px] text-background/60 max-w-md mx-auto mb-10 leading-relaxed">
                  Rejoignez +500 chauffeurs qui ont repris le contrôle — sans commission, sans intermédiaire.
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 bg-background text-foreground font-semibold text-[15px] px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Créer mon espace <Arrow />
                </Link>
                <p className="text-[12px] text-background/40 mt-8 font-mono">14 jours gratuits · Sans CB</p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-[13px] text-muted">© 2026 Vroom. Tous droits réservés.</p>
          <div className="flex gap-6">
            {["CGV", "Confidentialité", "Contact"].map(l => (
              <a key={l} href="#" className="text-[13px] text-muted hover:text-foreground transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
