"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMyGroupsApi, joinGroupApi, ApiError } from "@/lib/api";
import { MyGroup } from "@/lib/data";

const CATEGORY_EMOJIS: Record<string, string> = {
  "Sport & Fitness": "⚽",
  "Art & Culture": "🎨",
  "Restaurant & Cuisine": "🍳",
  "Musique & Événements": "🎵",
  "Bien-être & Détente": "🧘",
  "Tech & Jeux vidéo": "💻",
  "Nature & Plein air": "🌿",
  "Rencontres & Chill": "📸",
};

export default function ProfilPage() {
  const params = useParams();
  const profileId = params.id as string;
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [joinedIds, setJoinedIds] = useState<number[]>([]);

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const isOwnProfile = String(currentUser.id) === String(profileId);

  // For own profile, use localStorage data. For other profiles, we'll use the same for now
  // (backend /api/users/:id will be added later)
  const user = isOwnProfile ? currentUser : currentUser; // TODO: fetch other user when backend ready

  const initials = user.first_name && user.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`
    : "?";

  // Calculate age from birth_date
  const age = user.birth_date ? (() => {
    const birth = new Date(user.birth_date);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  })() : null;

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const myGroups = await getMyGroupsApi();
        setGroups(Array.isArray(myGroups) ? myGroups as MyGroup[] : []);
      } catch {
        setGroups([]);
      }
    };
    fetchGroups();
  }, []);

  async function handleJoinGroup(groupId: number) {
    setJoiningId(groupId);
    try {
      await joinGroupApi(groupId);
      setJoinedIds((prev) => [...prev, groupId]);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setJoinedIds((prev) => [...prev, groupId]);
      }
    } finally {
      setJoiningId(null);
    }
  }

  const recentGroups = groups.slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>

        <div className="relative z-10">
          <AppNavbar />

          {/* Header */}
          <div style={{ padding: "2.5rem 2rem 2rem" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #C4603A, #E8924A)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontSize: "1.75rem", fontWeight: 900, color: "#fff", border: "3px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <h1 className="font-head font-black tracking-tight" style={{ fontSize: "1.75rem", color: "#FAF7F2", marginBottom: "0.4rem" }}>
                    {user.first_name}{" "}
                    <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {user.last_name}
                    </span>
                  </h1>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    {user.city && (
                      <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>📍 {user.city}</span>
                    )}
                    {user.origin && (
                      <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🌍 {user.origin}</span>
                    )}
                    {age !== null && (
                      <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🎂 {age} ans</span>
                    )}
                    {user.language && (
                      <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🗣️ {user.language}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Centres d'intérêt */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h2 style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "1rem" }}>Centres d&apos;intérêt</h2>
                {isOwnProfile && (
                  <Link href="/profil/modifier" style={{ padding: "0.35rem 0.9rem", background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.3)", color: "#E8924A", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
                    ✏️ Modifier
                  </Link>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {user.interests && Array.isArray(user.interests) && user.interests.length > 0 ? (
                  user.interests.map((tag: string) => (
                    <span key={tag} style={{ background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.25)", color: "#E8924A", padding: "0.35rem 0.9rem", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.85rem" }}>Aucun centre d&apos;intérêt renseigné.</p>
                )}
              </div>
            </div>

            {/* Groupes */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h2 style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "1rem" }}>
                  {isOwnProfile ? "Mes groupes" : "Groupes"}
                </h2>
                {isOwnProfile && (
                  <Link href="/mes-groupes" style={{ fontSize: "0.78rem", color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>
                    Voir tout →
                  </Link>
                )}
              </div>
              {recentGroups.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {recentGroups.map((membership) => {
                    const group = membership.groups;
                    const emoji = CATEGORY_EMOJIS[group.activities?.category ?? ""] || "✨";
                    const hasJoined = joinedIds.includes(group.id);
                    const isCurrentUserMember = currentUser.id && groups.some(g => g.groups.id === group.id);

                    return (
                      <div key={membership.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.04)" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: "rgba(196,96,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                          {emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)" }}>
                            {group.activities?.title ?? group.activities?.category} · {new Date(group.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                          <Link href={`/groupes/${group.id}`} style={{ padding: "0.35rem 0.7rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAF7F2", borderRadius: "0.5rem", fontSize: "0.75rem", textDecoration: "none" }}>
                            Voir
                          </Link>
                          {!isOwnProfile && !isCurrentUserMember && (
                            <button onClick={() => handleJoinGroup(group.id)} disabled={joiningId === group.id || hasJoined} style={{ padding: "0.35rem 0.7rem", background: hasJoined ? "rgba(34,197,94,0.12)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: hasJoined ? "#86efac" : "#fff", border: "none", borderRadius: "0.5rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                              {hasJoined ? "✓" : joiningId === group.id ? "..." : "Rejoindre"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.85rem" }}>
                  {isOwnProfile ? "Tu n'as pas encore rejoint de groupe." : "Aucun groupe pour le moment."}
                </p>
              )}
            </div>

          </div>

          {/* Membre depuis — en bas sans encadré */}
          {memberSince && (
            <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 2rem 3rem", textAlign: "center" }}>
              <p style={{ color: "rgba(250,247,242,0.2)", fontSize: "0.8rem" }}>
                Membre depuis {memberSince}
              </p>
            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
