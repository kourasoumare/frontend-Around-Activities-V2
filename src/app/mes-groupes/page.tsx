"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getMyGroupsApi, leaveGroupApi, deleteGroupApi, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { getCategoryOption, MyGroup } from "@/lib/data";
import { Calendar, MapPin } from "lucide-react";

function MesGroupesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"joined" | "created">(tabParam === "created" ? "created" : "joined");
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentUserId(JSON.parse(stored).id);
  }, []);

  useEffect(() => {
    getMyGroupsApi()
      .then((raw) => {
        const arr = Array.isArray(raw) ? raw : (raw as any)?.groups ?? [];
        setGroups(arr as MyGroup[]);
      })
      .catch(() => showToast("Erreur lors du chargement des groupes.", "error"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  async function quitter(id: number) {
    try {
      await leaveGroupApi(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      showToast("Vous avez quitté le groupe.", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setGroups((prev) => prev.filter((g) => g.id !== id));
        showToast("Vous avez quitté le groupe.", "success");
      } else {
        showToast("Impossible de quitter ce groupe.", "error");
      }
    }
  }

  async function supprimer(id: number) {
    try {
      await deleteGroupApi(id);
      setGroups((prev) => prev.filter((g) => g.id !== id));
      showToast("Groupe supprimé.", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        showToast("Vous n'êtes pas autorisé à supprimer ce groupe.", "error");
      } else {
        showToast("Erreur lors de la suppression.", "error");
      }
    }
  }

  const joined = groups.filter((g) => g.creator_id !== currentUserId);
  const created = groups.filter((g) => g.creator_id === currentUserId);
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
              {t === "joined" ? `Mes activités rejoints (${joined.length})` : `Mes activités créées (${created.length})`}
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
            list.map((g) => {
              const category = getCategoryOption(g.activities?.category);
              const cat = category ? { color: category.color, label: category.shortLabel } : { color: "#C4603A", label: "A" };
              const dateStr = new Date(g.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
              const isCreator = g.creator_id === currentUserId;
              return (
                <div key={g.id} className="glass-card glass-card-hover flex flex-col items-stretch gap-4 p-5 sm:flex-row sm:items-center">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white font-display text-xl font-bold"
                    style={{ background: cat.color }}
                  >
                    {cat.label[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
                      {g.activities?.title ?? "Groupe"}
                    </p>
                    <h3 className="truncate font-display text-lg font-bold">{g.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[var(--muted-text)]">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {dateStr}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {g.location?.split(",")[0]}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {isCreator ? (
                      <button onClick={() => supprimer(g.id)} className="btn-secondary !py-2 text-sm">Supprimer</button>
                    ) : (
                      <button onClick={() => quitter(g.id)} className="btn-secondary !py-2 text-sm">Quitter</button>
                    )}
                    <Link href={`/groupes/${g.id}`} className="btn-primary !py-2 text-sm">Voir</Link>
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

export default function MesGroupesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <PageShell variant="home">
          <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
        </PageShell>
      }>
        <MesGroupesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
