"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");

  // TODO: read token from URL params and validate it server-side
  const tokenValid = true;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.password || form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    // TODO: POST /api/auth/reset-password with token + new password
    router.push("/connexion");
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl text-center">
          <div className="text-5xl mb-4">⏰</div>
          <h2 className="font-head text-2xl font-black mb-3">Lien expiré</h2>
          <p className="text-ink-3 text-sm mb-6">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link href="/mot-de-passe-oublie" className="btn btn-primary">
            Faire une nouvelle demande
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-tc-light flex items-center justify-center text-2xl mx-auto mb-6">
          🔑
        </div>

        <h1 className="font-head text-3xl font-black tracking-tight text-center mb-2">
          Nouveau mot de passe
        </h1>
        <p className="text-ink-3 text-sm text-center mb-8">
          Choisis un mot de passe sécurisé d&apos;au moins 8 caractères.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nouveau mot de passe</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Confirmer le mot de passe</label>
            <input
              className="form-input"
              type="password"
              name="confirm"
              placeholder="••••••••"
              value={form.confirm}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full justify-center py-3.5 mt-2"
          >
            Enregistrer le nouveau mot de passe →
          </button>
        </form>
      </div>
    </div>
  );
}
