"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INTERESTS } from "@/lib/data";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("Paris");
  const [cityOpen, setCityOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const cities = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"];

  function toggleTag(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleFinish() {
    if (selected.length < 3) return;
    router.push("/home");
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ background: "#2D1535" }}>

      {/* Dégradés animés */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse, rgba(196,96,58,0.30) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "-10%", background: "radial-gradient(ellipse, rgba(160,60,180,0.25) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(12px)" }}>

          {/* Progress bar */}
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "9999px", height: 4, marginBottom: "2.5rem", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #C4603A, #E8924A)", height: "100%", borderRadius: "9999px", width: step === 1 ? "50%" : "100%", transition: "width 0.4s ease" }} />
          </div>

          {/* Step 1 — Ville */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 1 sur 2
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Ta{" "}
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>ville</span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>
                On personnalise ton expérience selon là où tu es.
              </p>

              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                CONFIRME TA VILLE
              </label>

              {/* Custom dropdown */}
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setCityOpen(!cityOpen)}
                  style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {city} <span style={{ color: "rgba(250,247,242,0.4)" }}>▾</span>
                </button>
                {cityOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1A0A2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", overflow: "hidden", zIndex: 50 }}>
                    {cities.map((c) => (
                      <button key={c} type="button"
                        onClick={() => { setCity(c); setCityOpen(false); }}
                        style={{ width: "100%", padding: "0.75rem 1rem", background: city === c ? "rgba(196,96,58,0.20)" : "transparent", color: city === c ? "#E8924A" : "rgba(250,247,242,0.7)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {city === c ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                style={{ width: "100%", padding: "0.9rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* Step 2 — Intérêts */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#E8924A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                Étape 2 sur 2
              </div>
              <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
                Tes centres d&apos;
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>intérêt</span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
                Choisis au moins 3 catégories qui te correspondent.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {INTERESTS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 500,
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                      border: selected.includes(tag) ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)",
                      background: selected.includes(tag) ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)",
                      color: selected.includes(tag) ? "#E8924A" : "rgba(250,247,242,0.6)",
                    }}
                  >
                    {selected.includes(tag) ? `✓ ${tag}` : tag}
                  </button>
                ))}
              </div>

              {selected.length >= 3 && (
                <p style={{ color: "#E8924A", fontSize: "0.82rem", fontWeight: 500, marginBottom: "1rem" }}>
                  ✓ Super ! {selected.length} sélectionné{selected.length > 1 ? "s" : ""}.
                </p>
              )}

              <button
                onClick={handleFinish}
                disabled={selected.length < 3}
                style={{
                  width: "100%", padding: "0.9rem",
                  background: selected.length >= 3 ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(255,255,255,0.08)",
                  color: selected.length >= 3 ? "#fff" : "rgba(250,247,242,0.3)",
                  border: "none", borderRadius: "0.75rem", fontWeight: 600,
                  fontSize: "1rem", cursor: selected.length >= 3 ? "pointer" : "not-allowed",
                  fontFamily: "inherit", transition: "all 0.2s",
                }}
              >
                Terminer et explorer →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}