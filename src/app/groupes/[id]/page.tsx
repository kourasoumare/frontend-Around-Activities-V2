"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PageShell, Avatar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getGroupByIdApi, getGroupMessagesApi, joinGroupApi, leaveGroupApi, ApiError } from "@/lib/api";
import { BackendGroup, Message } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useSocketContext } from "@/context/SocketContext";
import { Calendar, MapPin, Users, Send, ChevronLeft, Navigation, Map as MapIcon } from "lucide-react";

const CAT_CONFIG: Record<string, { color: string; label: string }> = {
  "Sport & Fitness":      { color: "#4A8C5E", label: "Sport" },
  "Art & Culture":        { color: "#8E5BA8", label: "Art" },
  "Restaurant & Cuisine": { color: "#C4603A", label: "Cuisine" },
  "Musique & Événements": { color: "#D4A547", label: "Musique" },
  "Bien-être & Détente":  { color: "#6BA89B", label: "Bien-être" },
  "Tech & Jeux vidéo":    { color: "#4B6CB7", label: "Tech" },
  "Nature & Plein air":   { color: "#6B8E4E", label: "Nature" },
  "Rencontres & Chill":   { color: "#C97A8E", label: "Chill" },
};

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

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    getGroupByIdApi(Number(id))
      .then((data) => {
        setGroup(data as BackendGroup);
        const uid = currentUser.id;
        const member = (data as BackendGroup).memberships?.some((m) => m.user_id === uid) ?? false;
        setIsMember(member || (data as BackendGroup).creator_id === uid);
      })
      .catch(() => setGroup(null))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        showToast("Tu as quitté le groupe.", "success");
      } else {
        await joinGroupApi(group.id);
        setIsMember(true);
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

  const cat = group.activities ? (CAT_CONFIG[group.activities.category] ?? { color: "#C4603A", label: group.activities.category }) : null;
  const taken = group.memberships?.length ?? 0;
  const isCreator = group.creator_id === currentUser.id;
  const dateStr = new Date(group.meeting_date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  const address = encodeURIComponent(`${group.location}, ${group.city}`);

  return (
    <PageShell variant="group">
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        {group.activities ? (
          <Link href={`/activites/${group.activities.id}`} className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] hover:text-[var(--foreground)]">
            <ChevronLeft className="h-4 w-4" /> {group.activities.title}
          </Link>
        ) : (
          <Link href="/home" className="inline-flex items-center gap-1 text-sm text-[var(--muted-text)] hover:text-[var(--foreground)]">
            <ChevronLeft className="h-4 w-4" /> Explorer
          </Link>
        )}

        <div className="mt-3">
          {cat && <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</span>}
          <h1 className="mt-1 font-display text-4xl font-bold sm:text-5xl">{group.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="pill"><Calendar className="h-3.5 w-3.5" /> {dateStr}</span>
            <span className="pill"><MapPin className="h-3.5 w-3.5" /> {group.location}</span>
            <span className="pill"><Users className="h-3.5 w-3.5" /> {taken} / {group.max_members}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Group chat */}
            <div className="glass-card flex h-[420px] flex-col">
              <div className="border-b border-[var(--border)] px-5 py-3 text-sm font-semibold">Chat du groupe</div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.length === 0 && (
                  <div className="py-8 text-center text-sm text-[var(--muted-text)]">
                    {isMember ? "Sois le premier à écrire !" : "Rejoins le groupe pour écrire."}
                  </div>
                )}
                {messages.map((m, i) => {
                  const isMe = m.sender_id === currentUser.id;
                  return (
                    <div key={i} className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
                      {!isMe && <Avatar name={m.sender?.first_name ?? "?"} size={28} />}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe ? "text-white" : "bg-white/80"}`}
                        style={isMe ? { background: "var(--gradient-primary)" } : undefined}
                      >
                        {!isMe && <p className="mb-0.5 text-xs font-semibold opacity-70">{m.sender?.first_name}</p>}
                        {m.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              {isMember ? (
                <form
                  className="flex items-center gap-2 border-t border-[var(--border)] p-3"
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                >
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Écris un message…" className="field !py-2.5" />
                  <button className="btn-primary !p-3"><Send className="h-4 w-4" /></button>
                </form>
              ) : (
                <div className="border-t border-[var(--border)] p-3 text-center text-sm text-[var(--muted-text)]">
                  Rejoins le groupe pour participer au chat
                </div>
              )}
            </div>

            {/* About */}
            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-bold">À propos de cette sortie</h2>
              <p className="mt-2 text-[var(--muted-text)]">{group.description}</p>
            </div>

            {/* Members */}
            {group.memberships && group.memberships.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-bold">Membres ({taken})</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {group.memberships.map((m) => {
                    const u = m.users ?? { id: m.user_id, first_name: "?", last_name: "" };
                    const name = `${(u as any).first_name ?? ""} ${(u as any).last_name ?? ""}`.trim();
                    return (
                      <Link
                        key={m.id}
                        href={`/profil/${m.user_id}`}
                        className="flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 hover:bg-white"
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

          {/* Sidebar */}
          <aside>
            <div className="glass-card sticky top-24 p-6">
              {isCreator ? (
                <span className="pill pill-active mb-3 w-full justify-center" style={{ background: "var(--gradient-primary)" }}>
                  Tu es organisateur
                </span>
              ) : (
                <button onClick={handleJoinLeave} className={`w-full ${isMember ? "btn-secondary" : "btn-primary"}`}>
                  {isMember ? "Quitter le groupe" : "Rejoindre"}
                </button>
              )}

              <div className="mt-5 grid gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-start !py-2.5 text-sm"
                >
                  <MapIcon className="h-4 w-4" /> Ouvrir dans Maps
                </a>
                <a
                  href={`https://citymapper.com/directions?endname=${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-start !py-2.5 text-sm"
                >
                  <Navigation className="h-4 w-4" /> Itinéraire CityMapper
                </a>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                {[
                  { label: "Quand", value: new Date(group.meeting_date).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) },
                  { label: "Lieu", value: group.location },
                  { label: "Ville", value: group.city },
                  { label: "Places", value: `${group.max_members - taken} restantes` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3 border-b border-[var(--border)] py-1.5 last:border-0">
                    <span className="text-[var(--muted-text)]">{label}</span>
                    <span className="text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
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
