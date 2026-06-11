"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { PageShell, Avatar } from "@/components/Navbar";
import { GroupCard } from "@/components/GroupCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivityByIdApi, joinGroupApi, ApiError } from "@/lib/api";
import { Activity, BackendGroup, Message } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useSocketContext } from "@/context/SocketContext";
import { MapPin, Calendar, Users, Sparkles, Send } from "lucide-react";

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

type Tab = "about" | "groups" | "chat";
const TABS = [
  { id: "about" as Tab, label: "À propos" },
  { id: "groups" as Tab, label: "Groupes" },
  { id: "chat" as Tab, label: "Chat" },
];

function ActivityDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const { showToast } = useToast();
  const { socket } = useSocketContext();
  const chatRef = useRef<HTMLDivElement>(null);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("about");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    getActivityByIdApi(Number(id))
      .then((data) => setActivity(data as Activity))
      .catch(() => setActivity(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (tab === "chat" && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [tab, messages]);

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

  async function handleJoinGroup(groupId: number) {
    try {
      await joinGroupApi(groupId);
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

  const cat = CAT_CONFIG[activity.category] ?? { color: "#C4603A", label: activity.category };
  const groups = (activity.groups ?? []) as BackendGroup[];
  const totalMembers = groups.reduce((a, g) => a + (g.memberships?.length ?? 0), 0);
  const isCommunityMember = groups.some(
    (g) => g.creator_id === currentUser.id || g.memberships?.some((m) => m.user_id === currentUser.id),
  );

  return (
    <PageShell variant="activity">
      {/* Cover */}
      <div
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${cat.color}, ${cat.color}cc 70%, var(--primary-2))` }}
      >
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/doodle-bg.png')", backgroundSize: "320px", mixBlendMode: "overlay" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <Link href="/home" className="text-sm text-white/85 hover:underline">← Explorer</Link>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {cat.label}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">{activity.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/90">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {activity.city}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {groups.length} sortie{groups.length !== 1 ? "s" : ""}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {totalMembers} membres</span>
          </div>
          <div className="mt-6">
            <button onClick={() => setTab("groups")} className="btn-primary">
              Voir les groupes
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1fr_320px] md:px-8">
        <div>
          {/* Tabs */}
          <div className="mb-6 flex gap-1 rounded-full bg-white/60 p-1 backdrop-blur w-fit">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="rounded-full px-5 py-2 text-sm font-medium transition"
                style={tab === t.id
                  ? { background: "var(--gradient-primary)", color: "white", boxShadow: "var(--shadow-warm)" }
                  : { color: "var(--muted-text)" }
                }
              >
                {t.id === "groups" ? `Groupes (${groups.length})` : t.label}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <div className="glass-card p-7">
              <h2 className="font-display text-2xl font-bold">À propos</h2>
              <p className="mt-3 text-[var(--muted-text)]">{activity.description}</p>
              {groups.length > 0 && (
                <>
                  <h3 className="mt-8 font-display text-lg font-bold">Sorties récentes</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {groups.slice(0, 4).map((g) => (
                      <Link
                        key={g.id}
                        href={`/groupes/${g.id}`}
                        className="flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 hover:bg-white"
                      >
                        <Avatar name={g.name} size={32} />
                        <span className="text-sm font-medium">{g.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "groups" && (
            <div className="grid gap-5 md:grid-cols-2">
              {groups.length === 0 && (
                <div className="glass-card col-span-full p-8 text-center text-[var(--muted-text)]">
                  Aucune sortie pour le moment.
                </div>
              )}
              {groups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
              <Link
                href={`/groupes/creer?activityId=${id}`}
                className="glass-card glass-card-hover col-span-full flex items-center justify-center gap-2 border-dashed p-6 text-[var(--primary)]"
              >
                <Sparkles className="h-4 w-4" /> Proposer une nouvelle sortie
              </Link>
            </div>
          )}

          {tab === "chat" && (
            isCommunityMember ? (
              <div className="glass-card flex h-[560px] flex-col">
                <div className="border-b border-[var(--border)] px-5 py-3 text-sm font-semibold">
                  Chat de la communauté · {activity.title}
                </div>
                <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto p-5">
                  {messages.length === 0 && (
                    <div className="py-8 text-center text-sm text-[var(--muted-text)]">
                      Sois le premier à écrire !
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
              </div>
            ) : (
              <div className="glass-card p-10 text-center">
                <h3 className="font-display text-xl font-bold">Rejoins un groupe pour discuter</h3>
                <p className="mt-2 text-sm text-[var(--muted-text)]">Le chat est réservé aux membres d'une sortie.</p>
                <button onClick={() => setTab("groups")} className="btn-primary mt-4">Voir les groupes</button>
              </div>
            )
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="glass-card sticky top-24 p-6">
            <h3 className="font-display text-lg font-bold">{isCommunityMember ? "Tu es membre" : "Rejoins une sortie"}</h3>
            <p className="mt-1 text-sm text-[var(--muted-text)]">Discute, participe aux sorties, fais-toi de vrais amis.</p>
            <button
              onClick={() => setTab("groups")}
              className="btn-primary mt-4 w-full"
            >
              Voir les groupes
            </button>
            <div className="mt-5 space-y-2 text-sm">
              {[
                { label: "Ville", value: activity.city },
                { label: "Catégorie", value: cat.label },
                { label: "Sorties", value: `${groups.length}` },
                { label: "Membres", value: `${totalMembers}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between border-b border-[var(--border)] py-1.5 last:border-0">
                  <span className="text-[var(--muted-text)]">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
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
