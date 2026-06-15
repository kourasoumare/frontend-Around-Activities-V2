"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivityByIdApi, joinGroupApi, ApiError } from "@/lib/api";
import { Activity, BackendGroup, getCategoryOption } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { Calendar, MapPin } from "lucide-react";

function TousLesGroupesContent() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinedGroupIds, setJoinedGroupIds] = useState<number[]>([]);

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    getActivityByIdApi(Number(id))
      .then((data) => setActivity(data as Activity))
      .catch(() => setActivity(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleJoinGroup(groupId: number) {
    try {
      await joinGroupApi(groupId);
      setJoinedGroupIds((prev) => [...prev, groupId]);
      showToast("Tu as rejoint le groupe !", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        showToast("Tu es déjà membre.", "error");
      } else {
        showToast("Impossible de rejoindre.", "error");
      }
    }
  }

  if (loading) return (
    <PageShell variant="home">
      <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
    </PageShell>
  );

  if (!activity) return (
    <PageShell variant="home">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="glass-card p-10">
          <h3 className="font-display text-xl font-bold">Activité introuvable</h3>
          <Link href="/home" className="btn-primary mt-4 inline-flex">← Explorer</Link>
        </div>
      </div>
    </PageShell>
  );

  const groups = (activity.groups ?? []) as BackendGroup[];
  const category = getCategoryOption(activity.category);
  const cat = category ? { color: category.color, label: category.shortLabel } : { color: "#C4603A", label: activity.category };

  return (
    <PageShell variant="home">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/activites/${id}`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-[var(--muted-text)] hover:text-[var(--primary)]"
          >
            ← {activity.title}
          </Link>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Groupes disponibles</h1>
          <p className="mt-1 text-sm text-[var(--muted-text)]">
            {activity.title} · {groups.length} sortie{groups.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grille de groupes */}
        {groups.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-[var(--muted-text)]">Aucune sortie pour le moment.</p>
            <Link href={`/groupes/creer?activityId=${id}`} className="btn-primary mt-4 inline-flex">
              Proposer une sortie
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => {
              const dateStr = g.meeting_date
                ? new Date(g.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                : null;
              const timeStr = g.meeting_date
                ? new Date(g.meeting_date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                : null;
              const memberCount = g.memberships?.length ?? 0;
              const wasAlreadyMember = g.memberships?.some((m) => m.user_id === currentUser.id) ?? false;
              const justJoined = joinedGroupIds.includes(g.id);
              const isGroupMember = wasAlreadyMember || justJoined;
              const currentMemberCount = memberCount + (justJoined && !wasAlreadyMember ? 1 : 0);

              return (
                <div key={g.id} className="glass-card p-5">
                  <h3 className="font-display font-bold text-lg">{g.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted-text)]">
                    {dateStr && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {dateStr} à {timeStr}
                      </span>
                    )}
                    {g.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {g.location}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-text)]">
                    <span>{currentMemberCount} / {g.max_members} membres</span>
                    <span>{g.max_members - currentMemberCount} places</span>
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-[var(--border)]">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${(currentMemberCount / g.max_members) * 100}%`,
                        background: cat.color
                      }}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {isGroupMember ? (
                      <span className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--muted-text)]">
                        Déjà membre ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(g.id)}
                        className="btn-primary !py-2 !text-xs"
                      >
                        Rejoindre
                      </button>
                    )}
                    <Link
                      href={`/groupes/${g.id}`}
                      className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium transition hover:bg-white/80"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Proposer une sortie */}
        <div className="mt-6 text-center">
          <Link
            href={`/groupes/creer?activityId=${id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-text)] hover:text-[var(--primary)]"
          >
            + Proposer une nouvelle sortie
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export default function TousLesGroupesPage() {
  return (
    <ProtectedRoute>
      <TousLesGroupesContent />
    </ProtectedRoute>
  );
}