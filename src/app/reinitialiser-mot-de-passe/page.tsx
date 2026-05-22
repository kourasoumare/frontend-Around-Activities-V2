"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
  }, [searchParams]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.newPassword || !form.confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (!token) {
      setError("Lien invalide ou expiré.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: form.newPassword }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        router.push("/connexion?reset=success");
      } else if (response.status === 400 || response.status === 404) {
        setError("Ce lien est invalide ou a expiré. Refais une demande.");
      } else if (response.status >= 500) {
        setError("Une erreur est survenue, veuillez réessayer plus tard.");
      } else {
        setError(data.message || "Une erreur est survenue.");
      }
    } catch {
      setError("Erreur de connexion, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError?: boolean) => ({
    width: "100%", padding: "0.85rem 1rem",
    background: hasError ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.08)",
    border: hasError ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.12)",
    borderRadius: "0.75rem", color: "#FAF7F2",
    fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
  });

  // Token invalide ou absent
  if (token === null && typeof window !== "undefined" && !searchParams.get("token")) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏰</div>
        <h2 className="font-head font-black" style={{ color: "#FAF7F2", fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Lien expiré
        </h2>
        <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Ce lien est invalide ou a expiré.
        </p>
        <Link href="/mot-de-passe-oublie" style={{ background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "9999px", fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}>
          Faire une nouvelle demande
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "1.25rem" }}></div>

      <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2", textAlign: "center" }}>
        Nouveau{" "}
        <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
          mot de passe
        </span>
      </h1>
      <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem", textAlign: "center" }}>
        Choisis un mot de passe sécurisé d&apos;au moins 6 caractères.
      </p>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
            NOUVEAU MOT DE PASSE
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="••••••••"
            value={form.newPassword}
            onChange={handleChange}
            style={inputStyle(!!error && !form.newPassword)}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
            CONFIRMER LE MOT DE PASSE
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            style={inputStyle(!!error && form.newPassword !== form.confirmPassword)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "0.9rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
        >
          {loading ? "Réinitialisation..." : "Enregistrer le nouveau mot de passe →"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <Link href="/connexion" style={{ color: "#E8924A", fontSize: "0.875rem", textDecoration: "none", fontWeight: 500 }}>
          ← Retour à la connexion
        </Link>
      </div>
    </>
  );
}

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ background: "#2D1535" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse, rgba(196,96,58,0.30) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "-10%", background: "radial-gradient(ellipse, rgba(160,60,180,0.25) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <video src="/logo.mp4" autoPlay loop muted playsInline className="h-16 w-16 rounded-full object-cover" />
            <span className="font-head text-xl font-black" style={{ color: "#FAF7F2" }}>Around Activities</span>
          </Link>
        </div>

        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(12px)" }}>
          <Suspense fallback={<p style={{ color: "rgba(250,247,242,0.4)", textAlign: "center" }}>Chargement...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}