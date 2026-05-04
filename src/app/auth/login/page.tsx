"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    callbackError === "auth_callback_error"
      ? "Erreur d'authentification. Veuillez réessayer."
      : ""
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-8 md:p-12 animate-fade-up max-w-md w-full mx-auto">
      <div className="text-center mb-10">
        <h1 className="display text-3xl font-medium text-foreground mb-3">
          Content de vous revoir.
        </h1>
        <p className="text-text-muted text-sm font-medium">
          Connectez-vous à votre espace chauffeur premium.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
            Email professionnel
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            autoComplete="email"
            className="w-full px-4 py-3.5 rounded-xl bg-surface-light border border-surface-border text-foreground text-sm font-medium placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground/10 transition-all duration-300"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Mot de passe
            </label>
            <a
              href="/auth/forgot-password"
              className="text-[10px] font-black text-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              Oublié ?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3.5 rounded-xl bg-surface-light border border-surface-border text-foreground text-sm font-medium placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/5 focus:border-foreground/10 transition-all duration-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-black w-full !py-4 text-base font-bold shadow-lg"
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-surface-border text-center">
        <p className="text-sm text-text-muted font-medium">
          Pas encore membre ?{" "}
          <a
            href="/auth/register"
            className="text-foreground hover:text-primary transition-colors font-bold"
          >
            Créer un compte gratuit
          </a>
        </p>
      </div>
    </div>
  );
}
