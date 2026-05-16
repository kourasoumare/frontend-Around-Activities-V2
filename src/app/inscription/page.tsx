"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "Paris",
  });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    // TODO: POST /api/auth/register
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <Link href="/" className="text-xs text-ink-3 hover:text-ink mb-6 inline-flex items-center gap-1">
          ← Retour
        </Link>

        <h1 className="font-head text-3xl font-black tracking-tight mb-1">
          Bienvenue 
        </h1>
        <p className="text-ink-3 text-sm mb-8">
          Crée ton compte et commence à explorer.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Prénom *</label>
              <input
                className="form-input"
                name="firstName"
                placeholder="Jules"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">Nom</label>
              <input
                className="form-input"
                name="lastName"
                placeholder="Martin"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="jules@exemple.fr"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Mot de passe *</label>
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
            <label className="form-label">Confirmer le mot de passe *</label>
            <input
              className="form-input"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Ville *</label>
            <select
              className="form-input"
              name="city"
              value={form.city}
              onChange={handleChange}
            >
              {["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Autre"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center py-3.5 mt-2">
            Créer mon compte →
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-bg-3" />
          <span className="text-xs text-ink-3">ou</span>
          <div className="flex-1 h-px bg-bg-3" />
        </div>

        <p className="text-center text-sm text-ink-3">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-tc font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
