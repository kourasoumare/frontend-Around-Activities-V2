"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getMyGroupsApi,
  getUserByIdApi,
  getFriendStatusApi,
  sendFriendRequestApi,
  acceptFriendRequestApi,
  refuseFriendRequestApi,
} from "@/lib/api";
import { MyGroup, FriendStatus } from "@/lib/data";
import { useSocketContext } from "@/context/SocketContext";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserData = Record<string, any>;

export default function ProfilPage() {
  const params = useParams();
  const profileId = params.id as string;
  const { pendingRequests, removePendingRequest } = useSocketContext();
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(null);
  const [loadingFriend, setLoadingFriend] = useState(false);

  const currentUser: UserData =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const isOwnProfile = String(currentUser.id) === String(profileId);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const fetched = await getUserByIdApi(Number(profileId));
        const userData = fetched as UserData;
        setProfileUser(userData);

        if (isOwnProfile) {
          localStorage.setItem("user", JSON.stringify({ ...currentUser, ...userData }));
          const myGroups = await getMyGroupsApi();
          setGroups(Array.isArray(myGroups) ? (myGroups as MyGroup[]) : []);
        } else {
          try {
            const status = await getFriendStatusApi(Number(profileId));
            setFriendStatus(status);
          } catch {
            /* silently fail */
          }
        }
      } catch {
        if (isOwnProfile) {
          setProfileUser(currentUser);
          try {
            const myGroups = await getMyGroupsApi();
            setGroups(Array.isArray(myGroups) ? (myGroups as MyGroup[]) : []);
          } catch {
            setGroups([]);
          }
        } else {
          setProfileUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  async function handleSendRequest() {
    setLoadingFriend(true);
    try {
      await sendFriendRequestApi(Number(profileId));
      setFriendStatus({ status: "pending", requester_id: currentUser.id });
    } catch {
      /* silently fail */
    } finally {
      setLoadingFriend(false);
    }
  }

  async function handleAcceptFriend(requestId: number) {
    try {
      await acceptFriendRequestApi(requestId);
      setFriendStatus({ status: "accepted" });
    } catch {
      /* silently fail */
    }
  }

  async function handleRefuseFriend(requestId: number) {
    try {
      await refuseFriendRequestApi(requestId);
      setFriendStatus({ status: "none" });
    } catch {
      /* silently fail */
    }
  }

  async function handleAcceptRequest(requestId: number) {
    try {
      await acceptFriendRequestApi(requestId);
      removePendingRequest(requestId);
    } catch {
      /* silently fail */
    }
  }

  async function handleRefuseRequest(requestId: number) {
    try {
      await refuseFriendRequestApi(requestId);
      removePendingRequest(requestId);
    } catch {
      /* silently fail */
    }
  }

  const user = profileUser;
  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : "?";

  const age = user?.birth_date
    ? (() => {
        const birth = new Date(user.birth_date);
        const today = new Date();
        let a = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
        return a;
      })()
    : null;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : null;

  const recentGroups = groups.slice(0, 3);

  const interests: string[] = (() => {
    if (!user?.interests) return [];
    if (Array.isArray(user.interests)) return user.interests;
    if (Array.isArray(user.users_interests))
      return user.users_interests.map((i: { interest: string }) => i.interest);
    return [];
  })();

  function FriendButton() {
    if (!friendStatus) return null;

    if (friendStatus.status === "accepted") {
      return (
        <div style={{ marginTop: "0.75rem" }}>
          <span style={{ padding: "0.45rem 1rem", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86EFAC", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600 }}>
            ✓ Ami
          </span>
        </div>
      );
    }

    if (friendStatus.status === "pending") {
      if (friendStatus.requester_id === currentUser.id) {
        return (
          <div style={{ marginTop: "0.75rem" }}>
            <span style={{ padding: "0.45rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(250,247,242,0.5)", borderRadius: "0.75rem", fontSize: "0.8rem" }}>
              Demande envoyée
            </span>
          </div>
        );
      }
      return (
        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => handleAcceptFriend(friendStatus.request_id!)}
            style={{ padding: "0.45rem 1rem", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#86EFAC", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Accepter
          </button>
          <button
            onClick={() => handleRefuseFriend(friendStatus.request_id!)}
            style={{ padding: "0.45rem 1rem", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Refuser
          </button>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "0.75rem" }}>
        <button
          onClick={handleSendRequest}
          disabled={loadingFriend}
          style={{ padding: "0.45rem 1.1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", border: "none", color: "#fff", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, cursor: loadingFriend ? "default" : "pointer", fontFamily: "inherit", opacity: loadingFriend ? 0.7 : 1 }}
        >
          {loadingFriend ? "..." : "➕ Ajouter en ami"}
        </button>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>

        <div className="relative z-10">
          <AppNavbar />

          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>Chargement...</div>
          ) : !user && !isOwnProfile ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Profil introuvable.</p>
              <Link href="/home" style={{ color: "#E8924A", textDecoration: "none" }}>← Retour</Link>
            </div>
          ) : (
            <>
              {/* ── HEADER PROFIL ── */}
              <div style={{ padding: "2.5rem 2rem 2rem" }}>
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5rem", marginBottom: "1rem" }}>

                    {/* Avatar */}
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #C4603A, #E8924A)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontSize: "1.75rem", fontWeight: 900, color: "#fff", border: "3px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                      {initials}
                    </div>

                    {/* Nom + infos + bouton ami */}
                    <div style={{ flex: 1 }}>
                      <h1 className="font-head font-black tracking-tight" style={{ fontSize: "1.75rem", color: "#FAF7F2", marginBottom: "0.4rem" }}>
                        {user?.first_name}{" "}
                        <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          {user?.last_name}
                        </span>
                      </h1>
                      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                        {user?.city && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>📍 {user.city}</span>}
                        {user?.origin && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🌍 {user.origin}</span>}
                        {age !== null && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🎂 {age} ans</span>}
                        {user?.language && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🗣️ {user.language}</span>}
                      </div>
                      {!isOwnProfile && <FriendButton />}
                    </div>

                    {/* Droite : modifier + demandes d'amis */}
                    {isOwnProfile && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0, alignItems: "flex-end" }}>
                        <Link href="/profil/modifier" style={{ padding: "0.5rem 1.1rem", background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.3)", color: "#E8924A", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          ✏️ Modifier le profil
                        </Link>
                        {pendingRequests.length > 0 && (
                          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "0.75rem", padding: "0.75rem", minWidth: 220 }}>
                            <h3 style={{ color: "#FAF7F2", fontWeight: 600, fontSize: "0.78rem", marginBottom: "0.5rem" }}>
                              Demandes d&apos;amis ({pendingRequests.length})
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                              {pendingRequests.map((req) => (
                                <div key={req.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #7B2FBE, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                                    {req.requester.first_name[0]}{req.requester.last_name[0]}
                                  </div>
                                  <p style={{ flex: 1, fontSize: "0.78rem", fontWeight: 500, color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {req.requester.first_name} {req.requester.last_name}
                                  </p>
                                  <button onClick={() => handleAcceptRequest(req.id)} style={{ padding: "0.2rem 0.45rem", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#86EFAC", borderRadius: "0.375rem", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>✓</button>
                                  <button onClick={() => handleRefuseRequest(req.id)} style={{ padding: "0.2rem 0.45rem", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", borderRadius: "0.375rem", fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit" }}>✕</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── CONTENT ── */}
              <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Centres d'intérêt */}
                <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                  <h2 style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "1rem", marginBottom: "1.25rem" }}>
                    Centres d&apos;intérêt
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {interests.length > 0 ? (
                      interests.map((tag: string) => (
                        <span key={tag} style={{ background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.25)", color: "#E8924A", padding: "0.35rem 0.9rem", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.85rem" }}>
                        {isOwnProfile
                          ? "Aucun centre d'intérêt renseigné. Clique sur \"Modifier le profil\" pour en ajouter."
                          : "Aucun centre d'intérêt renseigné."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Groupes — seulement sur son propre profil */}
                {isOwnProfile && (
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                      <h2 style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "1rem" }}>Mes groupes</h2>
                      <Link href="/mes-groupes" style={{ fontSize: "0.78rem", color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>
                        Voir tout →
                      </Link>
                    </div>
                    {recentGroups.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {recentGroups.map((group) => {
                          const emoji = CATEGORY_EMOJIS[group.activities?.category ?? ""] || "✨";
                          return (
                            <div key={group.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.04)" }}>
                              <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: "rgba(196,96,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                                {emoji}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.name}</p>
                                <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)" }}>
                                  {group.activities?.title ?? group.activities?.category} ·{" "}
                                  {new Date(group.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                                </p>
                              </div>
                              <Link href={`/groupes/${group.id}`} style={{ padding: "0.35rem 0.7rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAF7F2", borderRadius: "0.5rem", fontSize: "0.75rem", textDecoration: "none" }}>
                                Voir
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.85rem" }}>Tu n&apos;as pas encore rejoint de groupe.</p>
                    )}
                  </div>
                )}
              </div>

              {memberSince && (
                <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 2rem 3rem", textAlign: "center" }}>
                  <p style={{ color: "rgba(250,247,242,0.2)", fontSize: "0.8rem" }}>
                    Membre depuis {memberSince}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
