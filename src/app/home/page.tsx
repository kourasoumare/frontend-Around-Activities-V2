"use client";

import { useState, useEffect, useMemo } from "react";
import { PageShell, SearchBar } from "@/components/Navbar";
import { ActivityCard } from "@/components/ActivityCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivitiesApi } from "@/lib/api";
import { Activity, CATEGORY_OPTIONS } from "@/lib/data";
import Link from "next/link";
import { Plus } from "lucide-react";

function HomeContent() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ first_name?: string; firstName?: string; city?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setLoading(true);
    getActivitiesApi("Paris", activeCat ?? undefined)
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, [activeCat]);

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
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Salut <span className="text-grad">{firstName}</span>
        </h1>

        {/* Barre de recherche — 33% desktop, pleine largeur mobile */}
        <div className="mt-6 w-full md:w-1/3">
          <SearchBar value={q} onChange={setQ} />
        </div>

        {/* Filtres catégories */}
        <div className="mt-4 -mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex min-w-max gap-2">
            <button
              onClick={() => setActiveCat(null)}
              className={`pill whitespace-nowrap ${activeCat === null ? "pill-active" : ""}`}
              style={activeCat === null ? { background: "var(--secondary-action)", color: "white" } : undefined}
            >
              Toutes les catégories
            </button>
            {CATEGORY_OPTIONS.map((c) => {
              const on = activeCat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(on ? null : c.id)}
                  className="pill whitespace-nowrap"
                  style={on
                    ? { background: "var(--secondary-action)", color: "white", borderColor: "transparent" }
                    : { borderColor: c.color, color: c.color }
                  }
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: on ? "white" : c.color }} />
                  {c.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bouton créer — à droite sous les filtres, compact */}
        <div className="mt-3 flex justify-end">
          <Link
            href="/activites/creer"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="h-3.5 w-3.5" /> Créer une activité
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-12 text-center text-sm text-[var(--muted-text)]">Chargement…</div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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