"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/context/ToastContext";
import { createActivityApi, ApiError } from "@/lib/api";
import { Activity, CATEGORY_OPTIONS } from "@/lib/data";

const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier"];

type SimilarActivity = Activity & { similarity?: "exact" | "similar" };

function CreerActiviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const initialCategory = (() => {
    const slug = searchParams.get("category");
    if (!slug) return "";
    const found = CATEGORY_OPTIONS.find((c) => c.id === slug);
    return found ? found.id : "";
  })();

  const [form, setForm] = useState({ title: "", description: "", category: initialCategory, city: "Paris" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [similarActivities, setSimilarActivities] = useState<SimilarActivity[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setShowSimilar(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.category || !form.description) {
      setError("Merci de remplir tous les champs obligatoires (*).");
      return;
    }
    setLoading(true);
    try {
      const activity = await createActivityApi({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        city: form.city,
      });
      showToast("Activité créée avec succès !", "success");
      router.push(activity?.id ? `/activites/${activity.id}` : "/home");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setSimilarActivities((err.details as any)?.similar ?? []);
        setShowSimilar(true);
      } else if (err instanceof ApiError && err.status === 400) {
        setError(err.message);
      } else {
        const message = err instanceof Error ? err.message : "Erreur lors de la création.";
        setError(message);
        showToast(message, "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: 640 }}>
      <button
        onClick={() => router.back()}
        style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.88rem", fontFamily: "var(--font-body)", marginBottom: "1.5rem", padding: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}
      >
        ← Retour
      </button>

      <div style={{ marginBottom: "2rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.4rem" }}>Nouvelle communauté</div>
        <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 900, color: "var(--text)" }}>
          Créer une activité
        </h1>
        <p style={{ color: "var(--text-3)", fontSize: "0.95rem", marginTop: "0.35rem" }}>
          Lance une communauté autour d&apos;un intérêt commun.
        </p>
      </div>

      <div className="card card-pad">
        {error && (
          <div style={{ background: "rgba(196,96,58,0.10)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "var(--r)", padding: "0.75rem 1rem", marginBottom: "1.25rem", color: "var(--tc)", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Titre */}
          <div>
            <label className="form-label">NOM DE L&apos;ACTIVITÉ *</label>
            <input
              className="form-input"
              name="title"
              placeholder="Ex: Foot du dimanche, Running Club Paris…"
              value={form.title}
              onChange={handleChange}
            />

            {showSimilar && similarActivities.length > 0 && (
              <div style={{ marginTop: "0.6rem", padding: "0.9rem 1rem", background: "var(--orange-soft)", border: "1px solid rgba(232,146,74,0.25)", borderRadius: "var(--r)" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-2)", marginBottom: "0.6rem" }}>
                  Des activités similaires existent déjà. Tu veux les rejoindre ?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.75rem" }}>
                  {similarActivities.slice(0, 3).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => router.push(`/activites/${a.id}`)}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.6rem",
                        padding: "0.6rem 0.8rem", borderRadius: "var(--r-xs)",
                        background: "var(--card)", border: "1px solid var(--border)",
                        cursor: "pointer", textAlign: "left", fontFamily: "var(--font-body)",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>{a.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{a.city} · {a._count?.groups ?? 0} groupes</div>
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--tc)", fontWeight: 600 }}>Rejoindre →</span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowSimilar(false)}
                  style={{ fontSize: "0.80rem", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)", textDecoration: "underline" }}
                >
                  Non, je veux quand même créer mon activité
                </button>
              </div>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <label className="form-label">CATÉGORIE *</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: "0.5rem" }}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, category: cat.id }))}
                  style={{
                    padding: "0.6rem 0.8rem", borderRadius: "var(--r)",
                    border: form.category === cat.id ? "2px solid var(--tc)" : "1.5px solid var(--border-2)",
                    background: form.category === cat.id ? "var(--tc-soft)" : "var(--card)",
                    cursor: "pointer", fontFamily: "var(--font-body)",
                    fontSize: "0.82rem", fontWeight: form.category === cat.id ? 700 : 500,
                    color: form.category === cat.id ? "var(--tc-deep)" : "var(--text-2)",
                    transition: "all 0.15s", textAlign: "left",
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">DESCRIPTION *</label>
            <textarea
              className="form-input"
              name="description" rows={4}
              placeholder="Décris l'activité, l'ambiance, qui peut rejoindre…"
              value={form.description}
              onChange={handleChange}
              style={{ resize: "none" }}
            />
          </div>

          {/* Ville */}
          <div>
            <label className="form-label">VILLE</label>
            <select className="form-input" name="city" value={form.city} onChange={handleChange} style={{ cursor: "pointer" }}>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Création en cours…" : "Créer l'activité →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreerActivitePage() {
  return (
    <ProtectedRoute>
      <div className="page-bg grad-activity">
        <div className="page-content">
          <AppNavbar />
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)" }}>Chargement…</div>}>
            <CreerActiviteForm />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}