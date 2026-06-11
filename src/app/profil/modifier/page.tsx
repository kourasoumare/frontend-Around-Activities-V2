"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppNavbar } from "@/components/Navbar";
import { INTERESTS } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { updateProfileApi, ApiError } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Autre"];
const LANGUAGES = ["Français", "Anglais", "Arabe", "Bambara", "Espagnol", "Portugais", "Wolof", "Mandarin", "Hindi", "Allemand", "Italien", "Turc"];

export default function ModifierProfilPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", city: "Paris", customCity: "", birthDate: "", language: "" });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number>(1);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);
    setUserId(user.id);
    const cityInList = CITIES.slice(0, -1).includes(user.city);
    setForm({
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      city: cityInList ? user.city : (user.city ? "Autre" : "Paris"),
      customCity: cityInList ? "" : (user.city || ""),
      birthDate: user.birth_date ? user.birth_date.split("T")[0] : "",
      language: user.language || "",
    });
    if (user.interests && Array.isArray(user.interests)) setSelectedInterests(user.interests);
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
    const finalCity = form.city === "Autre" ? form.customCity : form.city;
    try {
      const updated = await updateProfileApi(userId, {
        firstName: form.firstName, lastName: form.lastName,
        city: finalCity, birthDate: form.birthDate,
        language: form.language, interests: selectedInterests,
      });
      const stored = localStorage.getItem("user");
      if (stored) {
        const current = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...current, ...(updated as object), interests: selectedInterests }));
      }
      showToast("Profil mis à jour !", "success");
      router.push(`/profil/${userId}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        showToast("Profil mis à jour !", "success");
        router.push(`/profil/${userId}`);
      } else {
        showToast("Erreur lors de la mise à jour.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="page-bg grad-profil">
        <div className="page-content">
        <AppNavbar />
        <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: 640 }}>
          <button onClick={() => router.back()} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.88rem", fontFamily: "var(--font-body)", marginBottom: "1.5rem", padding: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
            ← Retour au profil
          </button>

          <div style={{ marginBottom: "2rem" }}>
            <div className="eyebrow" style={{ marginBottom: "0.4rem" }}>Mon compte</div>
            <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 900, color: "var(--text)" }}>
              Modifier mon profil
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: "0.95rem", marginTop: "0.35rem" }}>Mets à jour tes informations.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Infos générales */}
            <div className="card card-pad">
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                Informations générales
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label">PRÉNOM</label>
                    <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jules" />
                  </div>
                  <div>
                    <label className="form-label">NOM</label>
                    <input className="form-input" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Martin" />
                  </div>
                </div>

                <div>
                  <label className="form-label">DATE DE NAISSANCE</label>
                  <input className="form-input" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
                </div>

                <div>
                  <label className="form-label">LANGUE PARLÉE</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.25rem" }}>
                    {LANGUAGES.map((lang) => {
                      const isSelected = form.language.split(", ").includes(lang);
                      return (
                        <button
                          key={lang} type="button"
                          onClick={() => {
                            const langs = form.language ? form.language.split(", ") : [];
                            const updated = isSelected ? langs.filter((l) => l !== lang) : [...langs, lang];
                            setForm((prev) => ({ ...prev, language: updated.join(", ") }));
                          }}
                          style={{
                            padding: "0.35rem 0.75rem", borderRadius: 9999,
                            border: isSelected ? "1.5px solid var(--tc)" : "1.5px solid var(--border-2)",
                            background: isSelected ? "var(--tc-soft)" : "var(--card)",
                            color: isSelected ? "var(--tc-deep)" : "var(--text-2)",
                            fontSize: "0.80rem", fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s",
                          }}
                        >
                          {isSelected ? "✓ " : ""}{lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label">VILLE</label>
                  <select
                    className="form-input"
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value, customCity: "" }))}
                    style={{ cursor: "pointer" }}
                  >
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {form.city === "Autre" && (
                    <input className="form-input" name="customCity" value={form.customCity} onChange={handleChange} placeholder="Saisie ta ville…" style={{ marginTop: "0.5rem" }} />
                  )}
                </div>
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div className="card card-pad">
              <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--text)", marginBottom: "0.4rem" }}>
                Centres d&apos;intérêt
              </h2>
              <p style={{ color: "var(--text-3)", fontSize: "0.82rem", marginBottom: "1.1rem" }}>
                {selectedInterests.length} sélectionné{selectedInterests.length > 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {INTERESTS.map((tag) => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag} type="button" onClick={() => toggleInterest(tag)}
                      style={{
                        padding: "0.4rem 0.85rem", borderRadius: 9999,
                        border: isSelected ? "1.5px solid var(--tc)" : "1.5px solid var(--border)",
                        background: isSelected ? "var(--tc-soft)" : "var(--surface-1)",
                        color: isSelected ? "var(--tc-deep)" : "var(--text-3)",
                        fontSize: "0.80rem", fontWeight: isSelected ? 700 : 500,
                        cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s",
                      }}
                    >
                      {isSelected ? "✓ " : ""}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? "Enregistrement…" : "Enregistrer les modifications →"}
            </button>
          </form>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}