"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginApi, ApiError } from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Veuillez remplir tous les champs."); return; }
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
        else setError("Une erreur est survenue.");
      }
    } finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0.75rem", color: "#1a1a2e",
    fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
    backdropFilter: "blur(4px)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#2D1535" }}>

      {/* ── Navbar ── */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2.5rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <Image src="/logo.png" alt="Around Activities" width={38} height={38} style={{ borderRadius: "50%" }} />
          <span className="font-head" style={{ fontSize: "1.05rem", fontWeight: 900, color: "#FAF7F2" }}>Around Activities</span>
        </Link>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/connexion" style={{ padding: "0.45rem 1.1rem", borderRadius: "0.75rem", color: "rgba(250,247,242,0.85)", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)" }}>
            Se connecter
          </Link>
          <Link href="/inscription" style={{ padding: "0.45rem 1.1rem", borderRadius: "0.75rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
            S&apos;inscrire
          </Link>
        </div>
      </nav>

      {/* ── Hero — Image plein écran avec texte par-dessus ── */}
      <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px" }}>
        {/* Image de fond */}
        <Image src="/hero.jpg" alt="Jeunes à Paris" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        
        {/* Overlay dégradé */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(20,8,30,0.75) 0%, rgba(20,8,30,0.4) 50%, rgba(20,8,30,0.1) 100%)" }} />

        {/* Contenu par-dessus l'image */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 5rem" }}>
          <div style={{ maxWidth: "520px" }}>
            <h1 className="font-head font-black leading-tight tracking-tight" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#FAF7F2", marginBottom: "1rem", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              Rencontre.<br />
              Partage.<br />
              <span style={{ background: "linear-gradient(135deg, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Vis la France.
              </span>
            </h1>
            <p style={{ color: "rgba(250,247,242,0.85)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2rem", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
              Rejoins des activités près de chez toi<br />et crée des liens authentiques.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {[{ icon: "👥", label: "Découvre" }, { icon: "📅", label: "Participe" }, { icon: "❤️", label: "Rencontre" }].map((item) => (
                <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.95)", borderRadius: "9999px", padding: "0.4rem 1rem", fontSize: "0.85rem", color: "#1a1a2e", fontWeight: 600 }}>
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Formulaire de connexion sous l'image ── */}
      <div style={{ background: "#2D1535", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "440px", margin: "0 auto" }}>
          <h2 className="font-head font-black tracking-tight" style={{ fontSize: "1.75rem", color: "#FAF7F2", textAlign: "center", marginBottom: "0.5rem" }}>
            Bon <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>retour</span>
          </h2>
          <p style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.875rem", textAlign: "center", marginBottom: "2rem" }}>
            Connecte-toi pour retrouver tes groupes.
          </p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input type="email" name="email" placeholder="Ton adresse email" value={form.email} onChange={handleChange}
              style={{ ...inputStyle, color: "#FAF7F2", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} />
            <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange}
              style={{ ...inputStyle, color: "#FAF7F2", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }} />
            
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.9rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Connexion..." : "Se connecter →"}
            </button>
          </form>

          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <Link href="/mot-de-passe-oublie" style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.825rem", textDecoration: "none" }}>
              Mot de passe oublié ?
            </Link>
            <p style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.825rem" }}>
              Pas encore de compte ?{" "}
              <Link href="/inscription" style={{ color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ background: "rgba(0,0,0,0.3)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem", textAlign: "center", color: "rgba(250,247,242,0.3)", fontSize: "0.8rem" }}>
        <span className="font-head" style={{ color: "rgba(250,247,242,0.45)" }}>Around Activities</span>
        {" "}· Fait avec ❤️ pour les nouveaux arrivants · 2026
      </footer>
    </div>
  );
}
