"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INTERESTS } from "@/lib/data";
import { updateProfileApi, ApiError } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("Paris");
  const [customCity, setCustomCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const LANGUAGES = ["Français", "Anglais", "Arabe", "Bambara", "Espagnol", "Portugais", "Wolof", "Mandarin", "Hindi", "Russe", "Allemand", "Italien", "Turc", "Swahili", "Hausa"];

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const cities = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Autre"];

  const totalSteps = 3;

  function toggleTag(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleFinish() {
    if (selected.length < 3) return;
    setLoading(true);
    const finalCity = city === "Autre" ? customCity : city;

    const stored = localStorage.getItem("user");
    const user = stored ? JSON.parse(stored) : {};

    try {
      await updateProfileApi(user.id, {
        city: finalCity,
        language: languages.join(", "),
        interests: selected,
      });

      // Mettre à jour le localStorage
      localStorage.setItem("user", JSON.stringify({
        ...user,
        city: finalCity,
        language: languages.join(", "),
        interests: selected,
        is_new_user: false,
      }));

      router.push("/home");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        localStorage.setItem("user", JSON.stringify({
          ...user,
          city: finalCity,
          language: languages.join(", "),
          interests: selected,
          is_new_user: false,
        }));
        router.push("/home");
      } else {
        router.push("/home");
      }
    } finally {
      setLoading(false);
    }
  }

  const progressWidth = `${(step / totalSteps) * 100}%`;

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ background: "#2D1535" }}>

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse, rgba(196,96,58,0.30) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "-10%", background: "radial-gradient(ellipse, rgba(160,60,180,0.25) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(12px)" }}>

          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "9999px", height: 4, marginBottom: "2.5rem", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #C4603A, #E8924A)", height: "100%", borderRadius: "9999px", width: progressWidth, transition: "width 0.4s ease" }} />
          </div>

          {/* ── STEP 1 — Ville ── */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 1 sur {totalSteps}
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Ta{" "}
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ville
                </span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>
                On personnalise ton expérience selon là où tu es.
              </p>

              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                CONFIRME TA VILLE
              </label>

              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <button type="button" onClick={() => setCityOpen(!cityOpen)}
                  style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {city} <span style={{ color: "rgba(250,247,242,0.4)" }}>▾</span>
                </button>
                {cityOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1A0A2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", overflow: "hidden", zIndex: 50 }}>
                    {cities.map((c) => (
                      <button key={c} type="button"
                        onClick={() => { setCity(c); setCustomCity(""); setCityOpen(false); }}
                        style={{ width: "100%", padding: "0.75rem 1rem", background: city === c ? "rgba(196,96,58,0.20)" : "transparent", color: city === c ? "#E8924A" : "rgba(250,247,242,0.7)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {city === c ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {city === "Autre" && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <input
                    value={customCity}
                    onChange={e => setCustomCity(e.target.value)}
                    placeholder="Saisie ta ville..."
                    style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                    autoFocus
                  />
                </div>
              )}

              <div style={{ marginTop: "1.5rem" }}>
                <button onClick={() => setStep(2)}
                  disabled={city === "Autre" && !customCity}
                  style={{ width: "100%", padding: "0.9rem", background: (city === "Autre" && !customCity) ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: (city === "Autre" && !customCity) ? "rgba(250,247,242,0.3)" : "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: (city === "Autre" && !customCity) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 — Langue ── */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 2 sur {totalSteps}
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Ta{" "}
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  langue
                </span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>
                Quelle langue parles-tu principalement ? Ça aide à créer des liens.
              </p>

              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                LANGUE(S) PARLÉE(S)
              </label>
              <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.78rem", marginBottom: "1rem" }}>Tu peux en sélectionner plusieurs.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {LANGUAGES.map((lang) => (
                  <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                    style={{ padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", border: languages.includes(lang) ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)", background: languages.includes(lang) ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)", color: languages.includes(lang) ? "#E8924A" : "rgba(250,247,242,0.6)" }}>
                    {languages.includes(lang) ? `✓ ${lang}` : lang}
                  </button>
                ))}
              </div>
              {languages.length > 0 && (
                <p style={{ color: "#E8924A", fontSize: "0.82rem", fontWeight: 500, marginBottom: "1rem" }}>
                  ✓ {languages.length} sélectionnée{languages.length > 1 ? "s" : ""} : {languages.join(", ")}
                </p>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, padding: "0.9rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.6)", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Retour
                </button>
                <button onClick={() => setStep(3)}
                  style={{ flex: 2, padding: "0.9rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 — Intérêts ── */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 3 sur {totalSteps}
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Tes centres d&apos;
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  intérêt
                </span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Choisis au moins 3 catégories qui te correspondent.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {INTERESTS.map((tag) => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    style={{ padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", border: selected.includes(tag) ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)", background: selected.includes(tag) ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)", color: selected.includes(tag) ? "#E8924A" : "rgba(250,247,242,0.6)" }}>
                    {selected.includes(tag) ? `✓ ${tag}` : tag}
                  </button>
                ))}
              </div>

              {selected.length >= 3 && (
                <p style={{ color: "#E8924A", fontSize: "0.82rem", fontWeight: 500, marginBottom: "1rem" }}>
                  ✓ Super ! {selected.length} sélectionné{selected.length > 1 ? "s" : ""}.
                </p>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setStep(2)}
                  style={{ flex: 1, padding: "0.9rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.6)", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Retour
                </button>
                <button onClick={handleFinish} disabled={selected.length < 3 || loading}
                  style={{ flex: 2, padding: "0.9rem", background: selected.length >= 3 ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(255,255,255,0.08)", color: selected.length >= 3 ? "#fff" : "rgba(250,247,242,0.3)", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: selected.length >= 3 ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
                  {loading ? "Enregistrement..." : "Terminer et explorer →"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
