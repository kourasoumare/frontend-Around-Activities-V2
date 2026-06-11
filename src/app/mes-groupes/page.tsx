"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getMyActivitiesApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Activity, getCategoryOption } from "@/lib/data";
import { MapPin, Users, Calendar } from "lucide-react";

function MesActivitesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"joined" | "created">(tabParam === "created" ? "created" : "joined");
  const [joined, setJoined] = useState<Activity[]>([]);
  const [created, setCreated] = useState<Activity[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    getMyActivitiesApi()
      .then((data) => {
        setJoined(data.joined ?? []);
        setCreated(data.created ?? []);
      })
      .catch(() => showToast("Erreur lors du chargement des activités.", "error"));
  }, []);

  const list = activeTab === "joined" ? joined : created;

  return (
    <PageShell variant="home">
      <div className="mx-auto max-w-5xl px-4 pt-8 md:px-8">
        <h1 className="font-display text-4xl font-bold">Mes activités</h1>
        <p className="mt-1 text-[var(--muted-text)]">Suis tes communautés et tes sorties à venir.</p>

        <div className="mt-6 flex gap-1 rounded-full bg-white/60 p-1 backdrop-blur w-fit">
          {(["joined", "created"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="rounded-full px-5 py-2 text-sm font-medium transition"
              style={activeTab === t
                ? { background: "var(--gradient-primary)", color: "white", boxShadow: "var(--shadow-warm)" }
                : { color: "var(--muted-text)" }
              }
            >
              {t === "joined" ? `Rejointes (${joined.length})` : `Créées (${created.length})`}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {list.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <p className="text-[var(--muted-text)]">
                {activeTab === "joined" ? "Tu n'as pas encore rejoint d'activité." : "Tu n'as pas encore créé d'activité."}
              </p>
              <Link href="/home" className="btn-primary mt-4 inline-flex">Explorer</Link>
            </div>
          ) : (
            list.map((a) => {
              const category = getCategoryOption(a.category);
              const cat = category
                ? { color: category.color, label: category.shortLabel }
                : { color: "#C4603A", label: "A" };
              const groupCount = a._count?.groups ?? 0;
              const memberCount = a._count?.activity_members ?? 0;

              return (
                <div key={a.id} className="glass-card glass-card-hover flex flex-col items-stretch gap-4 p-5 sm:flex-row sm:items-center">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white font-display text-xl font-bold"
                    style={{ background: cat.color }}
                  >
                    {cat.label[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
                      {cat.label}
                    </p>
                    <h3 className="truncate font-display text-lg font-bold">{a.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[var(--muted-text)]">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.city}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {groupCount} sortie{groupCount !== 1 ? "s" : ""}</span>
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {memberCount} membre{memberCount !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link href={`/activites/${a.id}`} className="btn-primary !py-2 text-sm">Voir</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default function MesActivitesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <PageShell variant="home">
          <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
        </PageShell>
      }>
        <MesActivitesContent />
      </Suspense>
    </ProtectedRoute>
  );
}