"use client";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { GroupCard } from "@/components/GroupCard";
import { useState, useEffect } from "react";
import { Activity } from "@/lib/data";
import { getActivityByIdApi } from "@/lib/api";
import { useParams, notFound } from "next/navigation";

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      const data = await getActivityByIdApi(Number(id));
      setActivity(data as Activity);
      setLoading(false);
    };
    fetchActivity();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!activity) return notFound();
  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-ink px-8 pt-10 pb-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/home"
            className="flex items-center gap-1 text-white/40 text-sm hover:text-white/80 transition-colors mb-6"
          >
            ← Explorer / <span className="text-white/80">{activity.title}</span>
          </Link>

          {/* <div className="text-6xl mb-4">{activity.emoji}</div> */}
          <h1 className="font-head text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            {activity.title}
          </h1>

          <div className="flex gap-3 flex-wrap">
            <span className="meta-pill">🏷️ {activity.category}</span>
            <span className="meta-pill">📍 {activity.city}</span>
            <span className="meta-pill">
              👥 {activity._count?.groups ?? 0} groupe{activity._count?.groups && activity._count?.groups > 1 ? "s" : ""} actif{activity._count?.groups && activity._count?.groups  > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-8 -mt-8 relative z-10">
        {/* Description */}
        <div className="card mb-6">
          <h2 className="font-semibold text-ink mb-3">À propos</h2>
          <p className="text-sm text-ink-2 leading-relaxed">{activity.description}</p>
        </div>

        {/* Groups */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title mb-0">Groupes disponibles</h2>
          <Link
            href={`/groupes/creer?activite=${activity.id}`}
            className="btn btn-primary btn-sm"
          >
            + Créer un groupe
          </Link>
        </div>

        {(activity.groups ?? []).length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {(activity.groups ?? []).map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12 mb-10">
            <div className="text-5xl mb-4">🌱</div>
            <p className="font-semibold text-ink mb-2">Aucun groupe pour l&apos;instant</p>
            <p className="text-sm text-ink-3 mb-6">
              Sois le premier à lancer un groupe pour cette activité !
            </p>
            <Link
              href={`/groupes/creer?activite=${activity.id}`}
              className="btn btn-primary"
            >
              Créer le premier groupe
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
