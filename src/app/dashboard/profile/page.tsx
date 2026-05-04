"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { mockDriver } from "@/lib/mock-data";
import { useState } from "react";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [formData] = useState(mockDriver);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <>
      <DashboardHeader title="Profil public">
        <div className="flex gap-2">
          <a href={`/chauffeur/${formData.public_slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2 !px-4 !text-[13px] hidden sm:flex">Voir la page</a>
          <button onClick={handleSave} disabled={saving} className="btn-primary !py-2 !px-4 !text-[13px]">
            {saving ? "..." : "Enregistrer"}
          </button>
        </div>
      </DashboardHeader>

      <main className="p-6 md:p-10 max-w-3xl mx-auto w-full space-y-10 pb-32">
        
        {/* URL Banner */}
        <section className="p-5 bg-accent/[0.03] border border-accent/20 rounded-[14px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[14px] font-mono text-accent">privechauffeur.com/{formData.public_slug}</div>
          <button className="btn-secondary !py-1.5 !px-3 !text-[11px] w-full sm:w-auto">Copier</button>
        </section>

        {/* Photo */}
        <section className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold text-2xl shrink-0">
            {formData.full_name[0]}
          </div>
          <div>
            <button className="btn-secondary !py-2 !px-4 !text-[12px] mb-1">Changer la photo</button>
            <p className="text-[11px] text-muted">JPG ou PNG, max 2 Mo</p>
          </div>
        </section>

        {/* Essential Info */}
        <section className="space-y-5">
          <div className="space-y-2">
            <label className="label">Nom affiché</label>
            <input type="text" defaultValue={formData.full_name} className="input" />
          </div>
          <div className="space-y-2">
            <label className="label">Téléphone</label>
            <input type="text" defaultValue={formData.phone} className="input" />
          </div>
          <div className="space-y-2">
            <label className="label">WhatsApp</label>
            <input type="text" defaultValue={formData.whatsapp} className="input" />
          </div>
          <div className="space-y-2">
            <label className="label">Ville</label>
            <input type="text" defaultValue={formData.city} className="input" />
          </div>
          <div className="space-y-2">
            <label className="label">Description courte</label>
            <textarea rows={3} defaultValue={formData.bio} className="input !py-3 resize-none" />
          </div>
        </section>

        {/* Hidden for now — bio, accroche, vehicle details, vehicle photo, options will be re-added later */}
      </main>
    </>
  );
}
