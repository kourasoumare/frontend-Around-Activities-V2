"use client";

import { useState, useEffect, useMemo } from "react";
import { PageShell, SearchBar, CreateButton } from "@/components/Navbar";
import { ActivityCard } from "@/components/ActivityCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivitiesApi } from "@/lib/api";
import { Activity } from "@/lib/data";

const CATEGORIES = [
  { id: "Sport & Fitness",       label: "Sport",     color: "#4A8C5E" },
  { id: "Art & Culture",         label: "Art",       color: "#8E5BA8" },
  { id: "Restaurant & Cuisine",  label: "Cuisine",   color: "#C4603A" },
  { id: "Musique & Événements",  label: "Musique",   color: "#D4A547" },
  { id: "Bien-être & Détente",   label: "Bien-être", color: "#6BA89B" },
  { id: "Tech & Jeux vidéo",     label: "Tech",      color: "#4B6CB7" },
  { id: "Nature & Plein air",    label: "Nature",    color: "#6B8E4E" },
  { id: "Rencontres & Chill",    label: "Chill",     color: "#C97A8E" },
];

const CITIES = ["Toutes", "Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier"];

function HomeContent() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState("Toutes");
  const [currentUser, setCurrentUser] = useState<{ first_name?: string; firstName?: string; city?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setLoading(true);
    const city = cityFilter !== "Toutes" ? cityFilter : undefined;
    const cat = activeCat ?? undefined;
    getActivitiesApi(city, cat)
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [cityFilter, activeCat]);

  const filtered = useMemo(() => {
    if (!q.trim()) return activities;
    const ql = q.toLowerCase();
    return activities.filter(
      (a) => a.title.toLowerCase().includes(ql) || a.city.toLowerCase().includes(ql) || a.description?.toLowerCase().includes(ql),
    );
  }, [activities, q]);

  const firstName = currentUser?.first_name ?? currentUser?.firstName ?? "toi";

  return (
    <PageShell variant="home">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        {/* Greeting */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted-text)]">Bienvenue{currentUser?.city ? ` à ${currentUser.city}` : ""}</p>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">
              Salut <span className="text-grad">{firstName}</span>
            </h1>
            <p className="mt-2 max-w-xl text-[var(--muted-text)]">Voici les communautés qui bougent près de toi.</p>
          </div>
        </div>

        {/* Search + Create */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <SearchBar value={q} onChange={setQ} />
          <CreateButton href="/activites/creer" label="Créer une activité" />
        </div>

        {/* City filter */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--soft-text)]">Ville :</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="pill !pr-3 bg-white/90 cursor-pointer"
          >
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Categories */}
        <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2">
          <div className="flex min-w-max gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`pill whitespace-nowrap ${activeCat === null ? "pill-active" : ""}`}
              style={activeCat === null ? { background: "var(--gradient-primary)" } : undefined}
            >
              Toutes les catégories
            </button>
            {CATEGORIES.map((c) => {
              const on = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(on ? null : c.id)}
                  className="pill whitespace-nowrap"
                  style={on
                    ? { background: c.color, color: "white", borderColor: "transparent" }
                    : { borderColor: c.color, color: c.color }
                  }
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: on ? "white" : c.color }} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-12 text-center text-sm text-[var(--muted-text)]">Chargement…</div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((a) => <ActivityCard key={a.id} activity={a} />)}
            </div>
            {filtered.length === 0 && (
              <div className="glass-card mt-10 p-10 text-center">
                <h3 className="font-display text-xl font-semibold">Aucune activité trouvée</h3>
                <p className="mt-2 text-sm text-[var(--muted-text)]">Essaie d&apos;élargir la recherche, ou crée-en une nouvelle.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
