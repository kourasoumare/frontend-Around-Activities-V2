"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useToast } from "@/context/ToastContext";
import { loginApi, ApiError } from "@/lib/api";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      showToast("Votre session a expiré.", "error");
    }
    if (searchParams.get("reset") === "success") {
      showToast("Mot de passe modifié avec succès !", "success");
    }
  }, [searchParams, showToast]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginApi(form.email, form.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError("Email ou mot de passe incorrect.");
        else if (err.status === 0) setError("Erreur de connexion, veuillez réessayer.");
        else setError("Une erreur est survenue, veuillez réessayer plus tard.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "0.75rem", color: "#FAF7F2",
    fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
  };

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
          <h1 className="font-head font-black tracking-tight mb-1" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
            Bon{" "}
            <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>retour</span>
          </h1>
          <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Connecte-toi pour retrouver tes groupes.
          </p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>EMAIL</label>
              <input type="email" name="email" placeholder="jules@exemple.fr" value={form.email} onChange={handleChange} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>MOT DE PASSE</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
              <Link href="/mot-de-passe-oublie" style={{ color: "#E8924A", fontSize: "0.8rem", textDecoration: "none" }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.9rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Connexion..." : "Se connecter →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.8rem" }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(250,247,242,0.4)" }}>
            Pas encore de compte ?{" "}
            <Link href="/inscription" style={{ color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>S&apos;inscrire</Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.8rem", textDecoration: "none" }}>← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionForm />
    </Suspense>
  );
}