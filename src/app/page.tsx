"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Logo({ size = "md", color }: { size?: "sm" | "md", color?: string }) {
  const big = size !== "sm";
  const fg = color || "var(--foreground)";
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="flex items-center justify-center shrink-0 relative" style={{ width: big ? 30 : 24, height: big ? 30 : 24, borderRadius: "50%", background: fg }}>
        <span className="display-font italic leading-none mt-0.5" style={{ fontSize: big ? 16 : 13, fontWeight: 500, color: "var(--background)" }}>P</span>
      </div>
      <span style={{ fontSize: big ? 17 : 15, fontWeight: 600, letterSpacing: "-.02em", color: fg }}>Privé<span style={{ fontWeight: 400, opacity: .65 }}>chauffeur</span></span>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "", style = {} }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.12, rootMargin: "-30px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(28px)",
        transition: `opacity .85s ${delay}s cubic-bezier(.16, 1, .3, 1), transform .85s ${delay}s cubic-bezier(.16, 1, .3, 1)`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Fonctionnalités", "Comment ça marche", "Tarifs", "FAQ"];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "color-mix(in srgb, var(--background) 85%, transparent)" : "transparent",
        backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all .35s cubic-bezier(.16, 1, .3, 1)",
        padding: "0 40px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            {navLinks.map(l => <span key={l} className="text-sm font-medium text-muted hover:text-foreground cursor-pointer transition-colors">{l}</span>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/auth/login" className="btn-secondary" style={{ padding: "8px 20px", fontSize: 14 }}>Connexion</Link>
            <Link href="/auth/register" className="btn-primary" style={{ padding: "8px 20px", fontSize: 14 }}>Commencer</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "160px 40px 80px", textAlign: "center" }}>
        <div aria-hidden="true" style={{
          position: "absolute", top: 40, left: "50%", transform: "translateX(-50%)",
          width: 800, height: 600, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(ellipse at center, var(--success)10 0%, transparent 60%)`,
          filter: "blur(40px)"
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 16px 7px 8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, marginBottom: 36, boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "var(--success)", color: "#fff" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>+500 chauffeurs déjà en activité</span>
          </div>

          <h1 className="fade-up text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-none mb-7" style={{ animationDelay: ".05s" }}>
            <span className="display-font italic font-normal">Votre</span> clientèle privée,<br />
            <span className="text-muted">sans </span><span className="display-font italic font-normal text-muted">intermédiaire.</span>
          </h1>

          <p className="fade-up text-lg md:text-xl text-muted max-w-2xl mx-auto mb-11 leading-relaxed" style={{ animationDelay: ".1s" }}>
            Créez votre page de réservation, gérez vos clients et recevez des demandes directes — en quelques minutes.
          </p>

          <div className="fade-up flex flex-wrap justify-center gap-3" style={{ animationDelay: ".15s" }}>
            <Link href="/auth/register" className="btn-primary" style={{ padding: "15px 32px" }}>
              Créer mon espace
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/chauffeur/jean-dupont" className="btn-secondary" style={{ padding: "15px 32px" }}>
              Voir une démo client
            </Link>
          </div>

          <div className="fade-up mt-6 text-sm text-muted" style={{ animationDelay: ".18s" }}>
            <span className="font-mono">14 jours gratuits</span> · Sans CB · Sans engagement
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="fade-up mt-24 relative" style={{ animationDelay: ".2s" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 6, maxWidth: 920, margin: "0 auto", boxShadow: "0 30px 60px -20px rgba(10,10,10,.18), 0 8px 24px -8px rgba(10,10,10,.08)" }}>
            <div style={{ borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57","#ffbd2e","#28c840"].map((c,i) => <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ flex: 1, background: "var(--surface-light)", borderRadius: 6, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8, maxWidth: 320, margin: "0 auto" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>app.privechauffeur.com</span>
              </div>
              <div style={{ width: 60 }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0, borderRadius: "0 0 12px 12px", overflow: "hidden", background: "var(--background)", minHeight: 320 }}>
              <div className="hidden md:flex flex-col gap-1 p-3" style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
                <div style={{ padding: "0 8px 14px", fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>Espace pro</div>
                {[
                  { label: "Accueil", icon: "M3 12l2-2 7-7 7 7 2 2v9a2 2 0 0 1-2 2h-3v-7H10v7H7a2 2 0 0 1-2-2v-9z" },
                  { label: "Réservations", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" },
                  { label: "Clients", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
                ].map((item, i) => (
                  <div key={item.label} style={{ padding: "8px 10px", borderRadius: 6, background: i === 0 ? "var(--surface-light)" : "transparent", color: i === 0 ? "var(--foreground)" : "var(--muted)", fontSize: 13, fontWeight: i === 0 ? 600 : 500, display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                    {item.label}
                  </div>
                ))}
              </div>
              <div className="p-6 text-left">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div className="display-font" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 4 }}>Bonjour Jean</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Aujourd'hui · 3 courses prévues</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "var(--surface)", color: "var(--success)", border: "1px solid var(--border)", fontSize: 12, fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
                    En ligne
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  {[["5","Demandes","var(--foreground)"],["3","Confirmées","var(--success)"],["42","Clients","var(--foreground)"],["285€","Aujourd'hui","var(--foreground)"]].map(([v,l,c]) => (
                    <div key={l} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                      <div className="display-font" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", color: c }}>{v}</div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2, fontWeight: 500 }}>{l}</div>
                    </div>
                  ))}
                </div>
                {/* Booking row */}
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>S</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>Sophie M. · 14:30</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>CDG T2E → Hôtel Ritz</div>
                  </div>
                  <div className="display-font" style={{ fontSize: 16, fontWeight: 500 }}>85€</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <Reveal><section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 40px" }}>
        <div style={{ marginBottom: 64, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 24, height: 1, background: "var(--muted)" }} />
              Fonctionnalités
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
              Tout pour développer<br />
              <span className="display-font italic font-normal text-muted">votre activité.</span>
            </h2>
          </div>
          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 360, lineHeight: 1.6 }}>
            Une plateforme complète pensée pour les chauffeurs indépendants. Pas de commission, pas d'intermédiaire.
          </p>
        </div>
        <div className="stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--surface)]">
          {[
            { icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", title: "Page chauffeur", desc: "Votre vitrine pro en ligne. Photo, bio, véhicule, avis et bouton de réservation." },
            { icon: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", title: "Réservation directe", desc: "Vos clients réservent depuis votre page. Confirmez en un clic, sans intermédiaire." },
            { icon: "M22 12h-4l-3 9L9 3l-3 9H2", title: "Disponibilité temps réel", desc: "Activez ou désactivez votre dispo d'un geste. Vos clients voient votre statut en direct." },
            { icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75", title: "CRM intégré", desc: "Historique, préférences, coordonnées et notes pour chaque client privé." },
            { icon: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", title: "Tarifs personnalisés", desc: "Fixez vos propres prix par trajet, heure ou kilomètre. Transparence totale." },
            { icon: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a1.94 1.94 0 0 0 3.4 0", title: "Notifications", desc: "Alertes instantanées pour chaque nouvelle réservation ou message client." },
          ].map(({ icon, title, desc }, i) => (
            <div key={title} className="p-8 border-b border-[var(--border)] lg:border-r" style={{ borderRightWidth: (i % 3 !== 2) ? "1px" : "0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "var(--foreground)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {icon.split(" M").map((seg, k) => <path key={k} d={k === 0 ? seg : "M" + seg} />)}
                </svg>
              </div>
              <div className="display-font text-xl font-medium mb-2 tracking-tight">{title}</div>
              <div style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section></Reveal>

      {/* HOW IT WORKS */}
      <Reveal><section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 40px" }}>
        <div style={{ marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 24, height: 1, background: "var(--muted)" }} />
            Comment ça marche
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight max-w-3xl">
            Lancez-vous en <span className="display-font italic font-normal">3 étapes</span>.
          </h2>
        </div>
        <div className="stagger grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "01", title: "Créez votre compte", desc: "Inscrivez-vous en 2 minutes. Aucune carte bancaire requise." },
            { num: "02", title: "Configurez votre page", desc: "Ajoutez vos informations, votre véhicule et vos tarifs." },
            { num: "03", title: "Partagez votre lien", desc: "Envoyez votre lien à vos clients par SMS ou WhatsApp." },
          ].map(({ num, title, desc }, i) => (
            <div key={num} style={{ display: "flex", flexDirection: "column", gap: 16, padding: "32px 28px 32px 0", borderTop: "1px solid var(--border)", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span className="font-mono text-xs font-medium text-muted">{num}</span>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--foreground)", color: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
              </div>
              <div className="display-font text-2xl font-medium tracking-tight leading-snug">{title}</div>
              <div style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section></Reveal>

      {/* PRICING */}
      <Reveal><section style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 40px" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Tarifs</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
            Un prix simple,<br /><span className="display-font italic font-normal">sans commission.</span>
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          <span style={{ fontSize: 14, color: !annualBilling ? "var(--foreground)" : "var(--muted)", fontWeight: 500 }}>Mensuel</span>
          <div
            onClick={() => setAnnualBilling(!annualBilling)}
            style={{ width: 44, height: 24, borderRadius: 12, background: annualBilling ? "var(--foreground)" : "var(--surface-light)", border: "1px solid var(--border)", cursor: "pointer", position: "relative", transition: "background .25s" }}
          >
            <div style={{ position: "absolute", top: 2, left: annualBilling ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "var(--surface)", transition: "left .25s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </div>
          <span style={{ fontSize: 14, color: annualBilling ? "var(--foreground)" : "var(--muted)", fontWeight: 500 }}>Annuel</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--success)", background: "color-mix(in srgb, var(--success) 15%, transparent)", padding: "3px 10px", borderRadius: 100, opacity: annualBilling ? 1 : 0.5, transition: "opacity .25s" }}>−20%</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            { name: "Starter", price: annualBilling ? 24 : 29, pop: false, tagline: "Pour démarrer", features: ["Page chauffeur publique", "Réservation directe", "Jusqu'à 50 clients", "Notifications email"] },
            { name: "Pro", price: annualBilling ? 65 : 79, pop: true, tagline: "Le plus populaire", features: ["Tout Starter, et :", "CRM clients complet", "Clients illimités", "Notifications SMS", "Statistiques avancées", "Support prioritaire"] },
            { name: "Premium", price: annualBilling ? 119 : 149, pop: false, tagline: "Pour les flottes", features: ["Tout Pro, et :", "Multi-véhicules", "Facturation automatique", "API & Marque blanche"] },
          ].map(({ name, price, pop, tagline, features }) => (
            <div key={name} style={{
              padding: pop ? 32 : 28, borderRadius: 16, position: "relative",
              background: pop ? "var(--foreground)" : "var(--surface)",
              color: pop ? "var(--background)" : "var(--foreground)",
              border: pop ? "none" : "1px solid var(--border)",
              boxShadow: pop ? "0 20px 40px -12px rgba(10,10,10,.25)" : "0 1px 3px rgba(10,10,10,.04)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div className="display-font text-2xl font-medium tracking-tight mb-1">{name}</div>
                  <div style={{ fontSize: 12, opacity: .65 }}>{tagline}</div>
                </div>
                {pop && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 12px var(--success)", marginTop: 6 }} />}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span className="display-font text-6xl font-medium tracking-tight leading-none">{price}€</span>
                <span style={{ fontSize: 14, opacity: .55 }}>/mois</span>
              </div>
              {annualBilling && <div className="font-mono" style={{ fontSize: 11, opacity: .55, marginBottom: 24 }}>Facturé annuellement</div>}
              {!annualBilling && <div style={{ height: 11, marginBottom: 24 }} />}
              <Link
                href="/auth/register"
                className="block text-center w-full py-3 text-sm font-semibold rounded-lg transition-transform hover:-translate-y-0.5"
                style={{
                  background: pop ? "var(--background)" : "var(--foreground)",
                  color: pop ? "var(--foreground)" : "var(--background)",
                }}
              >
                Commencer
              </Link>
              <div style={{ borderTop: `1px solid ${pop ? "rgba(255,255,255,.12)" : "var(--border)"}`, margin: "24px 0 0", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {features.map((f, j) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, opacity: j === 0 && (f.includes("Tout")) ? .8 : 1, fontWeight: j === 0 && f.includes("Tout") ? 600 : 400 }}>
                    {!(j === 0 && f.includes("Tout")) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 3, flexShrink: 0, opacity: .55 }}><path d="M20 6L9 17l-5-5"/></svg>
                    )}
                    {(j === 0 && f.includes("Tout")) && (
                      <span style={{ width: 14, marginTop: 3, flexShrink: 0 }} />
                    )}
                    <span style={{ lineHeight: 1.45 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section></Reveal>

      {/* CTA BOTTOM */}
      <Reveal><section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ background: "var(--foreground)", color: "var(--background)", borderRadius: 24, padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--success) 30%, transparent) 0%, transparent 50%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 24, opacity: .55 }}>Commencez aujourd'hui</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
              Prêt à reprendre<br /><span className="display-font italic font-normal">le contrôle ?</span>
            </h2>
            <p style={{ fontSize: 17, opacity: .7, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.55 }}>
              Rejoignez plus de 500 chauffeurs qui ont repris le contrôle de leur business — sans commission, sans intermédiaire.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/auth/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--background)", color: "var(--foreground)",
                fontWeight: 600, fontSize: 15, padding: "15px 32px", borderRadius: 10,
              }} className="hover:-translate-y-0.5 transition-transform">
                Créer mon espace
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="font-mono text-xs mt-8 opacity-50">14 jours gratuits · Sans CB</div>
          </div>
        </div>
      </section></Reveal>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, maxWidth: 1200, margin: "0 auto" }}>
        <Logo />
        <div style={{ fontSize: 13, color: "var(--muted)" }}>© 2025 PrivéChauffeur. Tous droits réservés.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["CGV", "Confidentialité", "Contact"].map(l => <span key={l} className="text-[13px] text-muted hover:text-foreground cursor-pointer transition-colors">{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
