"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConnexionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Merci de remplir tous les champs.");
      return;
    }
    // TODO: POST /api/auth/login
    router.push("/home");
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        <Link href="/" className="text-xs text-ink-3 hover:text-ink mb-6 inline-flex items-center gap-1">
          ← Retour
        </Link>

        <h1 className="font-head text-3xl font-black tracking-tight mb-1">
          Bon retour !
        </h1>
        <p className="text-ink-3 text-sm mb-8">
          Connecte-toi pour retrouver tes groupes.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Email</label>
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
            <label className="form-label">Mot de passe</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="text-right">
            <Link href="/mot-de-passe-oublie" className="text-xs text-tc hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center py-3.5">
            Se connecter →
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-bg-3" />
          <span className="text-xs text-ink-3">ou</span>
          <div className="flex-1 h-px bg-bg-3" />
        </div>

        <p className="text-center text-sm text-ink-3">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-tc font-semibold hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
