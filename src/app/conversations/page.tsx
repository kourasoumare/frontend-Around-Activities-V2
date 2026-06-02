"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AppNavbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getFriendsApi, getMyGroupsApi, getGroupMessagesApi, getPrivateMessagesApi, sendMessageApi } from "@/lib/api";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/context/ToastContext";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FlatGroup {
  id: number;
  name: string;
  creator_id: number;
  meeting_date?: string;
  location?: string;
  activities?: { id: number; title?: string; category?: string } | null;
}

interface Message {
  id: number;
  content: string;
  sender_id?: number;
  group_id?: number;
  receiver_id?: number;
  created_at?: string;
  sender?: { id: number; first_name: string; last_name: string };
}

interface Friend {
  id: number;
  first_name: string;
  last_name: string;
}

interface SelectedChat {
  type: "group" | "private";
  id: number;
  name: string;
}

function ConversationsContent() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState<{ id: number; first_name?: string } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [myGroups, setMyGroups] = useState<FlatGroup[]>([]);
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const groupParamHandled = useRef(false);
  // Refs pour permettre au handler "connect" d'accéder aux valeurs courantes sans stale closure
  const selectedChatRef = useRef<SelectedChat | null>(null);
  const currentUserRef = useRef<{ id: number } | null>(null);

  useEffect(() => { selectedChatRef.current = selectedChat; }, [selectedChat]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // Load current user
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    if (stored?.id) setCurrentUser(stored);
  }, []);

  // Load friends and groups
  useEffect(() => {
    if (!currentUser?.id) return;
    getFriendsApi().then((data) => setFriends(data as Friend[])).catch(() => {});
    getMyGroupsApi().then((data) => {
      if (Array.isArray(data)) setMyGroups(data as FlatGroup[]);
    }).catch(() => {});
  }, [currentUser?.id]);

  // Open group from URL param
  useEffect(() => {
    const groupId = searchParams.get("group");
    if (!groupId || groupParamHandled.current || myGroups.length === 0) return;
    const found = myGroups.find((g) => String(g.id) === groupId);
    if (found) {
      groupParamHandled.current = true;
      setActiveTab("groups");
      setSelectedChat({ type: "group", id: found.id, name: found.name });
    }
  }, [searchParams, myGroups]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket — créé une seule fois quand currentUser est disponible
  useEffect(() => {
    if (!currentUser?.id) return;
    if (socketRef.current) return; // déjà créé

    const token = localStorage.getItem("token");
    const socket = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
    });
    socketRef.current = socket;

    // Rejoindre le bon room après (re)connexion
    socket.on("connect", () => {
      const chat = selectedChatRef.current;
      const user = currentUserRef.current;
      if (!chat || !user) return;
      if (chat.type === "group") {
        socket.emit("join_group", { groupId: chat.id });
      } else {
        socket.emit("join_private", { userId1: user.id, userId2: chat.id });
      }
    });

    socket.on("new_message", (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("new_private_message", (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socket.on("friend_request", () => {
      showToast("Nouvelle demande d'ami !", "success");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?.id, showToast]);

  // Rejoindre le room et charger l'historique quand selectedChat change
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !selectedChat || !currentUser?.id) return;

    setMessages([]);

    if (selectedChat.type === "group") {
      socket.emit("join_group", { groupId: selectedChat.id });
      getGroupMessagesApi(selectedChat.id)
        .then((data) => setMessages(Array.isArray(data) ? (data as Message[]) : []))
        .catch(() => {});
    } else {
      socket.emit("join_private", { userId1: currentUser.id, userId2: selectedChat.id });
      getPrivateMessagesApi(selectedChat.id)
        .then((data) => setMessages(Array.isArray(data) ? (data as Message[]) : []))
        .catch(() => {});
    }
  }, [selectedChat?.id, selectedChat?.type, currentUser?.id]);

  // Envoyer un message — socket émet l'event, c'est le serveur qui broadcastera new_message
  const handleSend = useCallback(async () => {
    if (!input.trim() || !selectedChat || !currentUser?.id) return;
    const content = input.trim();
    setInput("");

    const socket = socketRef.current;
    const payload = selectedChat.type === "group"
      ? { group_id: selectedChat.id, content }
      : { receiver_id: selectedChat.id, content };

    if (socket) {
      const event = selectedChat.type === "group" ? "send_group_message" : "send_private_message";
      socket.emit(event, payload);
    }

    // Appel HTTP pour persistance — le serveur broadcast new_message, pas d'ajout manuel ici
    try {
      await sendMessageApi(payload);
    } catch { /* ignoré si socket a déjà géré */ }
  }, [input, selectedChat, currentUser?.id]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const sidebarStyle: React.CSSProperties = {
    width: 300, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex", flexDirection: "column", height: "calc(100vh - 60px)",
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return "?";
    return `${firstName[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" }}>

      {/* Sidebar */}
      <div style={{ ...sidebarStyle, display: selectedChat ? "none" : "flex" }} className="md:flex">
        <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.5rem", padding: "3px", display: "flex", gap: "3px" }}>
            {([["friends", `👤 Amis (${friends.length})`], ["groups", `👥 Groupes (${myGroups.length})`]] as const).map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, padding: "0.4rem", borderRadius: "0.35rem", border: "none", background: activeTab === tab ? "rgba(255,255,255,0.12)" : "transparent", color: activeTab === tab ? "#FAF7F2" : "rgba(250,247,242,0.4)", fontSize: "0.78rem", fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
          {activeTab === "friends" ? (
            friends.length > 0 ? friends.map((friend) => (
              <button key={friend.id}
                onClick={() => setSelectedChat({ type: "private", id: friend.id, name: `${friend.first_name} ${friend.last_name}` })}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", background: selectedChat?.id === friend.id ? "rgba(196,96,58,0.15)" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s", marginBottom: "2px" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #C4603A, #E8924A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                  {getInitials(friend.first_name, friend.last_name)}
                </div>
                <span style={{ color: "#FAF7F2", fontSize: "0.875rem", fontWeight: 500 }}>{friend.first_name} {friend.last_name}</span>
              </button>
            )) : (
              <p style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.8rem", padding: "1rem", textAlign: "center" }}>Aucun ami pour l&apos;instant.</p>
            )
          ) : (
            myGroups.length > 0 ? myGroups.map((g) => (
              <button key={g.id}
                onClick={() => setSelectedChat({ type: "group", id: g.id, name: g.name })}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", background: selectedChat?.id === g.id ? "rgba(196,96,58,0.15)" : "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.15s", marginBottom: "2px" }}>
                <div style={{ width: 38, height: 38, borderRadius: "0.5rem", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>👥</div>
                <span style={{ color: "#FAF7F2", fontSize: "0.875rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.name}</span>
              </button>
            )) : (
              <p style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.8rem", padding: "1rem", textAlign: "center" }}>Aucun groupe rejoint.</p>
            )
          )}
        </div>
      </div>

      {/* Panneau chat */}
      {selectedChat ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
          <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setSelectedChat(null)}
              style={{ background: "none", border: "none", color: "rgba(250,247,242,0.4)", cursor: "pointer", fontSize: "0.8rem", padding: "0 0.5rem 0 0", fontFamily: "inherit" }}>
              ← Retour
            </button>
            <div style={{ width: 38, height: 38, borderRadius: selectedChat.type === "group" ? "0.5rem" : "50%", background: "linear-gradient(135deg, #C4603A, #E8924A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: selectedChat.type === "group" ? "1rem" : "0.75rem", fontWeight: 700 }}>
              {selectedChat.type === "group" ? "👥" : selectedChat.name.split(" ").map((x) => x[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <span style={{ fontWeight: 600, color: "#FAF7F2", fontSize: "0.95rem" }}>{selectedChat.name}</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              const senderName = isMe ? "Moi" : (msg.sender?.first_name ?? "?");
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                  <span style={{ fontSize: "0.68rem", color: "rgba(250,247,242,0.35)", marginBottom: "0.2rem", padding: "0 0.25rem" }}>{senderName}</span>
                  <div style={{ maxWidth: "72%", padding: "0.625rem 0.875rem", borderRadius: isMe ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem", background: isMe ? "linear-gradient(135deg, #C4603A, #E8924A)" : "rgba(255,255,255,0.08)", color: "#FAF7F2", fontSize: "0.875rem", lineHeight: 1.5 }}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(250,247,242,0.25)", fontSize: "0.875rem" }}>
                Aucun message pour l&apos;instant. Dis bonjour ! 👋
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "0.625rem" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écris un message..."
              style={{ flex: 1, padding: "0.75rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.875rem", color: "#FAF7F2", fontSize: "0.875rem", outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={handleSend}
              style={{ padding: "0.75rem 1.25rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", border: "none", borderRadius: "0.875rem", color: "#fff", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
              Envoyer
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex" style={{ flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "3rem" }}>💬</div>
          <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.9rem" }}>Sélectionne une conversation</p>
        </div>
      )}
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.15) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "40%", height: "40%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.10) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>
        <div className="relative z-10">
          <AppNavbar />
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>Chargement...</div>}>
            <ConversationsContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
