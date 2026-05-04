"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ full_name: "", email: "", phone: "", city: "", vehicle_model: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showPw, setShowPw] = useState(false);

  function generateSlug(name: string): string {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.full_name.trim() || form.full_name.trim().length < 2) e.full_name = "Nom complet requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.phone.trim() || form.phone.replace(/\s/g, "").length < 10) e.phone = "Téléphone invalide";
    if (!form.city.trim()) e.city = "Ville requise";
    if (!form.vehicle_model.trim()) e.vehicle_model = "Véhicule requis";
    if (form.password.length < 8) e.password = "Minimum 8 caractères";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalError("");
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name } },
      });
      if (signUpError) { setGlobalError(signUpError.message.includes("already") ? "Cet email est déjà utilisé." : signUpError.message); setLoading(false); return; }
      if (!authData.user) { setGlobalError("Erreur lors de la création."); setLoading(false); return; }

      const slug = generateSlug(form.full_name);
      await supabase.from("driver_profiles").insert({
        user_id: authData.user.id,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        vehicle_model: form.vehicle_model.trim(),
        public_slug: slug + "-" + Date.now().toString(36),
      });

      router.push("/dashboard");
    } catch {
      setGlobalError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  const fields = [
    { id: "full_name", label: "Nom complet", type: "text", placeholder: "Jean Dupont" },
    { id: "email", label: "Email", type: "email", placeholder: "jean@exemple.com" },
    { id: "phone", label: "Téléphone", type: "tel", placeholder: "06 12 34 56 78" },
    { id: "city", label: "Ville", type: "text", placeholder: "Paris" },
    { id: "vehicle_model", label: "Véhicule", type: "text", placeholder: "Mercedes Classe E" },
  ];

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Créez votre espace</h1>
        <p className="text-sm text-muted">Rejoignez +500 chauffeurs indépendants</p>
      </div>

      {globalError && (
        <div className="mb-5 p-3.5 rounded-xl bg-error/8 border border-error/15 text-error text-sm flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {fields.map(f => (
          <div key={f.id}>
            <label htmlFor={f.id} className="label">{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              value={form[f.id as keyof typeof form]}
              onChange={e => updateField(f.id, e.target.value)}
              placeholder={f.placeholder}
              className={`input ${errors[f.id] ? "!border-error/40" : ""}`}
            />
            {errors[f.id] && <p className="text-error text-[12px] mt-1">{errors[f.id]}</p>}
          </div>
        ))}

        <div>
          <label htmlFor="password" className="label">Mot de passe</label>
          <div className="relative">
            <input id="password" type={showPw ? "text" : "password"} value={form.password} onChange={e => updateField("password", e.target.value)} placeholder="Minimum 8 caractères" className={`input pr-11 ${errors.password ? "!border-error/40" : ""}`} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          {errors.password && <p className="text-error text-[12px] mt-1">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="label">Confirmer le mot de passe</label>
          <input id="confirmPassword" type={showPw ? "text" : "password"} value={form.confirmPassword} onChange={e => updateField("confirmPassword", e.target.value)} placeholder="Répétez le mot de passe" className={`input ${errors.confirmPassword ? "!border-error/40" : ""}`} />
          {errors.confirmPassword && <p className="text-error text-[12px] mt-1">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 !mt-5 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          ) : "Créer mon espace chauffeur"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà un compte ?{" "}
        <a href="/auth/login" className="text-foreground font-medium hover:underline">Se connecter</a>
      </p>
    </div>
  );
}
