"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppNavbar } from "@/components/Navbar";
import { BackendGroup } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { joinGroupApi, getGroupByIdApi, leaveGroupApi, deleteGroupApi, ApiError } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AVATAR_COLORS = ["#C4603A", "#3A7CC4", "#60C43A", "#C43A7C", "#7C3AC4", "#C4A03A"];

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [group, setGroup] = useState<BackendGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const { showToast } = useToast();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUserId(stored.id ?? null);
  }, []);

  useEffect(() => {
    if (currentUserId === null) return;
    const fetchGroup = async () => {
      try {
        const data = await getGroupByIdApi(Number(id));
        setGroup(data);
        const isMember = data.memberships?.some((m) => m.user_id === currentUserId);
        if (isMember) setJoined(true);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id, currentUserId]);

  if (loading) return <div style={{ background: "#2D1535", minHeight: "100vh" }} />;
  if (!group) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#2D1535" }}>
      <p style={{ color: "rgba(250,247,242,0.4)" }}>Groupe introuvable.</p>
    </div>
  );

  const membersCount = group.memberships?.length ?? 0;
  const isFull = membersCount >= group.max_members;
  const isOrganizer = group.creator_id === currentUserId;
  const organizer = group.users ? `${group.users.first_name} ${group.users.last_name}` : "Inconnu";
  const date = new Date(group.meeting_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });

  async function handleJoin() {
    if (!group) return;
    try {
      await joinGroupApi(group.id);
      setJoined(true);
      showToast("Tu as rejoint le groupe !", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setJoined(true);
      } else {
        showToast("Impossible de rejoindre ce groupe.", "error");
      }
    }
  }

  async function handleLeave() {
    if (!group) return;
    try {
      await leaveGroupApi(group.id);
      setJoined(false);
      showToast("Tu as quitté le groupe.", "success");
    } catch {
      showToast("Impossible de quitter ce groupe.", "error");
    }
  }

  async function handleDelete() {
    if (!group) return;
    if (!confirm("Supprimer ce groupe définitivement ?")) return;
    try {
      await deleteGroupApi(group.id);
      showToast("Groupe supprimé.", "success");
      router.push("/mes-groupes");
    } catch {
      showToast("Erreur lors de la suppression.", "error");
    }
  }

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
            <div className="max-w-3xl mx-auto">
              <Link href={`/activites/${group.activity_id}`} style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem" }}>
                ← Retour à {group.activities?.title ?? "l'activité"}
              </Link>

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "1.25rem" }}>
                <h1 className="font-head font-black tracking-tight" style={{ fontSize: "2.5rem", color: "#FAF7F2", lineHeight: 1.1 }}>
                  {group.name}
                </h1>
                {isOrganizer && (
                  <button onClick={handleDelete} style={{ flexShrink: 0, padding: "0.4rem 0.9rem", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", borderRadius: "0.5rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                    🗑 Supprimer
                  </button>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { icon: "📅", text: date },
                  { icon: "📍", text: group.location },
                  { icon: "👥", text: `${membersCount}/${group.max_members} membres` },
                ].map((pill) => (
                  <span key={pill.text} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "rgba(255,255,255,0.08)", borderRadius: "9999px", padding: "0.375rem 0.75rem", fontSize: "0.75rem", color: "rgba(250,247,242,0.80)" }}>
                    {pill.icon} {pill.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="max-w-3xl mx-auto px-8 pb-12" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* 1. Chat — visible seulement si membre ou organisateur */}
            {(joined || isOrganizer) && (
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
                <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1rem" }}>Chat du groupe</h2>
                <Link href={`/conversations?group=${group.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem", background: "rgba(196,96,58,0.12)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "1rem", textDecoration: "none", color: "#E8924A", fontWeight: 600, fontSize: "0.9rem" }}>
                  <span style={{ fontSize: "1.4rem" }}>💬</span>
                  Accéder au chat du groupe
                  <span style={{ marginLeft: "auto", opacity: 0.6 }}>→</span>
                </Link>
              </div>
            )}

            {/* 2. Membres */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1rem" }}>
                Membres <span style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", fontWeight: 400 }}>({membersCount}/{group.max_members})</span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {(group.memberships ?? []).map((membership, i) => {
                  const name = `${membership.users?.first_name ?? ""} ${membership.users?.last_name ?? ""}`.trim();
                  const memberId = membership.user_id;
                  return (
                    <Link key={membership.id} href={`/profil/${memberId}`}
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9999px", padding: "0.35rem 0.9rem 0.35rem 0.35rem", textDecoration: "none" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
                        {name.split(" ").map((x) => x[0]).join("")}
                      </div>
                      <span style={{ fontSize: "0.82rem", color: "rgba(250,247,242,0.8)" }}>{name}</span>
                    </Link>
                  );
                })}
                {membersCount === 0 && (
                  <p style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.85rem" }}>Aucun membre pour l&apos;instant.</p>
                )}
              </div>
            </div>

            {/* 3. Description */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "0.75rem" }}>Description</h2>
              <p style={{ color: "rgba(250,247,242,0.6)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{group.description}</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)", marginBottom: "0.2rem" }}>Organisateur</p>
                  <Link href={`/profil/${group.creator_id}`} style={{ fontWeight: 600, fontSize: "0.875rem", color: "#FAF7F2", textDecoration: "none" }}>
                    {organizer} →
                  </Link>
                </div>
                {group.contact_link && (
                  <a href={group.contact_link} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "0.4rem 1rem", background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.3)", color: "#E8924A", borderRadius: "0.5rem", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                    💬 Contact
                  </a>
                )}
              </div>
            </div>

            {/* 4. Bouton action */}
            {isOrganizer ? (
              <div style={{ background: "rgba(196,96,58,0.08)", border: "1px solid rgba(196,96,58,0.2)", borderRadius: "1.5rem", padding: "1.25rem", textAlign: "center", color: "#E8924A", fontSize: "0.875rem", fontWeight: 500 }}>
                👑 Tu es l&apos;organisateur de ce groupe
              </div>
            ) : joined ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "1.5rem", padding: "1.25rem", textAlign: "center", color: "#86efac", fontWeight: 600 }}>
                  ✅ Tu es membre de ce groupe
                </div>
                <button onClick={handleLeave}
                  style={{ width: "100%", padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(250,247,242,0.5)", borderRadius: "1.5rem", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>
                  Quitter ce groupe
                </button>
              </div>
            ) : isFull ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.5rem", padding: "1.25rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>
                Ce groupe est complet.{" "}
                <Link href={`/activites/${group.activity_id}`} style={{ color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>
                  Voir d&apos;autres groupes
                </Link>
              </div>
            ) : (
              <button onClick={handleJoin}
                style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "1.5rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}>
                Rejoindre ce groupe
              </button>
            )}

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
