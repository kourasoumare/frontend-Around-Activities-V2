"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivitiesApi } from "@/lib/api";
import { Activity } from "@/lib/data";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { slug: "sport-fitness",      name: "Sport & Fitness",      id: "Sport & Fitness",      color: "#E8502A" },
  { slug: "art-culture",        name: "Art & Culture",        id: "Art & Culture",        color: "#7A60C4" },
  { slug: "restaurant-cuisine", name: "Restaurant & Cuisine", id: "Restaurant & Cuisine", color: "#E8924A" },
  { slug: "musique-evenements", name: "Musique & Événements", id: "Musique & Événements", color: "#D45D8A" },
  { slug: "bien-etre-detente",  name: "Bien-être & Détente",  id: "Bien-être & Détente",  color: "#4A8260" },
  { slug: "tech-jeux-video",    name: "Tech & Jeux vidéo",    id: "Tech & Jeux vidéo",    color: "#3A7CC4" },
  { slug: "nature-plein-air",   name: "Nature & Plein air",   id: "Nature & Plein air",   color: "#5A8C3A" },
  { slug: "rencontres-chill",   name: "Rencontres & Chill",   id: "Rencontres & Chill",   color: "#C4603A" },
];

const CITIES = ["Toutes les villes", "Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier"];

function CategoryContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const category = CATEGORIES.find((c) => c.slug === slug);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState("Toutes les villes");

  useEffect(() => {
    getActivitiesApi()
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!category) {
    return (
      <div className="wrap" style={{ paddingTop: "3rem", textAlign: "center" }}>
        <h2 style={{ color: "var(--text)" }}>Catégorie introuvable</h2>
        <button className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }} onClick={() => router.push("/home")}>
          ← Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  const filtered = activities.filter((a) => {
    if (a.category !== category.id) return false;
    if (search.trim() && !a.title.toLowerCase().includes(search.toLowerCase().trim())) return false;
    if (city !== "Toutes les villes" && a.city !== city) return false;
    return true;
  });

  return (
    <>
      {/* ── Header catégorie ── */}
      <div style={{
        background: category.color,
        padding: "1.5rem clamp(1rem, 3vw, 2rem)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <button
            onClick={() => router.push("/home")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.35rem",
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.28)", color: "#fff",
              cursor: "pointer", padding: "0.35rem 0.85rem", borderRadius: 999,
              fontSize: "0.78rem", fontWeight: 600, fontFamily: "var(--font-body)",
              marginBottom: "1rem",
            }}
          >
            ← Accueil
          </button>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#fff", marginBottom: "0.25rem" }}>
            {category.name}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "0.9rem" }}>
            {filtered.length} activité{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── Filtres ── */}
      <div style={{ background: "rgba(253,250,246,0.92)", borderBottom: "1px solid var(--border)", padding: "0.75rem clamp(1rem, 3vw, 2rem)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="field" style={{ flex: "1 1 200px", maxWidth: 400 }}>
            <span style={{ color: "var(--text-4)", fontSize: "0.9rem" }}>🔍</span>
            <input
              placeholder={`Rechercher dans ${category.name}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)" }}>×</button>
            )}
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              padding: "0.5rem 0.85rem", borderRadius: "var(--r)",
              border: "1.5px solid var(--border-2)", background: "var(--card)",
              color: "var(--text-2)", fontSize: "0.85rem", cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Link
            href={`/activites/creer?category=${category.slug}`}
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "0.5rem 1rem",
              background: category.color, color: "#fff",
              borderRadius: "var(--r)", fontWeight: 600, fontSize: "0.82rem",
              textDecoration: "none", whiteSpace: "nowrap",
              boxShadow: `0 3px 10px ${category.color}40`,
            }}
          >
            + Créer
          </Link>
        </div>
      </div>

      {/* ── Grille activités ── */}
      <div className="wrap" style={{ paddingTop: "1.5rem", paddingBottom: "4rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-3)", padding: "3rem" }}>Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="card card-pad" style={{ textAlign: "center", padding: "3rem 2rem" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "0.4rem", fontSize: "1rem" }}>
              Aucune activité trouvée
            </h3>
            <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              {search || city !== "Toutes les villes"
                ? "Essaie d'autres filtres."
                : "Sois le premier à créer une activité dans cette catégorie !"}
            </p>
            {(search || city !== "Toutes les villes") && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setSearch(""); setCity("Toutes les villes"); }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid-activities">
            {filtered.map((activity) => (
              <Link key={activity.id} href={`/activites/${activity.id}`} style={{ textDecoration: "none" }}>
                <div className="activity-card">
                  <div style={{ height: 5, background: category.color }} />
                  <div style={{ padding: "0.9rem 1rem" }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: category.color, marginBottom: "0.35rem" }}>
                      {activity.category}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-head)", fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.35rem", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {activity.title}
                    </h3>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                      <span className="meta">{activity.city}</span>
                      <span className="meta">{activity._count?.groups ?? 0} sorties</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "0.6rem" }}>
                      <span className="badge-community">Communauté</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: category.color }}>Voir →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function CategoryPage() {
  return (
    <ProtectedRoute>
      <div className="page-bg grad-home">
        <div className="page-content">
          <AppNavbar />
          <Suspense fallback={<div style={{ padding: "3rem", textAlign: "center", color: "var(--text-3)" }}>Chargement…</div>}>
            <CategoryContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
