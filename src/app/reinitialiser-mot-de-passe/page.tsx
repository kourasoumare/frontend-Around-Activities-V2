"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setToken(searchParams.get("token"));
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (!token) {
      setError("Token invalide ou expiré.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.newPassword }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => router.push("/connexion"), 2500);
    } catch {
      setError("Lien invalide ou expiré. Refais une demande.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
          Nouveau mot de passe
        </h1>
        <p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
          Choisis un nouveau mot de passe sécurisé.
        </p>
      </div>

      <div className="card card-pad">
        {success ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Mot de passe modifié !</h3>
            <p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
              Redirection vers la connexion…
            </p>
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
                <label className="form-label">NOUVEAU MOT DE PASSE</label>
                <input
                  type="password" className="form-input"
                  name="newPassword" placeholder="••••••••"
                  value={form.newPassword}
                  onChange={(e) => { setForm((p) => ({ ...p, newPassword: e.target.value })); setError(""); }}
                  required minLength={6}
                />
              </div>
              <div>
                <label className="form-label">CONFIRMER LE MOT DE PASSE</label>
                <input
                  type="password" className="form-input"
                  name="confirmPassword" placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => { setForm((p) => ({ ...p, confirmPassword: e.target.value })); setError(""); }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? "Modification…" : "Modifier le mot de passe →"}
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
  );
}

export default function ReinitialisierMotDePassePage() {
  return (
    <div className="page-bg grad-auth">
      <div className="page-content" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", minHeight: "100vh" }}>
        <Suspense fallback={<div style={{ color: "var(--text-3)" }}>Chargement…</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}