"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerApi, ApiError } from "@/lib/api";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", city: "Paris", origin: "", birthDate: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const cities = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Autre"];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "", global: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword || !form.city) {
      newErrors.global = "Tous les champs obligatoires doivent être remplis.";
    }
    if (form.email && !validateEmail(form.email)) newErrors.email = "Email invalide.";
    if (form.password && form.password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await registerApi({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, confirmPassword: form.confirmPassword, city: form.city });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/onboarding");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) setErrors({ global: "Un compte existe déjà avec cet email." });
        else if (err.status === 0) setErrors({ global: "Erreur de connexion, veuillez réessayer." });
        else setErrors({ global: "Une erreur est survenue, veuillez réessayer plus tard." });
      }
    } finally { setLoading(false); }
  }

  const inputStyle = (field: string) => ({
    width: "100%", padding: "0.85rem 1rem",
    background: errors[field] ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.08)",
    border: errors[field] ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.12)",
    borderRadius: "0.75rem", color: "#FAF7F2",
    fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
  });
  const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" } as const;
  const fieldError = (field: string) => errors[field] ? <p style={{ color: "#fca5a5", fontSize: "0.75rem", marginTop: "0.35rem" }}>⚠️ {errors[field]}</p> : null;

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
            Bienvenue{" "}
            <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>!</span>
          </h1>
          <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>Crée ton compte et commence à explorer.</p>

          {errors.global && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              ⚠️ {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>PRÉNOM *</label>
                <input style={inputStyle("firstName")} name="firstName" placeholder="Jules" value={form.firstName} onChange={handleChange} />
                {fieldError("firstName")}
              </div>
              <div>
                <label style={labelStyle}>NOM *</label>
                <input style={inputStyle("lastName")} name="lastName" placeholder="Martin" value={form.lastName} onChange={handleChange} />
                {fieldError("lastName")}
              </div>
            </div>

            <div>
              <label style={labelStyle}>EMAIL *</label>
              <input style={inputStyle("email")} type="email" name="email" placeholder="jules@exemple.fr" value={form.email} onChange={handleChange} />
              {fieldError("email")}
            </div>

            <div>
              <label style={labelStyle}>MOT DE PASSE *</label>
              <input style={inputStyle("password")} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
              {fieldError("password")}
            </div>

            <div>
              <label style={labelStyle}>CONFIRMER LE MOT DE PASSE *</label>
              <input style={inputStyle("confirmPassword")} type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              {fieldError("confirmPassword")}
            </div>

            <div>
              <label style={labelStyle}>DATE DE NAISSANCE</label>
              <input style={inputStyle("birthDate")} type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>PAYS D&apos;ORIGINE</label>
              <input style={inputStyle("origin")} name="origin" placeholder="Ex: Sénégal, Maroc, Brésil..." value={form.origin} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>VILLE *</label>
              <div style={{ position: "relative" }}>
                <button type="button" onClick={() => setCityOpen(!cityOpen)} style={{ ...inputStyle("city"), display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  {form.city} <span style={{ color: "rgba(250,247,242,0.4)" }}>▾</span>
                </button>
                {cityOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1A0A2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", overflow: "hidden", zIndex: 50 }}>
                    {cities.map((c) => (
                      <button key={c} type="button" onClick={() => { setForm((prev) => ({ ...prev, city: c })); setCityOpen(false); }}
                        style={{ width: "100%", padding: "0.75rem 1rem", background: form.city === c ? "rgba(196,96,58,0.20)" : "transparent", color: form.city === c ? "#E8924A" : "rgba(250,247,242,0.7)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {form.city === c ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.9rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: "0.5rem" }}>
              {loading ? "Création du compte..." : "Créer mon compte →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.8rem" }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(250,247,242,0.4)" }}>
            Déjà un compte ?{" "}
            <Link href="/connexion" style={{ color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>Se connecter</Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.8rem", textDecoration: "none" }}>← Retour à l&apos;accueil</Link>
        </p>
      </div>
    </div>
  );
}
