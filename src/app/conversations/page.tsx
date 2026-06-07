"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  getFriendsApi,
  getMyGroupsApi,
  getGroupMessagesApi,
  getPrivateMessagesApi,
  sendMessageApi,
} from "@/lib/api";
import { Friend, Message, MyGroup } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { io, Socket } from "socket.io-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ChatTarget =
  | { type: "friend"; id: number; name: string }
  | { type: "group"; id: number; name: string };

function getCategoryEmoji(category?: string | null): string {
  if (!category) return "✨";
  if (category.includes("Sport")) return "⚽";
  if (category.includes("Art")) return "🎨";
  if (category.includes("Cuisine") || category.includes("Restaurant")) return "🍳";
  if (category.includes("Musique")) return "🎵";
  if (category.includes("Bien-être")) return "🧘";
  if (category.includes("Tech")) return "💻";
  if (category.includes("Nature")) return "🌿";
  return "✨";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationsPage() {
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatTarget | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { showToast } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};
  const currentUserId: number = currentUser.id;

  // Load friends and groups
  useEffect(() => {
    const load = async () => {
      try {
        const [fr, gr] = await Promise.all([getFriendsApi(), getMyGroupsApi()]);
        const frRaw = fr as any;
        const frArr = Array.isArray(frRaw) ? frRaw : frRaw?.friends ?? [];
        setFriends(frArr as Friend[]);
        setGroups(Array.isArray(gr) ? (gr as MyGroup[]) : []);
      } catch {
        showToast("Erreur de chargement.", "error");
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect socket once on mount
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    const socket = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, []);

  // Load messages + join room when selected chat changes
  useEffect(() => {
    if (!selectedChat) return;

    const socket = socketRef.current;
    socket?.off("new_message");
    socket?.off("new_private_message");

    setMessages([]);
    setLoadingMessages(true);

    const load = async () => {
      try {
        const msgs =
          selectedChat.type === "group"
            ? await getGroupMessagesApi(selectedChat.id)
            : await getPrivateMessagesApi(selectedChat.id);
        setMessages(Array.isArray(msgs) ? (msgs as Message[]) : []);
      } catch {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    load();

    if (socket) {
      if (selectedChat.type === "group") {
        socket.emit("join_group", selectedChat.id);
        socket.on("new_message", (msg: Message) => {
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        });
      } else {
        socket.emit("join_private", {
          userId: currentUserId,
          friendId: selectedChat.id,
        });
        socket.on("new_private_message", (msg: Message) => {
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
        });
      }
    }

    return () => {
      socket?.off("new_message");
      socket?.off("new_private_message");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const content = newMessage.trim();
    if (!content || !selectedChat) return;
    setNewMessage("");

    const data =
      selectedChat.type === "group"
        ? { content, group_id: selectedChat.id }
        : { content, receiver_id: selectedChat.id };

    const socket = socketRef.current;
    if (socket) {
      if (selectedChat.type === "group") {
        socket.emit("send_message", data);
      } else {
        socket.emit("send_private_message", data);
      }
    }

    try {
      const saved = await sendMessageApi(data);
      setMessages((prev) => {
        const msg = saved as Message;
        return prev.some((m) => m.id === msg.id) ? prev : [...prev, msg];
      });
    } catch {
      showToast("Erreur lors de l'envoi.", "error");
    }
  }, [newMessage, selectedChat, showToast]);

  // ── Sidebar ──────────────────────────────────────────────────────────────────

  const sidebar = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "1rem 1rem 0.75rem" }}>
        <h1 className="font-head" style={{ fontSize: "1.4rem", fontWeight: 900, color: "#FAF7F2", marginBottom: "0.75rem" }}>
          Conversations
        </h1>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "3px", display: "flex", gap: "3px" }}>
          <button
            onClick={() => setActiveTab("friends")}
            style={{ flex: 1, textAlign: "center", padding: "0.45rem", fontSize: "0.78rem", fontWeight: activeTab === "friends" ? 600 : 500, cursor: "pointer", borderRadius: "0.5rem", border: "none", background: activeTab === "friends" ? "rgba(255,255,255,0.12)" : "transparent", color: activeTab === "friends" ? "#FAF7F2" : "rgba(250,247,242,0.4)", fontFamily: "inherit", transition: "all 0.2s" }}
          >
            👤 Amis ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            style={{ flex: 1, textAlign: "center", padding: "0.45rem", fontSize: "0.78rem", fontWeight: activeTab === "groups" ? 600 : 500, cursor: "pointer", borderRadius: "0.5rem", border: "none", background: activeTab === "groups" ? "rgba(255,255,255,0.12)" : "transparent", color: activeTab === "groups" ? "#FAF7F2" : "rgba(250,247,242,0.4)", fontFamily: "inherit", transition: "all 0.2s" }}
          >
            👥 Groupes ({groups.length})
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0.75rem" }}>
        {activeTab === "friends" ? (
          friends.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "rgba(250,247,242,0.4)", fontSize: "0.85rem" }}>
              Aucun ami pour l&apos;instant.<br />Ajoute des amis via leurs profils !
            </div>
          ) : (
            friends.map((f) => {
              const friend = f.friend;
              if (!friend) return null;
              const name = `${friend.first_name} ${friend.last_name}`;
              const isSelected =
                selectedChat?.type === "friend" && selectedChat.id === friend.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedChat({ type: "friend", id: friend.id, name })}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem", borderRadius: "0.75rem", background: isSelected ? "rgba(196,96,58,0.15)" : "transparent", border: isSelected ? "1px solid rgba(196,96,58,0.25)" : "1px solid transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", marginBottom: "0.25rem" }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7B2FBE, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {getInitials(name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(250,247,242,0.4)" }}>Message privé</p>
                  </div>
                </button>
              );
            })
          )
        ) : groups.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "rgba(250,247,242,0.4)", fontSize: "0.85rem" }}>
            Rejoins des groupes pour chatter !
          </div>
        ) : (
          groups.map((g) => {
            const isSelected =
              selectedChat?.type === "group" && selectedChat.id === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedChat({ type: "group", id: g.id, name: g.name })}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem", borderRadius: "0.75rem", background: isSelected ? "rgba(196,96,58,0.15)" : "transparent", border: isSelected ? "1px solid rgba(196,96,58,0.25)" : "1px solid transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", marginBottom: "0.25rem" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: "0.75rem", background: "rgba(196,96,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                  {getCategoryEmoji(g.activities?.category)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(250,247,242,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {g.activities?.title ?? g.location}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  // ── Chat panel ───────────────────────────────────────────────────────────────

  const chatPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {selectedChat ? (
        <>
          {/* Header */}
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <button
              className="md:hidden"
              onClick={() => setSelectedChat(null)}
              style={{ background: "none", border: "none", color: "rgba(250,247,242,0.6)", cursor: "pointer", fontSize: "1.2rem", padding: "0.2rem 0.4rem", borderRadius: "0.5rem" }}
            >
              ←
            </button>
            <div style={{ width: 36, height: 36, borderRadius: selectedChat.type === "group" ? "0.625rem" : "50%", background: selectedChat.type === "group" ? "rgba(196,96,58,0.18)" : "linear-gradient(135deg, #7B2FBE, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: selectedChat.type === "group" ? "1rem" : "0.72rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {selectedChat.type === "group"
                ? getCategoryEmoji(groups.find((g) => g.id === selectedChat.id)?.activities?.category)
                : getInitials(selectedChat.name)}
            </div>
            <h2 style={{ fontWeight: 700, color: "#FAF7F2", fontSize: "1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedChat.name}
            </h2>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {loadingMessages ? (
              <div style={{ textAlign: "center", color: "rgba(250,247,242,0.4)", padding: "2rem" }}>Chargement...</div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "rgba(250,247,242,0.35)", padding: "3rem 1rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
                <p style={{ fontSize: "0.875rem" }}>Aucun message. Commencez la conversation !</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id === currentUserId;
                const senderFirstName = msg.sender?.first_name ?? "?";
                const senderInitials = msg.sender
                  ? `${msg.sender.first_name[0] ?? ""}${msg.sender.last_name[0] ?? ""}`
                  : "?";
                return (
                  <div
                    key={msg.id ?? `msg-${index}`}
                    style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: "0.5rem", alignItems: "flex-end" }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: isMe ? "linear-gradient(135deg, #C4603A, #E8924A)" : "linear-gradient(135deg, #7B2FBE, #A855F7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {senderInitials}
                    </div>
                    <div style={{ maxWidth: "65%" }}>
                      <div style={{ fontSize: "0.68rem", color: "rgba(250,247,242,0.4)", marginBottom: "0.2rem", textAlign: isMe ? "right" : "left" }}>
                        {senderFirstName} · {formatTime(msg.created_at)}
                      </div>
                      <div style={{ padding: "0.6rem 0.9rem", borderRadius: isMe ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem", background: isMe ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(123,47,190,0.28)", border: isMe ? "none" : "1px solid rgba(123,47,190,0.35)", color: "#FAF7F2", fontSize: "0.875rem", lineHeight: 1.5, wordBreak: "break-word" }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "0.625rem", flexShrink: 0 }}>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Écrire un message..."
              style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", padding: "0.65rem 1rem", color: "#FAF7F2", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              style={{ padding: "0.65rem 1.1rem", background: newMessage.trim() ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(255,255,255,0.07)", border: "none", borderRadius: "0.75rem", color: newMessage.trim() ? "#fff" : "rgba(250,247,242,0.3)", cursor: newMessage.trim() ? "pointer" : "default", fontWeight: 600, fontSize: "0.85rem", fontFamily: "inherit", transition: "all 0.2s", flexShrink: 0 }}
            >
              Envoyer
            </button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ fontSize: "3rem" }}>💬</div>
          <p style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.9rem" }}>
            Sélectionne une conversation
          </p>
        </div>
      )}
    </div>
  );

  // ── Layout ───────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute>
      <div style={{ background: "#2D1535", height: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Gradient backgrounds */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.15) 0%, transparent 70%)" }} />
          <div className="absolute" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 flex flex-col" style={{ flex: 1, minHeight: 0 }}>
          <AppNavbar />

          {/* Desktop: split panel */}
          <div className="hidden md:flex" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {sidebar}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {chatPanel}
            </div>
          </div>

          {/* Mobile: toggle list / chat */}
          <div
            className="md:hidden flex flex-col"
            style={{ flex: 1, minHeight: 0, overflow: "hidden", paddingBottom: 64 }}
          >
            {!selectedChat ? (
              <div style={{ flex: 1, overflow: "auto" }}>{sidebar}</div>
            ) : (
              chatPanel
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
