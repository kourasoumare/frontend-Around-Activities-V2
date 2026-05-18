"use client";

import { useState } from "react";
import { AppNavbar } from "@/components/Navbar";
import { ActivityCard } from "@/components/ActivityCard";
import { ACTIVITIES, CATEGORIES, MOCK_USER } from "@/lib/data";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [search, setSearch] = useState("");

  const filtered = ACTIVITIES.filter((a) => {
    const matchCat = activeCategory === "Tout" || a.category === activeCategory;
    const matchSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-ink px-8 pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_80%_50%,rgba(196,96,58,0.2)_0%,transparent_70%)]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-black text-sm mb-1">Bonjour,</p>
          <h1 className="font-head text-3xl md:text-4xl font-black text-black tracking-tight mb-8">
            {MOCK_USER.firstName} de{" "}
            <span className="text-tc">{MOCK_USER.city}</span> 
          </h1>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white rounded-full px-5 py-2 max-w-xl shadow-xl">
            <span className="text-ink-3">🔍</span>
            <input
              type="text"
              placeholder="Cherche une activité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none bg-transparent font-body text-sm text-ink outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-ink-3 hover:text-ink text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap mt-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={
                  cat === activeCategory ? "cat-pill-active" : "cat-pill-inactive"
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activity grid ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 -mt-12 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-head text-2xl tracking-tight">
            {activeCategory === "Tout"
              ? "Activités populaires"
              : activeCategory}{" "}
            <span className="text-ink-3 text-base font-body font-normal">
              à {MOCK_USER.city}
            </span>
          </h2>
          <span className="text-xs text-ink-3">{filtered.length} activité{filtered.length > 1 ? "s" : ""}</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-ink-3">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-ink mb-2">Aucun résultat</p>
            <p className="text-sm">Essaie une autre catégorie ou un autre mot-clé.</p>
          </div>
        )}
      </div>
    </div>
  );
}
