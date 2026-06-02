"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INTERESTS } from "@/lib/data";
import { updateProfileApi } from "@/lib/api";

const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Autre"];
const LANGUAGES = ["Français", "Anglais", "Arabe", "Bambara", "Espagnol", "Portugais", "Wolof", "Mandarin", "Hindi", "Russe", "Allemand", "Italien", "Turc", "Swahili", "Hausa"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [city, setCity] = useState("Paris");
  const [cityOpen, setCityOpen] = useState(false);
  const [cityAutre, setCityAutre] = useState("");

  // Step 2
  const [languages, setLanguages] = useState<string[]>([]);

  // Step 3
  const [interests, setInterests] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  const finalCity = city === "Autre" ? cityAutre.trim() : city;
  const step1Valid = city !== "Autre" || cityAutre.trim().length > 0;

  function toggleLanguage(lang: string) {
    setLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  }

  function toggleInterest(tag: string) {
    setInterests((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function handleFinish() {
    if (interests.length < 3 || saving) return;
    setSaving(true);
    try {
      const result = await updateProfileApi({
        city: finalCity,
        language: languages.join(", "),
        interests,
      }) as { user?: object };
      const updatedUser = result?.user;
      if (updatedUser) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...updatedUser }));
      }
    } catch {
      // Non-blocking — proceed anyway
    } finally {
      setSaving(false);
      router.push("/home");
    }
  }

  const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

  const tagStyle = (selected: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 500,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
    border: selected ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)",
    background: selected ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)",
    color: selected ? "#E8924A" : "rgba(250,247,242,0.6)",
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ background: "#2D1535" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse, rgba(196,96,58,0.30) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "-10%", background: "radial-gradient(ellipse, rgba(160,60,180,0.25) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(12px)" }}>

          {/* Barre de progression */}
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "9999px", height: 4, marginBottom: "2.5rem", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #C4603A, #E8924A)", height: "100%", borderRadius: "9999px", width: progressWidth, transition: "width 0.4s ease" }} />
          </div>

          {/* ── Étape 1 — Ville ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 1 sur 3
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Ta{" "}
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>ville</span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>
                On personnalise ton expérience selon là où tu es.
              </p>

              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                CONFIRME TA VILLE
              </label>

              <div style={{ position: "relative", marginBottom: city === "Autre" ? "0.75rem" : "1.5rem" }}>
                <button type="button" onClick={() => setCityOpen(!cityOpen)}
                  style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {city} <span style={{ color: "rgba(250,247,242,0.4)" }}>▾</span>
                </button>
                {cityOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1A0A2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", overflow: "hidden", zIndex: 50 }}>
                    {CITIES.map((c) => (
                      <button key={c} type="button" onClick={() => { setCity(c); setCityOpen(false); }}
                        style={{ width: "100%", padding: "0.75rem 1rem", background: city === c ? "rgba(196,96,58,0.20)" : "transparent", color: city === c ? "#E8924A" : "rgba(250,247,242,0.7)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {city === c ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {city === "Autre" && (
                <input
                  placeholder="Précise ta ville..."
                  value={cityAutre}
                  onChange={(e) => setCityAutre(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", marginBottom: "1.5rem" }}
                />
              )}

              <button onClick={() => setStep(2)} disabled={!step1Valid}
                style={{ width: "100%", padding: "0.9rem", background: step1Valid ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(255,255,255,0.08)", color: step1Valid ? "#fff" : "rgba(250,247,242,0.3)", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: step1Valid ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── Étape 2 — Langues ── */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 2 sur 3
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Tes{" "}
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>langues</span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Quelles langues parles-tu ?
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {LANGUAGES.map((lang) => (
                  <button key={lang} onClick={() => toggleLanguage(lang)} style={tagStyle(languages.includes(lang))}>
                    {languages.includes(lang) ? `✓ ${lang}` : lang}
                  </button>
                ))}
              </div>

              {languages.length > 0 && (
                <p style={{ color: "#E8924A", fontSize: "0.82rem", fontWeight: 500, marginBottom: "1rem" }}>
                  ✓ {languages.join(", ")}
                </p>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "0.9rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.7)", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Retour
                </button>
                <button onClick={() => setStep(3)} style={{ flex: 2, padding: "0.9rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ── Étape 3 — Centres d'intérêt ── */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 3 sur 3
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Tes centres d&apos;
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>intérêt</span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Choisis au moins 3 catégories qui te correspondent.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {INTERESTS.map((tag) => (
                  <button key={tag} onClick={() => toggleInterest(tag)} style={tagStyle(interests.includes(tag))}>
                    {interests.includes(tag) ? `✓ ${tag}` : tag}
                  </button>
                ))}
              </div>

              {interests.length >= 3 && (
                <p style={{ color: "#E8924A", fontSize: "0.82rem", fontWeight: 500, marginBottom: "1rem" }}>
                  ✓ Super ! {interests.length} sélectionné{interests.length > 1 ? "s" : ""}.
                </p>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: "0.9rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.7)", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Retour
                </button>
                <button onClick={handleFinish} disabled={interests.length < 3 || saving}
                  style={{ flex: 2, padding: "0.9rem", background: interests.length >= 3 ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(255,255,255,0.08)", color: interests.length >= 3 ? "#fff" : "rgba(250,247,242,0.3)", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.9rem", cursor: interests.length >= 3 ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
                  {saving ? "Enregistrement..." : "Terminer et explorer →"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
