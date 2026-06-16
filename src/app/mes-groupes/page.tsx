"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getMyActivitiesApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Activity, getCategoryOption, getCategoryImage } from "@/lib/data";
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
                ? { background: "var(--secondary-action)", color: "white" }
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
                : { color: "#C4603A", label: a.category };
              const groupCount = a._count?.groups ?? 0;
              const memberCount = a._count?.activity_members ?? 0;
              const img = getCategoryImage(a.category);

              return (
                <div key={a.id} className="glass-card glass-card-hover overflow-hidden flex flex-col sm:flex-row sm:items-center">
                  {/* Image catégorie en fond à gauche */}
                  <div
                    className="relative h-28 w-full shrink-0 sm:h-full sm:w-28"
                    style={{ minHeight: 80 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={cat.label} className="h-full w-full object-cover" style={{ minHeight: 80 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)" }} />
                    <span
                      className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: cat.color }}
                    >
                      {cat.label}
                    </span>
                  </div>

                  {/* Infos */}
                  <div className="flex flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-lg font-bold">{a.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[var(--muted-text)]">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.city}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {groupCount} sortie{groupCount !== 1 ? "s" : ""}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {memberCount} membre{memberCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Link href={`/activites/${a.id}`} className="btn-primary !py-2 text-sm">Voir</Link>
                    </div>
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