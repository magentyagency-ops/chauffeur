"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    city: "",
    vehicle_model: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.full_name.trim() || form.full_name.trim().length < 2)
      newErrors.full_name = "Nom complet requis (minimum 2 caractères)";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email invalide";
    if (!form.phone.trim() || form.phone.replace(/\s/g, "").length < 10)
      newErrors.phone = "Numéro de téléphone invalide";
    if (!form.city.trim()) newErrors.city = "Ville requise";
    if (!form.vehicle_model.trim())
      newErrors.vehicle_model = "Modèle de véhicule requis";
    if (form.password.length < 8)
      newErrors.password = "Mot de passe minimum 8 caractères";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setGlobalError("");

    try {
      // 1. Sign up user
      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.full_name,
            },
          },
        });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setGlobalError("Cet email est déjà utilisé. Essayez de vous connecter.");
        } else {
          setGlobalError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setGlobalError("Erreur lors de la création du compte.");
        setLoading(false);
        return;
      }

      // 2. Create driver profile
      const slug = generateSlug(form.full_name);
      const { error: profileError } = await supabase
        .from("driver_profiles")
        .insert({
          user_id: authData.user.id,
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          vehicle_model: form.vehicle_model.trim(),
          public_slug: slug + "-" + Date.now().toString(36),
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // User is created but profile failed - still redirect
      }

      router.push("/dashboard");
    } catch {
      setGlobalError("Une erreur inattendue est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  const fields = [
    {
      id: "full_name",
      label: "Nom complet",
      type: "text",
      placeholder: "Jean Dupont",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ),
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "jean@exemple.com",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      ),
    },
    {
      id: "phone",
      label: "Téléphone",
      type: "tel",
      placeholder: "06 12 34 56 78",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      ),
    },
    {
      id: "city",
      label: "Ville",
      type: "text",
      placeholder: "Paris",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ),
    },
    {
      id: "vehicle_model",
      label: "Modèle de véhicule",
      type: "text",
      placeholder: "Mercedes Classe E",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 17h14v-5H5z"/><path d="M2 17h20"/><path d="M7 12l2-5h6l2 5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
      ),
    },
  ];

  return (
    <div className="card p-8 md:p-12 animate-fade-up max-w-lg w-full mx-auto">
      <div className="text-center mb-10">
        <h1 className="display text-3xl font-medium text-foreground mb-3">
          Devenez Chauffeur Privé.
        </h1>
        <p className="text-text-muted text-sm font-medium">
          Rejoignez une communauté de chauffeurs indépendants et premium.
        </p>
      </div>

      {globalError && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.id} className={field.id === 'email' ? 'sm:col-span-2' : ''}>
              <label
                htmlFor={field.id}
                className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={form[field.id as keyof typeof form]}
                onChange={(e) => updateField(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3.5 rounded-xl bg-surface-light border text-foreground text-sm font-medium placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground/10 transition-all duration-300 ${
                  errors[field.id]
                    ? "border-red-500/40"
                    : "border-surface-border"
                }`}
              />
              {errors[field.id] && (
                <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1 uppercase tracking-wider">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3.5 rounded-xl bg-surface-light border text-foreground text-sm font-medium placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground/10 transition-all duration-300 ${
                  errors.password ? "border-red-500/40" : "border-surface-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 uppercase tracking-wider">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
              Confirmation
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3.5 rounded-xl bg-surface-light border text-foreground text-sm font-medium placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground/10 transition-all duration-300 ${
                errors.confirmPassword
                  ? "border-red-500/40"
                  : "border-surface-border"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 uppercase tracking-wider">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-black w-full !py-4 text-base font-bold !mt-10 shadow-lg"
        >
          {loading ? "Création en cours..." : "Lancer mon activité"}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-surface-border text-center">
        <p className="text-sm text-text-muted font-medium">
          Déjà un compte ?{" "}
          <a
            href="/auth/login"
            className="text-foreground hover:text-primary transition-colors font-bold"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
  );
}
