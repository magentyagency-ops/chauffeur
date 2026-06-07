"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ fullName: string; publicSlug: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Fetch driver profile
      const { data: dbProfile } = await supabase
        .from("driver_profiles")
        .select("full_name, public_slug")
        .eq("id", user.id)
        .single();

      if (dbProfile) {
        setProfile({
          fullName: dbProfile.full_name,
          publicSlug: dbProfile.public_slug,
        });
        const url = `${window.location.origin}/chauffeur/${dbProfile.public_slug}`;
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`);
      } else {
        // Fallback mock profile if DB fails
        setProfile({ fullName: "Chauffeur", publicSlug: "demo" });
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + '/chauffeur/demo')}`);
      }
      setLoading(false);
    }
    checkUser();
  }, [router, supabase]);

  const copyLink = () => {
    if (!profile) return;
    const url = `${window.location.origin}/chauffeur/${profile.publicSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white/60 font-mono tracking-widest uppercase">Initialisation...</p>
        </div>
      </div>
    );
  }

  const firstName = profile.fullName.split(" ")[0];
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/chauffeur/${profile.publicSlug}` : "";

  const steps = [
    {
      title: `Bienvenue, ${firstName}`,
      subtitle: "Votre espace professionnel est prêt.",
      content: (
        <div className="space-y-6 text-center">
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            Votre profil public et votre module de réservation en direct sont maintenant en ligne. Voici vos accès uniques :
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col items-center gap-3">
              <div className="w-36 h-36 bg-white p-3 rounded-xl shadow-lg flex items-center justify-center border border-white/10">
                {qrUrl ? (
                  <img src={qrUrl} alt="Votre QR Code" className="w-full h-full rounded-md" />
                ) : (
                  <div className="w-full h-full bg-gray-100 animate-pulse rounded-md" />
                )}
              </div>
              <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">Votre QR code de réservation</span>
            </div>

            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3 min-w-0">
              <span className="text-[13px] font-mono text-white/60 truncate flex-1 text-left">{publicUrl.replace("https://", "").replace("http://", "")}</span>
              <button 
                onClick={copyLink} 
                className="text-[12px] font-bold text-white hover:text-white/80 transition-colors uppercase tracking-wider shrink-0 ml-2"
              >
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Présentez votre QR Code",
      subtitle: "La fin des intermédiaires commence ici.",
      content: (
        <div className="space-y-6 text-center">
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            À la fin d'un trajet avec vos clients, montrez-leur votre QR code directement depuis votre téléphone ou sur une carte imprimée dans votre véhicule.
          </p>
          
          <div className="relative aspect-[4/3] bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden p-6">
            <div className="w-32 h-56 bg-zinc-900 border-4 border-zinc-800 rounded-3xl p-3 shadow-2xl relative flex flex-col justify-between items-center">
              {/* Speaker / Notch */}
              <div className="w-12 h-3 bg-zinc-800 rounded-full mb-3" />
              {/* Screen content */}
              <div className="w-full flex-1 flex flex-col items-center justify-center gap-3 bg-black rounded-xl p-2 border border-zinc-800">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest text-center">Scanner pour réserver</span>
                <div className="w-20 h-20 bg-white p-1 rounded-md">
                  <img src={qrUrl} alt="QR Code" className="w-full h-full rounded" />
                </div>
              </div>
              {/* Home Indicator */}
              <div className="w-8 h-1 bg-zinc-800 rounded-full mt-3" />
            </div>
            {/* Soft decorative glow behind */}
            <div className="absolute inset-0 bg-white/5 blur-3xl pointer-events-none rounded-full" />
          </div>
        </div>
      )
    },
    {
      title: "Votre Webapp chez vos clients",
      subtitle: "Un clic pour vous réinstaller sur leur écran.",
      content: (
        <div className="space-y-6 text-center">
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            En scannant votre QR Code, vos clients accèdent à votre page. Ils peuvent l'ajouter à l'écran d'accueil de leur smartphone en 1 clic comme une vraie application.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 text-left relative overflow-hidden">
            <div className="w-12 h-12 bg-white text-black font-extrabold rounded-2xl flex items-center justify-center shadow-lg text-lg shrink-0">
              V
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Installation simplifiée</h4>
              <p className="text-[12px] text-white/50 mt-1 leading-relaxed">
                Pas besoin d'App Store. Vos clients cliquent sur "Ajouter à l'écran d'accueil" et vous ont à portée de main à tout moment.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      )
    },
    {
      title: "Gérez vos trajets en direct",
      subtitle: "0% commission, 100% de liberté.",
      content: (
        <div className="space-y-6 text-center">
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            Chaque demande de réservation arrive directement sur votre tableau de bord. Vous recevez des notifications en temps réel pour accepter ou refuser le trajet en 1 clic.
          </p>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1">Fidélisation</span>
              <p className="text-[12px] text-white/80 leading-snug">Vos clients vous commandent directement à vos prix.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1">Flexibilité</span>
              <p className="text-[12px] text-white/80 leading-snug">Activez votre disponibilité en un geste pour les courses immédiates.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 font-sans relative overflow-hidden selection:bg-white selection:text-black">
      {/* Background radial soft light */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between py-4 max-w-lg mx-auto w-full relative z-10">
        <Link href="/" className="relative w-24 h-6 flex items-center">
          <Image src="/logoblanc.png" alt="Vroom Logo" fill className="object-contain object-left" priority />
        </Link>
        <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
          Étape {currentStep + 1} / {steps.length}
        </div>
      </header>

      {/* Card Wrapper */}
      <main className="flex-1 flex items-center justify-center my-8 relative z-10 w-full">
        <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl relative flex flex-col justify-between min-h-[500px]">
          
          {/* Progress Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-white/10 rounded-t-[32px] overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">{steps[currentStep].title}</h2>
            <p className="text-[14px] text-white/50 font-medium">{steps[currentStep].subtitle}</p>
          </div>

          {/* Step Dynamic Content */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="w-full">
              {steps[currentStep].content}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            {currentStep > 0 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3.5 rounded-xl border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-colors"
              >
                Retour
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex-1 bg-white text-black hover:opacity-90 active:scale-[0.98] py-3.5 px-6 rounded-xl font-bold text-sm transition-all text-center"
              >
                Continuer
              </button>
            ) : (
              <Link 
                href="/dashboard"
                className="flex-1 bg-white text-black hover:opacity-90 active:scale-[0.98] py-3.5 px-6 rounded-xl font-bold text-sm transition-all text-center block"
              >
                Accéder à mon tableau de bord
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center max-w-lg mx-auto w-full relative z-10">
        <p className="text-[11px] text-white/30 font-mono">
          Vroom. La plateforme indépendante pour chauffeurs privés.
        </p>
      </footer>
    </div>
  );
}
