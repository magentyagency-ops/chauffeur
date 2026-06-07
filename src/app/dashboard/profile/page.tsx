"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useState, useEffect } from "react";
import { getPersistedProfile, savePersistedProfile, type DriverProfile, getPersistedPhoto, savePersistedPhoto } from "@/lib/mockProfile";
import { createClient } from "@/lib/supabase/client";
import { updateDriverProfile } from "@/lib/actions/profile";
import PushNotificationManager from "../PushNotificationManager";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("default");
  const [qrUrl, setQrUrl] = useState<string>("");

  // Load profile from localStorage on mount
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Load persisted data
        const savedProfile = getPersistedProfile(user.id);
        const savedPhoto = getPersistedPhoto(user.id);

        // Always check Supabase for real data
        const { data: dbProfile } = await supabase
          .from("driver_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (dbProfile) {
          const initialProfile: DriverProfile = {
            fullName: dbProfile.full_name || user.user_metadata?.full_name || "Chauffeur",
            phone: dbProfile.phone || "",
            whatsapp: dbProfile.whatsapp || dbProfile.phone || "",
            city: dbProfile.city || "",
            bio: dbProfile.bio || "Bienvenue !",
            publicSlug: dbProfile.public_slug || "",
          };
          setProfile(initialProfile);
          if (dbProfile.profile_photo_url) {
            setProfilePhoto(dbProfile.profile_photo_url);
          } else {
            setProfilePhoto(savedPhoto);
          }
          return;
        }
        
        setProfile(savedProfile);
        setProfilePhoto(savedPhoto);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && profile?.publicSlug) {
      const url = `${window.location.origin}/chauffeur/${profile.publicSlug}`;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`);
    }
  }, [profile?.publicSlug]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    
    // Sync to Supabase
    const result = await updateDriverProfile({
      full_name: profile.fullName,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      city: profile.city,
      bio: profile.bio,
      public_slug: profile.publicSlug,
      profile_photo_url: profilePhoto || undefined, // Save base64 to DB
    });

    savePersistedProfile(profile, userId);
    if (profilePhoto) {
      savePersistedPhoto(profilePhoto, userId);
    }
    
    setSaving(false);
    if (result.success) {
      alert("Profil enregistré avec succès dans la base de données !");
    } else {
      console.error("Save error details:", result.error);
      alert("Erreur lors de l'enregistrement : " + (result.error || "Problème de connexion"));
    }
  };

  const updateField = (field: keyof DriverProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions (e.g., 800px)
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Export as compressed JPEG
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setProfilePhoto(compressedDataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) return null;

  return (
    <>
      <DashboardHeader title="Profil public">
        <div className="flex gap-3">
          <a href={`/chauffeur/${profile.publicSlug}`} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md rounded-full transition-all font-bold px-5 py-2.5 text-[13px] text-black hidden sm:flex items-center">
            Voir la page
          </a>
          <button onClick={handleSave} disabled={saving} className="bg-black text-white hover:shadow-[0_8px_16px_rgba(0,0,0,0.15)] rounded-full transition-all font-bold px-6 py-2.5 text-[13px] flex items-center">
            {saving ? "..." : "Enregistrer"}
          </button>
        </div>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-4xl mx-auto w-full space-y-10 pb-32">
        
        {/* QR Code & Link Sharing */}
        <section className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 overflow-hidden">
          <div className="shrink-0 space-y-4 text-center">
            <div className="w-40 h-40 bg-white p-4 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] mx-auto flex items-center justify-center border border-gray-100">
              {qrUrl ? (
                <img 
                  src={qrUrl} 
                  alt="QR Code"
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />
              )}
            </div>
            <button 
              onClick={() => {
                const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(window.location.origin + '/chauffeur/' + profile.publicSlug)}`;
                const link = document.createElement('a');
                link.href = url;
                link.download = `qrcode-${profile.publicSlug}.png`;
                link.target = '_blank';
                link.click();
              }}
              className="text-[12px] font-[800] text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
            >
              Télécharger le QR Code
            </button>
          </div>
          
          <div className="flex-1 space-y-5 text-center md:text-left min-w-0 w-full">
            <div>
              <h3 className="text-2xl font-[800] tracking-tight text-black font-display">Votre carte de visite</h3>
              <p className="text-gray-500 text-[15px] mt-2 font-medium">
                Partagez ce QR code pour permettre à vos clients de réserver, s'abonner ou vous suivre.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-100 shadow-inner rounded-2xl px-5 py-4 text-[14px] font-medium text-gray-500 flex items-center min-w-0">
                  <span className="truncate w-full">
                    {typeof window !== 'undefined' ? `${window.location.origin.replace('http://', '').replace('https://', '')}/chauffeur/${profile.publicSlug}` : ''}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/chauffeur/' + profile.publicSlug);
                    alert("Lien copié !");
                  }}
                  className="bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md rounded-2xl transition-all font-bold px-6 py-4 text-[13px] text-black shrink-0"
                >
                  Copier le lien
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Photo */}
        <section className="flex items-center gap-6 bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-8">
          <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-[800] text-3xl shrink-0 overflow-hidden relative group shadow-inner">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">{profile.fullName[0]}</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handlePhotoUpload}
            />
          </div>
          <div>
            <div className="relative inline-block">
              <button className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-full transition-all font-bold px-5 py-2.5 text-[13px] text-black mb-2">Changer la photo</button>
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handlePhotoUpload}
              />
            </div>
            <p className="text-[12px] font-medium text-gray-400">La photo sera automatiquement optimisée</p>
          </div>
        </section>

        {/* Essential Info */}
        <section className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[2rem] p-8 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-[12px] font-[800] text-gray-500 uppercase tracking-wider ml-2">Nom complet</label>
              <input 
                type="text" 
                value={profile.fullName} 
                onChange={(e) => updateField("fullName", e.target.value)} 
                className="w-full bg-gray-50 border border-gray-100 shadow-inner rounded-2xl px-5 py-4 text-[15px] font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[12px] font-[800] text-gray-500 uppercase tracking-wider ml-2">Ville</label>
              <input 
                type="text" 
                value={profile.city} 
                onChange={(e) => updateField("city", e.target.value)} 
                className="w-full bg-gray-50 border border-gray-100 shadow-inner rounded-2xl px-5 py-4 text-[15px] font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-[12px] font-[800] text-gray-500 uppercase tracking-wider ml-2">Téléphone</label>
              <input 
                type="text" 
                value={profile.phone} 
                onChange={(e) => updateField("phone", e.target.value)} 
                className="w-full bg-gray-50 border border-gray-100 shadow-inner rounded-2xl px-5 py-4 text-[15px] font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[12px] font-[800] text-gray-500 uppercase tracking-wider ml-2">Identifiant unique (Lien URL)</label>
              <div className="flex">
                <span className="bg-gray-100 border border-gray-100 border-r-0 shadow-inner rounded-l-2xl px-5 py-4 text-[15px] font-bold text-gray-400 flex items-center select-none">/chauffeur/</span>
                <input 
                  type="text" 
                  value={profile.publicSlug} 
                  onChange={(e) => updateField("publicSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                  className="w-full bg-gray-50 border border-gray-100 border-l-0 shadow-inner rounded-r-2xl pr-5 py-4 text-[15px] font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" 
                  placeholder="votre-nom"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[12px] font-[800] text-gray-500 uppercase tracking-wider ml-2">WhatsApp (Format international)</label>
            <input 
              type="text" 
              value={profile.whatsapp} 
              onChange={(e) => updateField("whatsapp", e.target.value)} 
              className="w-full bg-gray-50 border border-gray-100 shadow-inner rounded-2xl px-5 py-4 text-[15px] font-bold text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all" 
              placeholder="Ex: 33612345678"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-[12px] font-[800] text-gray-500 uppercase tracking-wider ml-2">Biographie / Description</label>
            <textarea 
              rows={5} 
              value={profile.bio} 
              onChange={(e) => updateField("bio", e.target.value)} 
              className="w-full bg-gray-50 border border-gray-100 shadow-inner rounded-2xl px-5 py-4 text-[15px] font-medium text-black focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none" 
            />
          </div>
        </section>

        {/* Configuration des Notifications */}
        <section className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="font-display text-2xl font-[800] tracking-tight text-black mb-6">Paramètres système</h3>
          <PushNotificationManager />
        </section>
      </main>
    </>
  );
}
