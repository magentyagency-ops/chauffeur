"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useState, useEffect } from "react";
import { getPersistedProfile, savePersistedProfile, type DriverProfile, getPersistedPhoto, savePersistedPhoto } from "@/lib/mockProfile";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("default");

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

        // Check if we need to initialize from Supabase (first login)
        if (!localStorage.getItem(`privechauffeur_driver_profile_${user.id}`)) {
          const { data: dbProfile } = await supabase
            .from("driver_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
          
          if (dbProfile) {
            const initialProfile: DriverProfile = {
              fullName: dbProfile.full_name || user.user_metadata?.full_name || "Chauffeur",
              phone: dbProfile.phone || "",
              whatsapp: dbProfile.phone || "",
              city: dbProfile.city || "",
              bio: dbProfile.bio || "Bienvenue !",
              publicSlug: dbProfile.public_slug || "",
            };
            setProfile(initialProfile);
            setProfilePhoto(null);
            return;
          }
        }
        
        setProfile(savedProfile);
        setProfilePhoto(savedPhoto);
      }
    }
    load();
  }, []);

  const handleSave = () => {
    if (!profile) return;
    setSaving(true);
    savePersistedProfile(profile, userId);
    if (profilePhoto) {
      savePersistedPhoto(profilePhoto, userId);
    }
    setTimeout(() => {
      setSaving(false);
      alert("Profil enregistré avec succès !");
    }, 800);
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
        <div className="flex gap-2">
          <a href={`/chauffeur/${profile.publicSlug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 !text-[13px] hidden sm:flex">Voir la page</a>
          <button onClick={handleSave} disabled={saving} className="btn-primary !py-2 !px-4 !text-[13px]">
            {saving ? "..." : "Enregistrer"}
          </button>
        </div>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-10 pb-32">
        
        {/* QR Code & Link Sharing */}
        <section className="card p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 bg-surface-alt">
          <div className="shrink-0 space-y-3 text-center">
            <div className="w-36 h-36 bg-white p-3 rounded-xl shadow-lg mx-auto flex items-center justify-center border border-border/50">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/chauffeur/${profile.publicSlug}` : '')}`} 
                alt="QR Code"
                className="w-full h-full"
              />
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
              className="text-[11px] font-bold text-accent hover:underline"
            >
              Télécharger le QR Code
            </button>
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Votre carte de visite</h3>
              <p className="text-muted text-[13px] mt-1">
                Partagez ce QR code pour permettre à vos clients de réserver, s'abonner ou vous suivre.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="input flex-1 !bg-surface !border-border text-[13px] font-mono flex items-center px-3 overflow-hidden whitespace-nowrap">
                  {typeof window !== 'undefined' ? `${window.location.origin.replace('http://', '').replace('https://', '')}/chauffeur/${profile.publicSlug}` : ''}
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + '/chauffeur/' + profile.publicSlug);
                    alert("Lien copié !");
                  }}
                  className="btn-secondary !py-2 !px-4 !text-[12px] shrink-0"
                >
                  Copier le lien
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Photo */}
        <section className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden relative group">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              profile.fullName[0]
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
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
              <button className="btn-secondary !py-2 !px-4 !text-[12px] mb-1">Changer la photo</button>
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handlePhotoUpload}
              />
            </div>
            <p className="text-[11px] text-muted">La photo sera automatiquement optimisée</p>
          </div>
        </section>

        {/* Essential Info */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="label">Nom complet</label>
              <input 
                type="text" 
                value={profile.fullName} 
                onChange={(e) => updateField("fullName", e.target.value)} 
                className="input" 
              />
            </div>
            <div className="space-y-2">
              <label className="label">Ville</label>
              <input 
                type="text" 
                value={profile.city} 
                onChange={(e) => updateField("city", e.target.value)} 
                className="input" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="label">Téléphone</label>
              <input 
                type="text" 
                value={profile.phone} 
                onChange={(e) => updateField("phone", e.target.value)} 
                className="input" 
              />
            </div>
            <div className="space-y-2">
              <label className="label">Identifiant unique (Lien URL)</label>
              <div className="flex gap-2">
                <span className="input !bg-surface-alt flex items-center text-muted px-3 select-none">/chauffeur/</span>
                <input 
                  type="text" 
                  value={profile.publicSlug} 
                  onChange={(e) => updateField("publicSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                  className="input flex-1" 
                  placeholder="votre-nom"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="label">WhatsApp (Format international)</label>
            <input 
              type="text" 
              value={profile.whatsapp} 
              onChange={(e) => updateField("whatsapp", e.target.value)} 
              className="input" 
              placeholder="Ex: 33612345678"
            />
          </div>

          <div className="space-y-2">
            <label className="label">Biographie / Description</label>
            <textarea 
              rows={5} 
              value={profile.bio} 
              onChange={(e) => updateField("bio", e.target.value)} 
              className="input !py-3 resize-none" 
            />
          </div>
        </section>
      </main>
    </>
  );
}
