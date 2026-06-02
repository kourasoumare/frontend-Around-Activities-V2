"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppNavbar } from "@/components/Navbar";
import { INTERESTS } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { updateProfileApi } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Autre"];

export default function ModifierProfilPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [form, setForm] = useState({
    firstName: "", lastName: "", birthDate: "", origin: "", language: "", city: "Paris", cityAutre: "",
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(stored.id ?? null);
    const interestsRaw = stored.interests;
    const interests: string[] = Array.isArray(interestsRaw)
      ? interestsRaw
      : typeof interestsRaw === "string" && interestsRaw
        ? interestsRaw.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    setSelectedInterests(interests);
    setForm({
      firstName: stored.first_name ?? "",
      lastName: stored.last_name ?? "",
      birthDate: stored.birth_date ? stored.birth_date.slice(0, 10) : "",
      origin: stored.origin ?? "",
      language: stored.language ?? "",
      city: CITIES.includes(stored.city) ? stored.city : stored.city ? "Autre" : "Paris",
      cityAutre: CITIES.includes(stored.city) ? "" : (stored.city ?? ""),
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleInterest(tag: string) {
    setSelectedInterests((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const finalCity = form.city === "Autre" ? form.cityAutre.trim() : form.city;
    try {
      const result = await updateProfileApi({
        first_name: form.firstName,
        last_name: form.lastName,
        birth_date: form.birthDate || undefined,
        origin: form.origin || undefined,
        language: form.language || undefined,
        city: finalCity || undefined,
        interests: selectedInterests,
      }) as { user?: object };
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const merged = { ...stored, ...(result?.user ?? {}), city: finalCity, interests: selectedInterests };
      localStorage.setItem("user", JSON.stringify(merged));
      showToast("Profil mis à jour !", "success");
      router.push(`/profil/${userId}`);
    } catch {
      showToast("Erreur lors de la mise à jour.", "error");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>

        <div className="relative z-10">
          <AppNavbar />

          <div className="max-w-2xl mx-auto px-6 py-10">
            <Link href={`/profil/${userId}`}
              style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>
              ← Retour au profil
            </Link>

            <h1 className="font-head font-black tracking-tight mb-1" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
              Modifier mon{" "}
              <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>profil</span>
            </h1>
            <p style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", marginBottom: "2rem" }}>Mets à jour tes informations.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {/* Infos générales */}
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1.25rem" }}>Informations générales</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>PRÉNOM</label>
                      <input style={inputStyle} name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jules" />
                    </div>
                    <div>
                      <label style={labelStyle}>NOM</label>
                      <input style={inputStyle} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Martin" />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>DATE DE NAISSANCE</label>
                    <input style={inputStyle} type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
                  </div>

                  <div>
                    <label style={labelStyle}>PAYS D&apos;ORIGINE</label>
                    <input style={inputStyle} name="origin" value={form.origin} onChange={handleChange} placeholder="Ex: Sénégal, Maroc, Brésil..." />
                  </div>

                  <div>
                    <label style={labelStyle}>LANGUE(S) PARLÉE(S)</label>
                    <input style={inputStyle} name="language" value={form.language} onChange={handleChange} placeholder="Ex: Français, Anglais, Arabe..." />
                  </div>

                  <div>
                    <label style={labelStyle}>VILLE</label>
                    <div style={{ position: "relative" }}>
                      <button type="button" onClick={() => setCityOpen(!cityOpen)}
                        style={{ ...inputStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        {form.city} <span style={{ color: "rgba(250,247,242,0.4)" }}>▾</span>
                      </button>
                      {cityOpen && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1A0A2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", overflow: "hidden", zIndex: 50 }}>
                          {CITIES.map((c) => (
                            <button key={c} type="button"
                              onClick={() => { setForm((prev) => ({ ...prev, city: c })); setCityOpen(false); }}
                              style={{ width: "100%", padding: "0.75rem 1rem", background: form.city === c ? "rgba(196,96,58,0.20)" : "transparent", color: form.city === c ? "#E8924A" : "rgba(250,247,242,0.7)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              {form.city === c ? "✓ " : ""}{c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {form.city === "Autre" && (
                      <input style={{ ...inputStyle, marginTop: "0.5rem" }} name="cityAutre" value={form.cityAutre} onChange={handleChange} placeholder="Précise ta ville..." />
                    )}
                  </div>
                </div>
              </div>

              {/* Centres d'intérêt */}
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1.25rem" }}>Centres d&apos;intérêt</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {INTERESTS.map((tag) => (
                    <button key={tag} type="button" onClick={() => toggleInterest(tag)}
                      style={{ padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", border: selectedInterests.includes(tag) ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)", background: selectedInterests.includes(tag) ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)", color: selectedInterests.includes(tag) ? "#E8924A" : "rgba(250,247,242,0.6)" }}>
                      {selectedInterests.includes(tag) ? `✓ ${tag}` : tag}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "1rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {loading ? "Enregistrement..." : "Enregistrer les modifications →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
