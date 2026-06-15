"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PageShell, Avatar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivityByIdApi, joinGroupApi, joinActivityApi, leaveActivityApi, getActivityMembersApi, getActivityMessagesApi, ApiError } from "@/lib/api";
import { Activity, BackendGroup, getCategoryOption, Message } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useSocketContext } from "@/context/SocketContext";
import { MapPin, Users, Sparkles, Send, Calendar, Clock, ChevronRight } from "lucide-react";

type MobileTab = "groups" | "chat" | "about";

function ActivityDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  const { socket } = useSocketContext();
  const chatRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<HTMLDivElement>(null);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("groups");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [members, setMembers] = useState<{ id: number; first_name: string; last_name: string; avatar_url?: string }[]>([]);
  

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  const [joinedGroupIds, setJoinedGroupIds] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([
      getActivityByIdApi(Number(id)),
      getActivityMembersApi(Number(id)),
      getActivityMessagesApi(Number(id)),
    ])
      .then(([activityData, membersData, messagesData]) => {
        setActivity(activityData as Activity);
        setMembers(membersData);
        setMessages(messagesData as Message[]);
        setIsMember(membersData.some((m) => m.id === currentUser.id));
      })
      .catch(() => setActivity(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!socket || !isMember) return;
    socket.emit("join_activity", Number(id));
  }, [socket, isMember, id]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new_activity_message", (msg: Message) => {
      setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
    });
    return () => { socket.off("new_activity_message"); };
  }, [socket]);

  function sendMessage() {
    if (!draft.trim() || !socket) return;
    socket.emit("send_activity_message", { activity_id: Number(id), content: draft.trim() });
    setDraft("");
  }

  async function handleJoinActivity() {
    setMemberLoading(true);
    try {
      await joinActivityApi(Number(id));
      setIsMember(true);
      setMembers((prev) => [...prev, { id: currentUser.id, first_name: currentUser.first_name, last_name: currentUser.last_name }]);
      socket?.emit("join_activity", Number(id));
      showToast("Tu as rejoint la communauté !", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        showToast("Tu es déjà membre.", "error");
      } else {
        showToast("Impossible de rejoindre.", "error");
      }
    } finally {
      setMemberLoading(false);
    }
  }

  async function handleLeaveActivity() {
    setMemberLoading(true);
    try {
      await leaveActivityApi(Number(id));
      setIsMember(false);
      setMembers((prev) => prev.filter((m) => m.id !== currentUser.id));
      showToast("Tu as quitté la communauté.", "success");
    } catch {
      showToast("Impossible de quitter.", "error");
    } finally {
      setMemberLoading(false);
    }
  }

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
    <PageShell variant="activity">
      <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
    </PageShell>
  );

  if (!activity) return (
    <PageShell variant="activity">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="glass-card p-10">
          <h3 className="font-display text-xl font-bold">Activité introuvable</h3>
          <Link href="/home" className="btn-primary mt-4 inline-flex">← Explorer</Link>
        </div>
      </div>
    </PageShell>
  );

  const category = getCategoryOption(activity.category);
  const cat = category ? { color: category.color, label: category.shortLabel } : { color: "#C4603A", label: activity.category };
  const groups = (activity.groups ?? []) as BackendGroup[];
  

  return (
    <PageShell variant="activity">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/home" className="mb-2 inline-flex text-sm text-[var(--muted-text)] hover:text-[var(--primary)]">
              ← Explorer
            </Link>
            <h1 className="font-display text-3xl font-bold md:text-4xl">{activity.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-text)]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" style={{ color: cat.color }} />
                {activity.city}
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ background: cat.color }}
              >
                {cat.label}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {members.length} membre{members.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {isMember ? (
              <button
                onClick={handleLeaveActivity}
                disabled={memberLoading}
                className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted-text)] transition hover:bg-white/60"
              >
                Quitter la communauté
              </button>
            ) : (
              <button
                onClick={handleJoinActivity}
                disabled={memberLoading}
                className="btn-primary"
              >
                {memberLoading ? "…" : "Rejoindre la communauté"}
              </button>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="mb-4 flex gap-1 rounded-full bg-white/60 p-1 backdrop-blur w-fit md:hidden">
          {(["groups", "chat", "about"] as MobileTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setMobileTab(t)}
              className="rounded-full px-4 py-2 text-sm font-medium transition"
              style={mobileTab === t
                ? { background: "var(--gradient-primary)", color: "white" }
                : { color: "var(--muted-text)" }
              }
            >
              {t === "groups" ? `Groupes (${groups.length})` : t === "chat" ? "Chat" : "À propos"}
            </button>
          ))}
        </div>

        {/* Desktop layout */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Colonne gauche — Groupes (desktop toujours visible, mobile conditionnel) */}
          <div className={`flex flex-col gap-4 ${mobileTab !== "groups" ? "hidden md:flex" : "flex"}`}>
            <div className="glass-card flex flex-col" style={{ maxHeight: "70vh" }}>
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
                <h2 className="font-display text-lg font-bold">Aperçu des groupes</h2>
                <span className="text-sm text-[var(--muted-text)]">{groups.length} sortie{groups.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Groupes avec scroll indépendant */}
              <div ref={groupsRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {groups.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[var(--muted-text)]">
                    Aucune sortie pour le moment.
                  </div>
                ) : (
                  groups.map((g) => {
                    const dateStr = g.meeting_date
                      ? new Date(g.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
                      : null;
                    const timeStr = g.meeting_date
                      ? new Date(g.meeting_date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                      : null;
                    const wasAlreadyMember = g.memberships?.some((m) => m.user_id === currentUser.id) ?? false;
                    const justJoined = joinedGroupIds.includes(g.id);
                    const memberCount = (g.memberships?.length ?? 0) + (justJoined && !wasAlreadyMember ? 1 : 0);

                    return (
                      <div key={g.id} className="rounded-2xl border border-[var(--border)] bg-white/70 p-4">
                        <h3 className="font-display font-bold">{g.name}</h3>
                        <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-[var(--muted-text)]">
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
                        <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted-text)]">
                          <span>{memberCount} / {g.max_members} membres</span>
                          <span>{g.max_members - memberCount} places</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                         {joinedGroupIds.includes(g.id) || g.memberships?.some((m) => m.user_id === currentUser.id) ? (
                         <span className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--muted-text)]">
                            Déjà membre ✓
                         </span>
                              ) : (
                             <button
                           onClick={() => handleJoinGroup(g.id)}
                            className="btn-primary !py-2 !text-xs">
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
                  })
                )}
              </div>

              {/* Voir plus / Créer */}
              <div className="border-t border-[var(--border)] p-3 flex items-center justify-between">
                {groups.length > 3 && (
                     <Link
                       href={`/activites/${id}/groupes`}
                       className="text-sm font-medium text-[var(--primary)] hover:underline"
                        >
                            Voir tous les groupes ({groups.length})
                      </Link>
)}
                {isMember ? (
                   <Link
                    href={`/groupes/creer?activityId=${id}`}
    className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--muted-text)] hover:text-[var(--primary)]"
  >
    <Sparkles className="h-3.5 w-3.5" /> Proposer une sortie
  </Link>
) : (
  <button
    onClick={() => showToast("Rejoins la communauté pour proposer une sortie.", "error")}
    className="ml-auto flex items-center gap-1 text-sm font-medium text-[var(--muted-text)]"
  >
    <Sparkles className="h-3.5 w-3.5" /> Proposer une sortie
  </button>
)}
              </div>
            </div>

            {/* À propos — en bas de la colonne gauche sur desktop */}
            <div className={`glass-card p-6 ${mobileTab !== "about" ? "hidden md:block" : "block"}`}>
              <h2 className="font-display text-lg font-bold">À propos</h2>
              <p className="mt-2 text-sm text-[var(--muted-text)]">{activity.description}</p>
            </div>
          </div>

          {/* Colonne droite — Chat (desktop toujours visible, mobile conditionnel) */}
          <div className={`${mobileTab !== "chat" ? "hidden md:flex" : "flex"} flex-col`} style={{ height: "70vh" }}>
            <div className="glass-card flex flex-col h-full">
              <div className="border-b border-[var(--border)] px-5 py-4">
                <h2 className="font-display text-lg font-bold">Chat communauté</h2>
                <p className="text-xs text-[var(--muted-text)]">{activity.title}</p>
              </div>

              {isMember ? (
                <>
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="py-8 text-center text-sm text-[var(--muted-text)]">
                        Sois le premier à écrire !
                      </div>
                    ) : (
                      messages.map((m, i) => {
                        const isMe = m.sender_id === currentUser.id;
                        return (
                          <div key={i} className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
                            {!isMe && <Avatar name={m.sender?.first_name ?? "?"} size={28} />}
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? "text-white" : "bg-white/80"}`}
                              style={isMe ? { background: "var(--gradient-primary)" } : undefined}
                            >
                              {!isMe && <p className="mb-0.5 text-xs font-semibold opacity-70">{m.sender?.first_name}</p>}
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <form
                    className="flex items-center gap-2 border-t border-[var(--border)] p-3"
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Écris un message…"
                      className="field !py-2.5"
                    />
                    <button className="btn-primary !p-3"><Send className="h-4 w-4" /></button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center bg-[var(--bg)]/40">
                  <div className="rounded-full bg-[var(--border)] p-4">
                    <Send className="h-6 w-6 text-[var(--muted-text)]" />
                  </div>
                  <div>
                    <p className="font-display font-bold">Rejoins la communauté pour discuter</p>
                    <p className="mt-1 text-sm text-[var(--muted-text)]">Le chat est réservé aux membres de cette activité.</p>
                  </div>
                  <button onClick={handleJoinActivity} disabled={memberLoading} className="btn-primary">
                    Rejoindre la communauté
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* À propos mobile uniquement */}
          <div className={`glass-card p-6 md:hidden ${mobileTab !== "about" ? "hidden" : "block"}`}>
            <h2 className="font-display text-lg font-bold">À propos</h2>
            <p className="mt-2 text-sm text-[var(--muted-text)]">{activity.description}</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default function ActivityDetailPage() {
  return (
    <ProtectedRoute>
      <ActivityDetailContent />
    </ProtectedRoute>
  );
}