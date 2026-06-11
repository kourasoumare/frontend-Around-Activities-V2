"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordApi } from "@/lib/api";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi(email);
      setSent(true);
    } catch {
      setError("Email introuvable. Vérifie l'adresse saisie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-bg grad-auth">
      <div className="page-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "var(--tc-grad)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-head)", fontWeight: 900, fontSize: "1.4rem", color: "#fff",
              margin: "0 auto 0.75rem",
              boxShadow: "0 4px 16px rgba(196,96,58,0.30)",
            }}>A</div>
          </Link>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "1.7rem", color: "var(--text)", marginBottom: "0.25rem" }}>
            Mot de passe oublié
          </h1>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
            Saisis ton email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <div className="card card-pad">
          {sent ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Email envoyé !</h3>
              <p style={{ color: "var(--text-3)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Vérifie ta boîte mail et clique sur le lien pour réinitialiser ton mot de passe.
              </p>
              <Link href="/connexion" className="btn btn-primary btn-block">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: "rgba(196,96,58,0.10)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "var(--r)", padding: "0.75rem 1rem", marginBottom: "1.25rem", color: "var(--tc)", fontSize: "0.88rem" }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="form-label">EMAIL</label>
                  <input
                    type="email" className="form-input"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                  {loading ? "Envoi…" : "Envoyer le lien →"}
                </button>
              </form>
              <p style={{ textAlign: "center", marginTop: "1.25rem", color: "var(--text-3)", fontSize: "0.88rem" }}>
                <Link href="/connexion" style={{ color: "var(--tc)", fontWeight: 600, textDecoration: "none" }}>
                  ← Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}