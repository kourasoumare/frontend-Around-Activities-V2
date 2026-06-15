"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PageShell, Avatar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getGroupByIdApi, getGroupMessagesApi, joinGroupApi, leaveGroupApi, ApiError } from "@/lib/api";
import { BackendGroup, getCategoryOption, Message } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useSocketContext } from "@/context/SocketContext";
import { Calendar, MapPin, Users, Send, ChevronLeft, Navigation, Map as MapIcon } from "lucide-react";

type MobileTab = "details" | "chat";

function GroupDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  const { socket } = useSocketContext();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [group, setGroup] = useState<BackendGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("details");
  const [memberCount, setMemberCount] = useState(0);

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    getGroupByIdApi(Number(id))
      .then((data) => {
        const g = data as BackendGroup;
        setGroup(g);
        setMemberCount(g.memberships?.length ?? 0);
        const uid = currentUser.id;
        const member = g.memberships?.some((m) => m.user_id === uid) ?? false;
        setIsMember(member || g.creator_id === uid);
      })
      .catch(() => setGroup(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    getGroupMessagesApi(Number(id))
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, [id]);

  useEffect(() => {
    if (!socket || !group) return;
    socket.emit("join_group", group.id);
    socket.on("new_message", (msg: Message) => {
      if (msg.group_id === group.id) {
        setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
      }
    });
    return () => { socket.off("new_message"); };
  }, [socket, group]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleJoinLeave() {
    if (!group) return;
    try {
      if (isMember) {
        await leaveGroupApi(group.id);
        setIsMember(false);
        setMemberCount((prev) => prev - 1);
        showToast("Tu as quitté le groupe.", "success");
      } else {
        await joinGroupApi(group.id);
        setIsMember(true);
        setMemberCount((prev) => prev + 1);
        showToast("Tu as rejoint le groupe !", "success");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        showToast("Tu es déjà membre.", "error");
      } else {
        showToast("Erreur.", "error");
      }
    }
  }

  function sendMessage() {
    if (!draft.trim() || !socket || !group) return;
    socket.emit("send_message", { group_id: group.id, content: draft.trim() });
    setDraft("");
  }

  if (loading) return (
    <PageShell variant="group">
      <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
    </PageShell>
  );

  if (!group) return (
    <PageShell variant="group">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="glass-card p-10">
          <h3 className="font-display text-xl font-bold">Groupe introuvable</h3>
          <Link href="/home" className="btn-primary mt-4 inline-flex">← Explorer</Link>
        </div>
      </div>
    </PageShell>
  );

  const category = getCategoryOption(group.activities?.category);
  const cat = category ? { color: category.color, label: category.shortLabel } : null;
  const isCreator = group.creator_id === currentUser.id;
  const dateStr = new Date(group.meeting_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = new Date(group.meeting_date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const address = encodeURIComponent(`${group.location}, ${group.city}`);

  return (
    <PageShell variant="group">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {group.activities ? (
              <Link href={`/activites/${group.activities.id}`} className="mb-2 inline-flex items-center gap-1 text-sm text-[var(--muted-text)] hover:text-[var(--primary)]">
                <ChevronLeft className="h-4 w-4" /> {group.activities.title}
              </Link>
            ) : (
              <Link href="/home" className="mb-2 inline-flex items-center gap-1 text-sm text-[var(--muted-text)] hover:text-[var(--primary)]">
                <ChevronLeft className="h-4 w-4" /> Explorer
              </Link>
            )}
            <h1 className="font-display text-3xl font-bold md:text-4xl">{group.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-text)]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {dateStr} à {timeStr}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {group.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {memberCount} / {group.max_members}
              </span>
              {cat && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ background: cat.color }}
                >
                  {cat.label}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0">
            {isCreator ? (
              <span className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted-text)]">
                Tu es organisateur
              </span>
            ) : (
              <button onClick={handleJoinLeave} className={isMember ? "rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted-text)] transition hover:bg-white/60" : "btn-primary"}>
                {isMember ? "Quitter le groupe" : "Rejoindre le groupe"}
              </button>
            )}
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="mb-4 flex gap-1 rounded-full bg-white/60 p-1 backdrop-blur w-fit md:hidden">
          {(["details", "chat"] as MobileTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setMobileTab(t)}
              className="rounded-full px-4 py-2 text-sm font-medium transition"
              style={mobileTab === t
               ? { background: "var(--secondary-action)", color: "white" }
               : { color: "var(--muted-text)" }
}
            >
              {t === "details" ? "Détails" : "Chat"}
            </button>
          ))}
        </div>

        {/* Layout 2 colonnes */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Colonne gauche — Détails + Membres */}
          <div className={`flex flex-col gap-4 ${mobileTab !== "details" ? "hidden md:flex" : "flex"}`}>

            {/* Détails */}
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-bold mb-4">Détails</h2>
              {group.description && (
                <p className="text-sm text-[var(--muted-text)]">{group.description}</p>
              )}
              <div className="mt-5 flex flex-col gap-2">
                {!isCreator && (
                  <button
                    onClick={handleJoinLeave}
                    className={isMember ? "rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--muted-text)] transition hover:bg-white/60 w-full" : "btn-primary w-full"}
                  >
                    {isMember ? "Quitter le groupe" : "Rejoindre le groupe"}
                  </button>
                )}
                <a href={"https://www.google.com/maps/dir/?api=1&destination=" + address} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-sm font-medium transition hover:bg-white">
                  <MapIcon className="h-4 w-4" /> Ouvrir dans Maps
                </a>
                <a href={"https://citymapper.com/directions?endname=" + address} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-sm font-medium transition hover:bg-white">
                  <Navigation className="h-4 w-4" /> Itinéraire CityMapper
                </a>
              </div>
            </div>

             
            

            {/* Membres */}
            {group.memberships && group.memberships.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-display text-lg font-bold mb-4">Membres ({memberCount})</h2>
                <div className="flex flex-wrap gap-3">
                  {group.memberships.map((m) => {
                    const u = m.users ?? { id: m.user_id, first_name: "?", last_name: "" };
                    const name = `${(u as any).first_name ?? ""} ${(u as any).last_name ?? ""}`.trim();
                    return (
                      <Link
                        key={m.id}
                        href={`/profil/${m.user_id}`}
                        className="flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 hover:bg-white transition"
                      >
                        <Avatar name={name || "?"} size={32} />
                        <span className="text-sm font-medium">{(u as any).first_name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite — Chat */}
          <div className={`${mobileTab !== "chat" ? "hidden md:flex" : "flex"} flex-col`} style={{ height: "70vh" }}>
            <div className="glass-card flex flex-col h-full">
              <div className="border-b border-[var(--border)] px-5 py-4">
                <h2 className="font-display text-lg font-bold">Chat du groupe</h2>
                <p className="text-xs text-[var(--muted-text)]">{group.name}</p>
              </div>

              {isMember ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                    <div ref={chatEndRef} />
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
                    <p className="font-display font-bold">Rejoins le groupe pour discuter</p>
                    <p className="mt-1 text-sm text-[var(--muted-text)]">Le chat est réservé aux membres de ce groupe.</p>
                  </div>
                  <button onClick={handleJoinLeave} className="btn-primary">
                    Rejoindre le groupe
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default function GroupDetailPage() {
  return (
    <ProtectedRoute>
      <GroupDetailContent />
    </ProtectedRoute>
  );
}