"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── CountUp Component ─────────────────────────────────────
function CountUp({ end, suffix = "", prefix = "" }: { end: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);
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

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [visible, end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ─── Check icon ────────────────────────────────────────────
function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-current">
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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      
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
          <Link href="/" className="relative w-28 h-8 flex items-center">
            <Image 
              src={scrolled ? "/logonoir.png" : "/logoblanc.png"} 
              alt="Vroom Logo" 
              fill 
              className="object-contain object-left transition-opacity duration-300" 
              priority 
            />
          </Link>
          
          <div className={`hidden md:flex items-center gap-8 ${scrolled ? 'text-muted' : 'text-white/70'}`}>
            {["Fonctionnalités", "Tarifs", "FAQ"].map(l => (
              <a 
                key={l} 
                href={`#${l.toLowerCase()}`} 
                className={`text-[13px] font-medium transition-colors ${scrolled ? 'hover:text-foreground' : 'hover:text-white'}`}
              >
                {l}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className={`text-[13px] font-semibold transition-colors px-4 py-2 rounded-lg ${scrolled ? 'text-foreground hover:bg-surface-alt' : 'text-white hover:bg-white/10'}`}
            >
              Connexion
            </Link>
            <Link href="/auth/register" className="btn-accent !py-2 !px-5 !text-[13px]">Commencer</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO (Dark) ═══ */}
      <section className="relative pt-48 pb-32 px-6 dark-section overflow-hidden">
        <div className="grain-overlay" />
        {/* Soft, smooth glowing orb */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">


          <h1 className="fade-up text-[clamp(44px,8vw,80px)] font-bold tracking-tight leading-[1.05] mb-6" style={{ animationDelay: ".04s" }}>
            Votre clientèle privée,<br />
            <span className="text-white/40">sans intermédiaire.</span>
          </h1>

          <p className="fade-up text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: ".08s" }}>
            Créez votre page de réservation, gérez vos clients et recevez des demandes directes — en quelques minutes.
          </p>

          <div className="fade-up flex flex-wrap justify-center gap-4" style={{ animationDelay: ".12s" }}>
            <Link href="/auth/register" className="btn-accent !py-4 !px-8 !text-[16px]">
              Créer mon espace <Arrow />
            </Link>
            <Link href="/chauffeur/jean-dupont" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-semibold text-[16px] rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              Voir une démo
            </Link>
          </div>

          <p className="fade-up text-sm text-white/40 mt-6 font-mono" style={{ animationDelay: ".16s" }}>
            14 jours gratuits · Sans CB · Sans engagement
          </p>
        </div>
      </section>

      {/* ═══ STATS BAND ═══ */}
      <section className="py-16 px-6 bg-background border-b border-border relative z-20 -mt-6 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
          {[
            { v: 500, label: "Chauffeurs", suffix: "+" },
            { v: 12, label: "Courses / mois", suffix: "K+" },
            { v: 4.8, label: "Note moyenne", suffix: "★" },
            { v: 0, label: "Commission", suffix: "%" },
          ].map((s, i) => (
            <div key={s.label} className={`text-center ${i % 2 === 0 ? 'border-none md:border-solid' : 'border-none'}`}>
              <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-foreground">
                <CountUp end={s.v} suffix={s.suffix} />
              </div>
              <div className="text-[13px] font-semibold text-muted uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES (Glassmorphism) ═══ */}
      <section id="fonctionnalités" className="py-32 px-6 bg-[#f5f5f3] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <p className="section-label mb-4 gradient-text-mono inline-block">Fonctionnalités</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Tout pour développer<br />
                <span className="text-muted">votre activité.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Page chauffeur", desc: "Votre vitrine pro en ligne. Photo, bio, véhicule et bouton de réservation direct.", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
              { title: "Réservation directe", desc: "Vos clients réservent depuis votre page. Vous confirmez en un clic, sans attente.", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
              { title: "Disponibilité live", desc: "Activez votre dispo d'un geste. Vos clients voient votre statut en temps réel.", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
              { title: "CRM intégré", desc: "Historique, préférences et notes pour chaque client. Ne perdez plus aucune donnée.", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
              { title: "Tarifs sur mesure", desc: "Fixez vos prix par trajet, heure ou kilomètre. Transparence totale pour le client.", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
              { title: "Alertes immédiates", desc: "Notifications instantanées pour chaque nouvelle demande de réservation.", icon: "M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 003.4 0" },
            ].map(({ title, desc, icon }, i) => (
              <Reveal key={title} className="h-full">
                <div className="glass-card p-8 h-full flex flex-col group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-foreground to-muted text-background flex items-center justify-center mb-6 shadow-lg group-hover:from-foreground group-hover:to-foreground transition-all duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
                  <p className="text-[15px] text-muted leading-relaxed flex-1">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS (Timeline) ═══ */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-20">
              <p className="section-label mb-4">Processus</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                3 étapes, <span className="text-muted">c'est tout.</span>
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-6 md:left-[50px] top-4 bottom-4 w-px bg-border" />
            
            <div className="space-y-16">
              {[
                { num: "1", title: "Créez votre compte gratuit", desc: "Inscrivez-vous en 2 minutes. Aucune carte bancaire n'est requise pour commencer votre essai." },
                { num: "2", title: "Personnalisez votre vitrine", desc: "Ajoutez votre photo pro, les détails de votre véhicule de luxe et configurez votre grille tarifaire." },
                { num: "3", title: "Partagez et encaissez", desc: "Envoyez votre lien unique à vos clients réguliers. Ils réservent facilement, vous gardez 100% du prix." },
              ].map(({ num, title, desc }) => (
                <Reveal key={num}>
                  <div className="relative flex items-start gap-8 pl-0 md:pl-6">
                    <div className="timeline-dot visible z-10 -ml-[18px] md:ml-0 bg-foreground text-background">
                      {num}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-2xl font-bold tracking-tight mb-3">{title}</h3>
                      <p className="text-[16px] text-muted leading-relaxed max-w-lg">{desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF (Dark) ═══ */}
      <section className="py-32 px-6 dark-section relative overflow-hidden">
        <div className="grain-overlay" />
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <p className="section-label mb-4 !text-white/40">Témoignages</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ils ont repris <span className="text-white/40">le contrôle.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Karim B.", role: "VTC Premium · Paris", text: "Avant, je perdais 25% de mes revenus en commission. Aujourd'hui, je garde tout. C'est le meilleur investissement pour mon activité." },
              { name: "Stéphane M.", role: "Chauffeur privé · Lyon", text: "Le CRM m'a changé la vie. Je sais exactement ce que mes clients préfèrent, leurs habitudes. Mon service est monté en gamme." },
              { name: "Aïcha D.", role: "Indépendante · Marseille", text: "Mes clients adorent pouvoir réserver à n'importe quelle heure sans passer par une appli externe. Ça fait beaucoup plus professionnel." },
            ].map((t, i) => (
              <Reveal key={t.name} className="h-full" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative bg-white/5 border border-white/10 rounded-3xl p-8 h-full flex flex-col backdrop-blur-md hover:bg-white/10 transition-colors">
                  <div className="quote-mark">"</div>
                  <p className="text-[16px] text-white/90 leading-relaxed flex-1 mt-6 relative z-10">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-4 pt-8 mt-4 border-t border-white/10">
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-[15px] font-bold text-white bg-white/5">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-white">{t.name}</div>
                      <div className="text-[13px] text-white/50 mt-0.5">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="tarifs" className="py-32 px-6 bg-background relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4">Tarifs</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Un prix simple, <br/><span className="text-muted">zéro commission cachée.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-black/5 blur-[80px] rounded-full" />
              <div className="relative bg-foreground text-background rounded-[32px] p-10 shadow-2xl border border-white/10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">Abonnement Pro</h3>
                    <p className="text-[14px] mt-2 text-white/60">Toutes les fonctionnalités incluses</p>
                  </div>
                  <div className="px-3 py-1 bg-white/10 text-white text-[12px] font-bold rounded-full border border-white/20">
                    SANS ENGAGEMENT
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-7xl font-bold tracking-tight">29€</span>
                  <span className="text-[16px] text-white/50 font-medium">/mois</span>
                </div>

                <Link
                  href="/auth/register"
                  className="btn-accent w-full !py-4 !text-[16px]"
                >
                  Commencer l'essai gratuit
                </Link>
                <p className="text-center text-[13px] text-white/40 mt-4 font-mono">14 jours gratuits. Sans carte bancaire.</p>

                <div className="mt-10 pt-8 flex flex-col gap-4 border-t border-white/10">
                  {[
                    "Page chauffeur publique Premium",
                    "Réservation directe (0% commission)",
                    "CRM clients complet & Historique",
                    "Clients & Trajets illimités",
                    "Notifications SMS & Email",
                    "Support prioritaire 7j/7"
                  ].map(f => (
                    <div key={f} className="flex items-start gap-3 text-[15px]">
                      <Check />
                      <span className="font-medium text-white/90">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA (Dark) ═══ */}
      <section className="py-24 px-6">
        <Reveal>
          <div className="max-w-5xl mx-auto">
            <div className="dark-section rounded-[40px] p-16 md:p-24 text-center relative overflow-hidden border border-border">
              <div className="grain-overlay" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[100px] pointer-events-none rounded-full" />
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                  Prêt à changer<br />de braquet ?
                </h2>
                <p className="text-lg text-white/60 max-w-xl mx-auto mb-12 leading-relaxed">
                  Rejoignez la nouvelle génération de chauffeurs qui maîtrisent leur clientèle et leurs revenus.
                </p>
                <Link
                  href="/auth/register"
                  className="btn-accent !py-4 !px-10 !text-[16px]"
                >
                  Créer mon espace <Arrow />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER (Dark) ═══ */}
      <footer className="dark-section border-t border-white/10 pt-20 pb-10 px-6 relative overflow-hidden">
        <div className="grain-overlay" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-16">
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="relative w-32 h-10 block mb-6">
                <Image src="/logoblanc.png" alt="Vroom Logo" fill className="object-contain object-center md:object-left" />
              </Link>
              <p className="text-[14px] text-white/40 max-w-xs text-center md:text-left">
                La plateforme n°1 des chauffeurs indépendants. Reprenez le contrôle de votre activité.
              </p>
            </div>
            
            <div className="flex gap-16 text-center md:text-left">
              <div>
                <div className="text-[13px] font-bold text-white mb-4 tracking-wider uppercase">Produit</div>
                <div className="flex flex-col gap-3">
                  <a href="#fonctionnalités" className="text-[14px] text-white/60 hover:text-white transition-colors">Fonctionnalités</a>
                  <a href="#tarifs" className="text-[14px] text-white/60 hover:text-white transition-colors">Tarifs</a>
                </div>
              </div>
              <div>
                <div className="text-[13px] font-bold text-white mb-4 tracking-wider uppercase">Légal</div>
                <div className="flex flex-col gap-3">
                  <a href="#" className="text-[14px] text-white/60 hover:text-white transition-colors">CGV</a>
                  <a href="#" className="text-[14px] text-white/60 hover:text-white transition-colors">Confidentialité</a>
                  <a href="#" className="text-[14px] text-white/60 hover:text-white transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-white/40">© {new Date().getFullYear()} Vroom. Tous droits réservés.</p>
            <div className="flex gap-4">
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-[13px] text-white/40">Systèmes opérationnels</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
