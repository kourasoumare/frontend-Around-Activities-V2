"use client";

import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getMyGroupsApi, getUserByIdApi, getFriendStatusApi,
  sendFriendRequestApi, acceptFriendRequestApi, refuseFriendRequestApi,
} from "@/lib/api";
import { MyGroup, FriendStatus } from "@/lib/data";
import { useSocketContext } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";

type UserData = Record<string, any>;

export default function ProfilPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  const { pendingRequests, removePendingRequest } = useSocketContext();
  const { showToast } = useToast();
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(null);
  const [loadingFriend, setLoadingFriend] = useState(false);

  const currentUser: UserData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
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
            const statusRaw = await getFriendStatusApi(Number(profileId));
            const raw = statusRaw as any;
            setFriendStatus(typeof raw === "string" ? { status: raw } : raw);
          } catch { /* silent */ }
        }
      } catch {
        if (isOwnProfile) {
          setProfileUser(currentUser);
          try {
            const myGroups = await getMyGroupsApi();
            setGroups(Array.isArray(myGroups) ? (myGroups as MyGroup[]) : []);
          } catch { setGroups([]); }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  async function handleAddFriend() {
    setLoadingFriend(true);
    try {
      await sendFriendRequestApi(Number(profileId));
      setFriendStatus({ status: "pending", requester_id: currentUser.id });
      showToast("Demande envoyée !", "success");
    } catch { showToast("Erreur lors de l'envoi.", "error"); }
    finally { setLoadingFriend(false); }
  }

  async function handleAccept(requestId: number) {
    try {
      await acceptFriendRequestApi(requestId);
      setFriendStatus({ status: "accepted" });
      removePendingRequest(requestId);
      showToast("Ami accepté !", "success");
    } catch { showToast("Erreur.", "error"); }
  }

  async function handleRefuse(requestId: number) {
    try {
      await refuseFriendRequestApi(requestId);
      setFriendStatus(null);
      removePendingRequest(requestId);
      showToast("Demande refusée.", "success");
    } catch { showToast("Erreur.", "error"); }
  }

  if (loading) return (
    <ProtectedRoute>
      <div className="page-bg grad-profil" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="page-content" style={{ color: "var(--text-3)" }}>Chargement…</div>
      </div>
    </ProtectedRoute>
  );

  const user = profileUser;
  const interests: string[] = user?.interests ?? [];
  const age = user?.birth_date ? Math.floor((Date.now() - new Date(user.birth_date).getTime()) / (365.25 * 24 * 3600 * 1000)) : null;
  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();

  const incomingRequest = pendingRequests.find((r) => r.requester?.id === Number(profileId));

  return (
    <ProtectedRoute>
      <div className="page-bg grad-profil">
        <div className="page-content">
        <AppNavbar />

        <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
          <button onClick={() => router.back()} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.88rem", fontFamily: "var(--font-body)", marginBottom: "1.5rem", padding: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
            ← Retour
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "clamp(200px,25%,260px) minmax(0,1fr)", gap: "2rem", alignItems: "start" }}>
            {/* ── Sidebar profil ── */}
            <aside>
              {/* Avatar + nom */}
              <div className="card card-pad" style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "var(--tc-grad)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-head)", fontWeight: 900, fontSize: "1.8rem", color: "#fff",
                  margin: "0 auto 1rem",
                  boxShadow: "0 4px 16px rgba(196,96,58,0.30)",
                }}>
                  {initials}
                </div>
                <h1 style={{ fontFamily: "var(--font-head)", fontSize: "1.3rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                  {user?.first_name} {user?.last_name}
                </h1>
                {age && <p style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>{age} ans</p>}
                {user?.city && (
                  <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    {user.city}
                  </p>
                )}
                {user?.language && (
                  <p style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>
                    {user.language}
                  </p>
                )}

                {/* Actions amitié */}
                {!isOwnProfile && (
                  <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {incomingRequest ? (
                      <>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-2)", marginBottom: "0.25rem" }}>
                          Cette personne t&apos;a envoyé une demande d&apos;ami
                        </p>
                        <button className="btn btn-primary btn-block btn-sm" onClick={() => handleAccept(incomingRequest.id)}>
                          ✓ Accepter
                        </button>
                        <button className="btn btn-secondary btn-block btn-sm" onClick={() => handleRefuse(incomingRequest.id)}>
                          ✗ Refuser
                        </button>
                      </>
                    ) : friendStatus?.status === "accepted" ? (
                      <>
                        <button disabled className="btn btn-block btn-sm" style={{ background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid rgba(74,130,96,0.25)", cursor: "default" }}>
                          ✓ Ami
                        </button>
                        <Link href={`/conversations?userId=${profileId}`} className="btn btn-primary btn-block btn-sm">
                          Envoyer un message
                        </Link>
                      </>
                    ) : friendStatus?.status === "pending" ? (
                      friendStatus.requester_id === currentUser.id ? (
                        <button disabled className="btn btn-secondary btn-block btn-sm">
                          Demande envoyée
                        </button>
                      ) : (
                        <>
                          <button className="btn btn-primary btn-block btn-sm" onClick={() => handleAccept(friendStatus.request_id!)}>
                            ✓ Accepter
                          </button>
                          <button className="btn btn-secondary btn-block btn-sm" onClick={() => handleRefuse(friendStatus.request_id!)}>
                            ✗ Refuser
                          </button>
                        </>
                      )
                    ) : (
                      <button className="btn btn-primary btn-block btn-sm" disabled={loadingFriend} onClick={handleAddFriend}>
                        {loadingFriend ? "…" : "Ajouter en ami"}
                      </button>
                    )}
                  </div>
                )}

                {isOwnProfile && (
                  <Link href="/profil/modifier" className="btn btn-secondary btn-block btn-sm" style={{ marginTop: "1rem", textDecoration: "none" }}>
                    Modifier le profil
                  </Link>
                )}
              </div>
            </aside>

            {/* ── Main ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Intérêts */}
              {interests.length > 0 && (
                <div className="card card-pad">
                  <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--text)", marginBottom: "1rem" }}>Centres d&apos;intérêt</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {interests.map((interest: string) => (
                      <span key={interest} style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minHeight: 34,
                        padding: "0.4rem 0.75rem",
                        background: "rgba(253,250,246,0.78)",
                        border: "1px solid var(--border)",
                        borderRadius: "999px",
                        color: "var(--text-2)",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                      }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Groupes (si profil propre) */}
              {isOwnProfile && groups.length > 0 && (
                <div className="card card-pad">
                  <div className="sec-head" style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontFamily: "var(--font-head)", fontSize: "1.1rem", color: "var(--text)" }}>Mes activités</h2>
                    <Link href="/mes-groupes" style={{ fontSize: "0.82rem", color: "var(--tc)", fontWeight: 600, textDecoration: "none" }}>Voir tout →</Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {groups.slice(0, 3).map((g) => (
                      <Link key={g.id} href={`/groupes/${g.id}`} style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.75rem 1rem", background: "var(--surface-1)",
                        border: "1px solid var(--border)", borderRadius: "var(--r)",
                        textDecoration: "none", transition: "all 0.15s",
                      }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--tc-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontWeight: 900, fontSize: "1rem", color: "var(--tc)", flexShrink: 0 }}>
                          {(g.activities?.category ?? g.name)?.[0]?.toUpperCase() ?? "G"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>{g.location}</div>
                        </div>
                        <span style={{ fontSize: "0.78rem", color: "var(--tc)", fontWeight: 600 }}>Voir →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state si pas de contenu */}
              {isOwnProfile && groups.length === 0 && (
                <div className="card card-pad" style={{ textAlign: "center", padding: "3rem" }}>
                  <h3 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>Tu n&apos;as pas encore rejoint d&apos;activité</h3>
                  <p style={{ color: "var(--text-3)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>Explore les activités et rejoins ta première communauté !</p>
                  <Link href="/home" className="btn btn-primary">Explorer les activités</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
