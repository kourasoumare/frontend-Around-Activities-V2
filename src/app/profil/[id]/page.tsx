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
      <div className="page-shell">
        <AppNavbar />
        <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
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
      <div className="page-shell radial-profile">
        <div className="doodle-bg" aria-hidden="true" />
        <AppNavbar />
        <main className="relative z-10 mx-auto max-w-2xl px-4 pb-28 pt-6 md:px-8 md:pb-12">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-1 text-sm text-[var(--muted-text)]"
          >
            ← Retour
          </button>

          {/* Layout vertical — tout empilé */}
          <div className="flex flex-col gap-5">

            {/* Avatar + nom + infos */}
            <div className="glass-card p-6 text-center">
              <div
                className="mx-auto mb-4 grid place-items-center rounded-full font-display text-3xl font-bold text-white"
                style={{
                  width: 88, height: 88,
                  background: "var(--gradient-primary)",
                  boxShadow: "0 4px 20px rgba(196,96,58,0.3)",
                }}
              >
                {initials}
              </div>
              <h1 className="font-display text-2xl font-bold">{user?.first_name} {user?.last_name}</h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-[var(--muted-text)]">
                {age && <span>{age} ans</span>}
                {user?.city && <span>📍 {user.city}</span>}
                {user?.language && <span>🗣 {user.language}</span>}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col gap-2">
                {isOwnProfile ? (
                  <Link href="/profil/modifier" className="btn-secondary !py-2 text-sm">
                    Modifier le profil
                  </Link>
                ) : incomingRequest ? (
                  <>
                    <p className="text-xs text-[var(--muted-text)]">Cette personne t&apos;a envoyé une demande d&apos;ami</p>
                    <button className="btn-primary !py-2 text-sm" onClick={() => handleAccept(incomingRequest.id)}>✓ Accepter</button>
                    <button className="btn-secondary !py-2 text-sm" onClick={() => handleRefuse(incomingRequest.id)}>✗ Refuser</button>
                  </>
                ) : friendStatus?.status === "accepted" ? (
                  <>
                    <button disabled className="rounded-full py-2 text-sm font-semibold" style={{ background: "rgba(74,130,96,0.1)", color: "#4A8260" }}>✓ Ami</button>
                    <Link href={`/conversations?userId=${profileId}`} className="btn-primary !py-2 text-sm">Envoyer un message</Link>
                  </>
                ) : friendStatus?.status === "pending" ? (
                  friendStatus.requester_id === currentUser.id ? (
                    <button disabled className="btn-secondary !py-2 text-sm opacity-60">Demande envoyée</button>
                  ) : (
                    <>
                      <button className="btn-primary !py-2 text-sm" onClick={() => handleAccept(friendStatus.request_id!)}>✓ Accepter</button>
                      <button className="btn-secondary !py-2 text-sm" onClick={() => handleRefuse(friendStatus.request_id!)}>✗ Refuser</button>
                    </>
                  )
                ) : (
                  <button className="btn-primary !py-2 text-sm" disabled={loadingFriend} onClick={handleAddFriend}>
                    {loadingFriend ? "…" : "Ajouter en ami"}
                  </button>
                )}
              </div>
            </div>

            {/* Centres d'intérêt */}
            {interests.length > 0 && (
              <div className="glass-card p-5">
                <h2 className="mb-3 font-display text-lg font-bold">Centres d&apos;intérêt</h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span key={interest} className="pill">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mes activités (profil propre) */}
            {isOwnProfile && (
              <div className="glass-card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold">Mes activités</h2>
                  <Link href="/mes-groupes" className="text-sm font-semibold text-[var(--primary)]">Voir tout →</Link>
                </div>
                {groups.length === 0 ? (
                  <div className="py-6 text-center text-sm text-[var(--muted-text)]">
                    <p>Tu n&apos;as pas encore rejoint d&apos;activité.</p>
                    <Link href="/home" className="btn-primary mt-3 inline-flex text-sm">Explorer</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {groups.slice(0, 3).map((g) => (
                      <Link
                        key={g.id}
                        href={`/groupes/${g.id}`}
                        className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/60 p-3 transition hover:bg-white/80"
                      >
                        <div
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
                          style={{ background: "var(--gradient-primary)" }}
                        >
                          {(g.activities?.category ?? g.name)?.[0]?.toUpperCase() ?? "G"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{g.name}</p>
                          <p className="truncate text-xs text-[var(--muted-text)]">{g.location}</p>
                        </div>
                        <span className="text-xs font-semibold text-[var(--primary)]">Voir →</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}