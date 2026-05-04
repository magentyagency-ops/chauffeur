"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email invalide."); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      });
      if (err) setError(err.message);
      else setSuccess(true);
    } catch { setError("Une erreur est survenue."); }
    finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="text-xl font-semibold tracking-tight mb-2">Email envoyé !</h1>
        <p className="text-sm text-muted mb-6">Si un compte est associé à <span className="font-medium text-foreground">{email}</span>, vous recevrez un lien.</p>
        <a href="/auth/login" className="btn-primary w-full !py-3">Retour à la connexion</a>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Mot de passe oublié ?</h1>
        <p className="text-sm text-muted">Entrez votre email pour recevoir un lien de réinitialisation.</p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-error/8 border border-error/15 text-error text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@exemple.com" className="input" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 disabled:opacity-50">
          {loading ? <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> : "Envoyer le lien"}
        </button>
      </form>

      <p className="mt-6 text-center">
        <a href="/auth/login" className="text-sm text-muted hover:text-foreground transition-colors">← Retour à la connexion</a>
      </p>
    </div>
  );
}
