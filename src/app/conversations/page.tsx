"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell, Avatar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getFriendsApi, getMyGroupsApi, getMyActivitiesApi, getGroupMessagesApi, getPrivateMessagesApi, getActivityMessagesApi } from "@/lib/api";
import { Friend, Message, MyGroup, Activity } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { useSocketContext } from "@/context/SocketContext";
import { Send, ChevronLeft } from "lucide-react";

type Filter = "all" | "activities" | "friends" | "groups";
type ChatTarget = 
  | { type: "friend"; id: number; name: string }
  | { type: "group"; id: number; name: string }
  | { type: "activity"; id: number; name: string };

function ConversationsContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { socket } = useSocketContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<Filter>("all");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatTarget | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"list" | "chat">("list");

  const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    const load = async () => {
      try {
        const [fr, gr, act] = await Promise.all([
          getFriendsApi(),
          getMyGroupsApi(),
          getMyActivitiesApi(),
        ]);
        const frArr = Array.isArray(fr) ? fr : (fr as any)?.friends ?? [];
        const grArr = Array.isArray(gr) ? gr : (gr as any)?.groups ?? [];
        const actArr = [...((act as any)?.joined ?? []), ...((act as any)?.created ?? [])];
        // Dédupliquer les activités
        const seen = new Set();
        const uniqueAct = actArr.filter((a: Activity) => {
          if (seen.has(a.id)) return false;
          seen.add(a.id);
          return true;
        });
        setFriends(frArr as Friend[]);
        setGroups(grArr as MyGroup[]);
        setActivities(uniqueAct as Activity[]);
      } catch {
        showToast("Erreur de chargement.", "error");
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 // Auto-select from URL param
useEffect(() => {
    const userId = searchParams.get("userId");
    const groupId = searchParams.get("group");
    const activityId = searchParams.get("activity");

    if (userId && friends.length > 0) {
      const friend = friends.find((f) => {
        const frd = (f as any).friend ?? f;
        return String(frd.id) === userId;
      });
      if (friend) {
        const frd = (friend as any).friend ?? friend;
        setSelectedChat({ type: "friend", id: frd.id, name: `${frd.first_name} ${frd.last_name}` });
        setMobilePanel("chat");
      }
    }

    if (groupId && groups.length > 0) {
      const group = groups.find((g) => String(g.id) === groupId);
      if (group) {
        setSelectedChat({ type: "group", id: group.id, name: group.name });
        setMobilePanel("chat");
      }
    }

    if (activityId && activities.length > 0) {
      const activity = activities.find((a) => String(a.id) === activityId);
      if (activity) {
        setSelectedChat({ type: "activity", id: activity.id, name: activity.title });
        setMobilePanel("chat");
      }
    }
  }, [searchParams, friends, groups, activities]);

  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMessages(true);
    setMessages([]);
    const load = async () => {
      try {
        if (selectedChat.type === "group") {
          const msgs = await getGroupMessagesApi(selectedChat.id);
          setMessages(Array.isArray(msgs) ? msgs as Message[] : []);
          socket?.emit("join_group", selectedChat.id);
        } else if (selectedChat.type === "activity") {
          const msgs = await getActivityMessagesApi(selectedChat.id);
          setMessages(Array.isArray(msgs) ? msgs as Message[] : []);
          socket?.emit("join_activity", selectedChat.id);
        } else {
          const msgs = await getPrivateMessagesApi(selectedChat.id);
          setMessages(Array.isArray(msgs) ? msgs as Message[] : []);
          socket?.emit("join_private", { friendId: selectedChat.id });
        }
      } catch { setMessages([]); }
      finally { setLoadingMessages(false); }
    };
    load();
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new_message", (msg: Message) => {
      if (selectedChat?.type === "group" && msg.group_id === selectedChat.id) {
        setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
      }
    });
    socket.on("new_private_message", (msg: Message) => {
      if (selectedChat?.type === "friend" && (msg.sender_id === selectedChat.id || msg.receiver_id === selectedChat.id)) {
        setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
      }
    });
    socket.on("new_activity_message", (msg: Message) => {
      if (selectedChat?.type === "activity") {
        setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
      }
    });
    return () => {
      socket.off("new_message");
      socket.off("new_private_message");
      socket.off("new_activity_message");
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    const content = newMessage.trim();
    if (!content || !selectedChat || !socket) return;
    setNewMessage("");
    if (selectedChat.type === "group") {
      socket.emit("send_message", { group_id: selectedChat.id, content });
    } else if (selectedChat.type === "activity") {
      socket.emit("send_activity_message", { activity_id: selectedChat.id, content });
    } else {
      socket.emit("send_private_message", { receiver_id: selectedChat.id, content });
    }
  }, [newMessage, selectedChat, socket]);

  // Build conversation list
  const friendItems = friends.map((f) => {
    const frd = (f as any).friend ?? f;
    return { id: `friend-${frd.id}`, kind: "friend" as const, rid: frd.id, title: `${frd.first_name ?? ""} ${frd.last_name ?? ""}`.trim(), subtitle: "Message privé" };
  });
  const groupItems = groups.map((g) => ({
    id: `group-${g.id}`, kind: "group" as const, rid: g.id, title: g.name, subtitle: g.activities?.title ?? "Groupe",
  }));
  const activityItems = activities.map((a) => ({
    id: `activity-${a.id}`, kind: "activity" as const, rid: a.id, title: a.title, subtitle: "Chat communauté",
  }));

  const allItems = [...activityItems, ...friendItems, ...groupItems];
  const filtered = filter === "all" ? allItems
    : filter === "activities" ? activityItems
    : filter === "friends" ? friendItems
    : groupItems;

  function selectItem(kind: "friend" | "group" | "activity", rid: number, title: string) {
    setSelectedChat({ type: kind, id: rid, name: title });
    setMobilePanel("chat");
  }

  return (
    <PageShell variant="chat">
      <div className="mx-auto max-w-7xl px-0 pt-4 md:px-8 md:pt-8">
        <div className={`glass-card overflow-hidden md:h-[calc(100vh-160px)] ${mobilePanel === "chat" ? "fixed inset-0 z-50 rounded-none flex flex-col md:relative md:inset-auto md:z-auto md:rounded-3xl md:flex-none" : ""}`}>
          <div className="grid h-full md:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <div className={`border-r border-[var(--border)] ${mobilePanel === "chat" ? "hidden md:block" : "block"}`}>
              <div className="border-b border-[var(--border)] p-4">
                <h2 className="font-display text-xl font-bold">Conversations</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(["all", "activities", "friends", "groups"] as Filter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`pill !py-1 !text-[11px] ${filter === f ? "pill-active" : ""}`}
                      style={filter === f ? { background: "var(--secondary-action)", color: "white" } : undefined}
                    >
                      {f === "all" ? "Tout"
                        : f === "activities" ? `Activités (${activityItems.length})`
                        : f === "friends" ? `Amis (${friendItems.length})`
                        : `Groupes (${groupItems.length})`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-y-auto md:max-h-[calc(100%-90px)]">
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-[var(--muted-text)]">Aucune conversation</div>
                )}
                {filtered.map((it) => {
                  const active = selectedChat?.type === it.kind && selectedChat.id === it.rid;
                  return (
                    <button
                      key={it.id}
                      onClick={() => selectItem(it.kind, it.rid, it.title)}
                      className={`flex w-full items-center gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition hover:bg-white/60 ${active ? "bg-white/70" : ""}`}
                    >
                      <Avatar
                        name={it.title}
                        size={42}
                        color={it.kind === "activity" ? "var(--primary)" : it.kind === "group" ? "var(--color-cat-music)" : undefined}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{it.title}</p>
                        <p className="truncate text-xs text-[var(--muted-text)]">{it.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat panel */}
            <div className={`flex flex-col ${mobilePanel === "list" ? "hidden md:flex" : "flex h-full"}`}>
              {!selectedChat ? (
                <div className="grid flex-1 place-items-center text-sm text-[var(--muted-text)]">
                  Sélectionne une conversation
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
                    <button onClick={() => setMobilePanel("list")} className="md:hidden text-[var(--muted-text)]">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <Avatar name={selectedChat.name} size={38} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{selectedChat.name}</p>
                      <p className="truncate text-xs text-[var(--muted-text)]">
                        {selectedChat.type === "friend" ? "Message privé"
                          : selectedChat.type === "activity" ? "Chat communauté"
                          : "Chat de groupe"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 space-y-3 overflow-y-auto p-4">
                    {loadingMessages ? (
                      <div className="py-8 text-center text-sm text-[var(--muted-text)]">Chargement…</div>
                    ) : messages.length === 0 ? (
                      <div className="py-8 text-center text-sm text-[var(--muted-text)]">Aucun message. Soyez le premier à écrire !</div>
                    ) : (
                      messages.map((m, i) => {
                        const isMe = m.sender_id === currentUser.id;
                        return (
                          <div key={i} className={`flex items-end gap-2 ${isMe ? "justify-end" : ""}`}>
                            {!isMe && <Avatar name={`${m.sender?.first_name ?? "?"}`} size={28} />}
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe ? "text-white" : "bg-white/80"}`}
                              style={isMe ? { background: "var(--gradient-primary)" } : undefined}
                            >
                              {!isMe && <p className="mb-0.5 text-xs font-semibold opacity-70">{m.sender?.first_name}</p>}
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form
                    className="flex items-center gap-2 border-t border-[var(--border)] p-3"
                    style={{ paddingBottom: "calc(0.75rem + 64px)", flexShrink: 0 }}
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  >
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Écris un message…"
                      className="field !py-2.5"
                    />
                    <button className="btn-primary !p-3"><Send className="h-4 w-4" /></button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default function ConversationsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <PageShell variant="chat">
          <div className="flex items-center justify-center py-20 text-sm text-[var(--muted-text)]">Chargement…</div>
        </PageShell>
      }>
        <ConversationsContent />
      </Suspense>
    </ProtectedRoute>
  );
}