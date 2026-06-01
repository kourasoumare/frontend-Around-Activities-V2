"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Activity } from "@/lib/data";
import { getActivityByIdApi, joinGroupApi, ApiError } from "@/lib/api";
import { useParams, notFound } from "next/navigation";
import { useToast } from "@/context/ToastContext";

/*const CATEGORY_EMOJIS: Record<string, string> = {
  "Sport & Fitness": "⚽",
  "Art & Culture": "🎨",
  "Restaurant & Cuisine": "🍳",
  "Musique & Événements": "🎵",
  "Bien-être & Détente": "🧘",
  "Tech & Jeux vidéo": "💻",
  "Nature & Plein air": "🌿",
  "Rencontres & Chill": "📸",
};*/

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [joinedIds, setJoinedIds] = useState<number[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchActivity = async () => {
      const data = await getActivityByIdApi(Number(id));
      setActivity(data as Activity);
      setLoading(false);
    };
    fetchActivity();
  }, [id]);

  async function handleJoin(groupId: number) {
    setJoiningId(groupId);
    try {
      await joinGroupApi(groupId);
      setJoinedIds((prev) => [...prev, groupId]);
      showToast("Tu as rejoint le groupe !", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        showToast("Tu es déjà membre de ce groupe.", "error");
      } else {
        showToast("Impossible de rejoindre ce groupe.", "error");
      }
    } finally {
      setJoiningId(null);
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#2D1535", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.9rem" }}>Chargement...</div>
    </div>
  );
  if (!activity) return notFound();

  const groups = activity.groups ?? [];
  const groupCount = groups.length;

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.18) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.12) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10">
        <AppNavbar />

        {/* Header */}
        <div style={{ padding: "2.5rem 2rem 3rem", maxWidth: "900px", margin: "0 auto" }}>
          <Link href="/home" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(250,247,242,0.4)", fontSize: "0.8rem", textDecoration: "none", marginBottom: "1.5rem" }}>
            ← Retour aux activités
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>

            <div>
              <h1 className="font-head font-black tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#FAF7F2", lineHeight: 1.1 }}>
                {activity.category}
              </h1>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem" }}>📍 {activity.city}</span>
                <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem" }}>👥 {groupCount} groupe{groupCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Groups list */}
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 4rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 className="font-head font-black" style={{ fontSize: "1.4rem", color: "#FAF7F2" }}>
              Groupes disponibles
            </h2>
            <Link href={`/groupes/creer?activite=${activity.id}`} style={{ padding: "0.5rem 1.25rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", borderRadius: "0.75rem", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
              + Créer un groupe
            </Link>
          </div>

          {groups.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {groups.map((group) => {
                const membersCount = group.memberships?.length ?? 0;
                const isFull = membersCount >= group.max_members;
                const hasJoined = joinedIds.includes(group.id);
                const date = new Date(group.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
                const organizer = group.users ? `${group.users.first_name} ${group.users.last_name}` : "Inconnu";

                return (
                  <div key={group.id} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.25rem", padding: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <h3 style={{ fontWeight: 700, color: "#FAF7F2", fontSize: "1rem" }}>{group.name}</h3>
                        <span style={{ background: isFull ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.12)", border: `1px solid ${isFull ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, color: isFull ? "#fca5a5" : "#86efac", borderRadius: "9999px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: 600, flexShrink: 0 }}>
                          {membersCount}/{group.max_members} membres
                        </span>
                      </div>
                      <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.8rem", marginBottom: "0.75rem", lineHeight: 1.5 }}>{group.description}</p>
                      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                        <span style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.78rem" }}>📅 {date}</span>
                        <span style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.78rem" }}>📍 {group.location}</span>
                        <span style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.78rem" }}>👤 {organizer}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexShrink: 0 }}>
                      <Link href={`/groupes/${group.id}`} style={{ padding: "0.5rem 1.1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#FAF7F2", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none", textAlign: "center", whiteSpace: "nowrap" }}>
                        Voir les détails
                      </Link>
                      {hasJoined ? (
                        <span style={{ padding: "0.5rem 1.1rem", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, textAlign: "center" }}>
                          ✅ Rejoint
                        </span>
                      ) : isFull ? (
                        <span style={{ padding: "0.5rem 1.1rem", background: "rgba(255,255,255,0.04)", color: "rgba(250,247,242,0.3)", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, textAlign: "center" }}>
                          Complet
                        </span>
                      ) : (
                        <button onClick={() => handleJoin(group.id)} disabled={joiningId === group.id} style={{ padding: "0.5rem 1.1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", opacity: joiningId === group.id ? 0.6 : 1 }}>
                          {joiningId === group.id ? "..." : "Rejoindre"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.5rem", padding: "4rem", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
              <p style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "0.5rem" }}>Aucun groupe pour l&apos;instant</p>
              <p style={{ fontSize: "0.875rem", color: "rgba(250,247,242,0.4)", marginBottom: "1.5rem" }}>
                Sois le premier à lancer un groupe pour cette activité !
              </p>
              <Link href={`/groupes/creer?activite=${activity.id}`} style={{ display: "inline-block", padding: "0.75rem 1.75rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", borderRadius: "9999px", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
                Créer le premier groupe
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
