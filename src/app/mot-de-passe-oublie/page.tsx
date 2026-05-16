"use client";

import Link from "next/link";
import { useState } from "react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: POST /api/auth/forgot-password
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-xl">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-tc-light flex items-center justify-center text-2xl mx-auto mb-6">
          🔒
        </div>

        <h1 className="font-head text-3xl font-black tracking-tight text-center mb-2">
          Mot de passe oublié
        </h1>
        <p className="text-ink-3 text-sm text-center mb-8">
          On t&apos;envoie un lien de réinitialisation par email.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Ton adresse email</label>
              <input
                className="form-input"
                type="email"
                placeholder="jules@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center py-3.5">
              Recevoir le lien →
            </button>
          </form>
        ) : (
          <div className="bg-bg-2 border-l-4 border-tc rounded-r-xl px-5 py-4 text-sm text-ink-2">
            <strong className="text-ink">Lien envoyé !</strong> Si cet email existe dans notre base,
            tu recevras un lien dans quelques minutes. Pense à vérifier tes spams.
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/connexion" className="text-sm text-tc font-semibold hover:underline">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
