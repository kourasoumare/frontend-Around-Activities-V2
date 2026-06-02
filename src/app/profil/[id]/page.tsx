"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getUserByIdApi, getMyGroupsApi, getFriendStatusApi,
  sendFriendRequestApi, acceptFriendRequestApi, refuseFriendRequestApi,
  getFriendRequestsApi, ApiError,
} from "@/lib/api";
interface FlatGroup {
  id: number;
  name: string;
  creator_id: number;
  meeting_date: string;
  location: string;
  activities?: { id: number; title?: string; category?: string } | null;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "Sport & Fitness": "⚽", "Art & Culture": "🎨", "Restaurant & Cuisine": "🍳",
  "Musique & Événements": "🎵", "Bien-être & Détente": "🧘", "Tech & Jeux vidéo": "💻",
  "Nature & Plein air": "🌿", "Rencontres & Chill": "📸",
};

interface ProfileUser {
  id: number;
  first_name?: string;
  last_name?: string;
  city?: string;
  origin?: string;
  birth_date?: string;
  language?: string;
  interests?: string[];
  created_at?: string;
}

interface FriendRequest {
  id: number;
  requester_id: number;
  receiver_id: number;
  status: string;
  requester?: { id: number; first_name: string; last_name: string };
}

export default function ProfilPage() {
  const params = useParams();
  const profileId = params.id as string;

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [groups, setGroups] = useState<FlatGroup[]>([]);
  const [friendStatus, setFriendStatus] = useState<{
    status: string | null;
    id?: number;
    requestId?: number;
    requesterId?: number;
    requester_id?: number;
  } | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loadingFriend, setLoadingFriend] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUserId(stored.id ?? null);
  }, []);

  const isOwnProfile = currentUserId !== null && String(currentUserId) === String(profileId);

  useEffect(() => {
    if (currentUserId === null) return;

    getUserByIdApi(profileId).then((data) => {
      const u = data as ProfileUser;
      setProfileUser(u);
      if (isOwnProfile) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, ...u }));
      }
    }).catch(() => {
      if (isOwnProfile) {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        setProfileUser(stored as ProfileUser);
      }
    });

    getMyGroupsApi().then((data) => {
      setGroups(Array.isArray(data) ? (data as FlatGroup[]) : []);
    }).catch(() => {});

    if (!isOwnProfile) {
      getFriendStatusApi(profileId).then((data) => {
        setFriendStatus(data);
      }).catch(() => {});
    } else {
      getFriendRequestsApi().then((reqs) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reqsArray = Array.isArray(reqs) ? reqs : (reqs as any)?.data || (reqs as any)?.requests || [];
        setFriendRequests(reqsArray as FriendRequest[]);
        console.log('friend requests:', reqsArray);
      }).catch(() => {});
    }
  }, [currentUserId, profileId, isOwnProfile]);

  async function handleSendRequest() {
    setLoadingFriend(true);
    try {
      await sendFriendRequestApi(profileId);
      setFriendStatus({ status: "pending", requesterId: currentUserId ?? undefined });
    } catch (err) {
      if (err instanceof ApiError) console.error(err.message);
    } finally { setLoadingFriend(false); }
  }

  async function handleAccept(requestId: number) {
    try {
      await acceptFriendRequestApi(requestId);
      setFriendStatus({ status: "accepted" });
    } catch { /* ignore */ }
  }

  async function handleRefuse(requestId: number) {
    try {
      await refuseFriendRequestApi(requestId);
      setFriendStatus({ status: null });
    } catch { /* ignore */ }
  }

  async function handleAcceptRequest(reqId: number) {
    try {
      await acceptFriendRequestApi(reqId);
      setFriendRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch { /* ignore */ }
  }

  async function handleRefuseRequest(reqId: number) {
    try {
      await refuseFriendRequestApi(reqId);
      setFriendRequests((prev) => prev.filter((r) => r.id !== reqId));
    } catch { /* ignore */ }
  }

  const user = profileUser;
  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#2D1535", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "rgba(250,247,242,0.4)" }}>Chargement...</div>
    </div>
  );

  const initials = user.first_name && user.last_name ? `${user.first_name[0]}${user.last_name[0]}` : "?";
  const age = user.birth_date ? (() => {
    const birth = new Date(user.birth_date!);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  })() : null;
  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;

  const recentGroups = groups.slice(0, 3);

  // Gère camelCase (requesterId) ET snake_case (requester_id) selon ce que renvoie l'API
  const iAmRequester = (friendStatus?.requesterId ?? friendStatus?.requester_id) === currentUserId;
  // ID de la demande en attente (camelCase ou snake_case)
  const pendingRequestId = friendStatus?.requestId ?? friendStatus?.id;

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>

        <div className="relative z-10">
          <AppNavbar />

          {/* Header */}
          <div style={{ padding: "2.5rem 2rem 2rem" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto", marginBottom: "1rem" }}>
              <Link href="/home" style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.8rem", textDecoration: "none" }}>
                ← Retour
              </Link>
            </div>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
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
                      {user.city && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>📍 {user.city}</span>}
                      {user.origin && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🌍 {user.origin}</span>}
                      {age !== null && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🎂 {age} ans</span>}
                      {user.language && <span style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.825rem" }}>🗣️ {user.language}</span>}
                    </div>
                  </div>
                </div>

                {/* Bouton modifier / ami — ne rien afficher tant que currentUserId n'est pas chargé */}
                {currentUserId === null ? null : isOwnProfile ? (
                  <Link href="/profil/modifier"
                    style={{ flexShrink: 0, padding: "0.5rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(250,247,242,0.8)", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 500, textDecoration: "none" }}>
                    ✏️ Modifier le profil
                  </Link>
                ) : (
                  <div style={{ flexShrink: 0 }}>
                    {friendStatus?.status === "accepted" ? (
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ padding: "0.5rem 1rem", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600 }}>
                          ✓ Ami
                        </span>
                        <Link href="/conversations"
                          style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(250,247,242,0.8)", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 500, textDecoration: "none" }}>
                          💬 Envoyer un message
                        </Link>
                      </div>
                    ) : friendStatus?.status === "pending" && iAmRequester ? (
                      <span style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.4)", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 500 }}>
                        ⏳ Demande envoyée
                      </span>
                    ) : friendStatus?.status === "pending" && !iAmRequester ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => pendingRequestId && handleAccept(pendingRequestId)} disabled={loadingFriend || !pendingRequestId}
                          style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", border: "none", color: "#fff", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          Accepter
                        </button>
                        <button onClick={() => pendingRequestId && handleRefuse(pendingRequestId)} disabled={loadingFriend || !pendingRequestId}
                          style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.7)", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <button onClick={handleSendRequest} disabled={loadingFriend}
                        style={{ padding: "0.5rem 1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", border: "none", color: "#fff", borderRadius: "0.75rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                        {loadingFriend ? "..." : "Ajouter en ami"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 2rem 2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Demandes d'amis reçues — propre profil seulement */}
            {isOwnProfile && friendRequests.length > 0 && (
              <div style={{ background: "rgba(196,96,58,0.08)", border: "1px solid rgba(196,96,58,0.2)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                <h2 style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "1rem", marginBottom: "1rem" }}>
                  Demandes d&apos;amis ({friendRequests.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {friendRequests.map((req) => {
                    const name = req.requester ? `${req.requester.first_name} ${req.requester.last_name}` : "Utilisateur";
                    const initials2 = req.requester ? `${req.requester.first_name[0]}${req.requester.last_name[0]}` : "?";
                    return (
                      <div key={req.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Link href={`/profil/${req.requester_id}`}
                          style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #C4603A, #E8924A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>
                          {initials2}
                        </Link>
                        <Link href={`/profil/${req.requester_id}`} style={{ flex: 1, fontWeight: 500, color: "#FAF7F2", fontSize: "0.875rem", textDecoration: "none" }}>
                          {name}
                        </Link>
                        <button onClick={() => handleAcceptRequest(req.id)}
                          style={{ padding: "0.35rem 0.75rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", border: "none", color: "#fff", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                          Accepter
                        </button>
                        <button onClick={() => handleRefuseRequest(req.id)}
                          style={{ padding: "0.35rem 0.75rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.6)", borderRadius: "0.5rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                          Refuser
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Centres d'intérêt */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "1rem", marginBottom: "1.25rem" }}>Centres d&apos;intérêt</h2>
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

            {/* Mes groupes — propre profil seulement */}
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
                    {recentGroups.map((membership) => {
                      const g = membership;
                      const emoji = CATEGORY_EMOJIS[g.activities?.category ?? ""] || "✨";
                      return (
                        <div key={membership.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.04)" }}>
                          <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: "rgba(196,96,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                            {emoji}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</p>
                            <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)" }}>
                              {g.activities?.title ?? g.activities?.category}
                              {g.meeting_date ? ` · ${new Date(g.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}` : ""}
                            </p>
                          </div>
                          <Link href={`/groupes/${g.id}`}
                            style={{ padding: "0.35rem 0.7rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAF7F2", borderRadius: "0.5rem", fontSize: "0.75rem", textDecoration: "none" }}>
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
              <p style={{ color: "rgba(250,247,242,0.2)", fontSize: "0.8rem" }}>Membre depuis {memberSince}</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
