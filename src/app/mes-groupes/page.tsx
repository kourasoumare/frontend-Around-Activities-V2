"use client";

import { useState } from "react";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { MY_GROUPS } from "@/lib/data";

export default function MesGroupesPage() {
  const [activeTab, setActiveTab] = useState<"joined" | "created">("joined");
  const [groups, setGroups] = useState(MY_GROUPS);

  function retirerGroupe(id: number) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  const joined = groups.filter((g) => !g.isOrganizer);
  const created = groups.filter((g) => g.isOrganizer);

  const current = activeTab === "joined" ? joined : created;

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-ink px-8 pt-10 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-head text-4xl font-black text-white tracking-tight">
  Mes{" "}
  <span
    style={{
      background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    groupes
  </span>
</h1>
          <p className="text-white text-sm mt-2">
            Suis et gère toutes tes sorties
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-8 -mt-8 relative z-10">
        {/* Tabs */}
        <div className="bg-bg-2 rounded-xl p-1 flex gap-1 mb-6">
          <button
            className={`tab-btn ${activeTab === "joined" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("joined")}
          >
            Groupes rejoints ({joined.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "created" ? "tab-btn-active" : ""}`}
            onClick={() => setActiveTab("created")}
          >
            Groupes créés ({created.length})
          </button>
        </div>

        {/* Group list */}
        {current.length > 0 ? (
          <div className="space-y-3">
            {current.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-2xl p-5 border border-bg-3 flex items-center gap-4 hover:border-tc-light transition-all duration-200"
              >
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink truncate">{group.name}</h3>
                  <p className="text-xs text-ink-3 mt-0.5">
                    {group.activity} · {group.date} · {group.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {group.isOrganizer ? (
                    <button className="btn btn-sm text-red-500 border-red-100 hover:bg-red-50" onClick={() => retirerGroupe(group.id)}>
  🗑 Supprimer
</button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => retirerGroupe(group.id)}>Quitter</button>
                  )}
                  <Link
                    href={`/groupes/${group.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">
              {activeTab === "joined" ? "🔍" : "✨"}
            </div>
            <p className="font-semibold text-ink mb-2">
              {activeTab === "joined"
                ? "Tu n'as pas encore rejoint de groupe"
                : "Tu n'as pas encore créé de groupe"}
            </p>
            <p className="text-sm text-ink-3 mb-6">
              {activeTab === "joined"
                ? "Explore les activités et rejoins un groupe qui te correspond."
                : "Lance ta première sortie et invite des gens à te rejoindre."}
            </p>
            <Link href="/home" className="btn btn-primary">
              Explorer les activités
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
