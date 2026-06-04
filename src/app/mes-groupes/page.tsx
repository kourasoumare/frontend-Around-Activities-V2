"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { getMyGroupsApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { leaveGroupApi, deleteGroupApi, ApiError } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MyGroup } from "@/lib/data";
import { useSearchParams } from "next/navigation";

function MesGroupesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"joined" | "created">(tabParam === "created" ? "created" : "joined");
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const { showToast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setCurrentUserId(u.id);
    }
  }, []);

  useEffect(() => {
    const fetchMyGroups = async () => {
      try {
        const myGroups = await getMyGroupsApi();
        setGroups(Array.isArray(myGroups) ? myGroups as MyGroup[] : []);
      } catch {
        showToast("Erreur lors du chargement des groupes.", "error");
      }
    };
    fetchMyGroups();
  }, [currentUserId]);

  async function quitterGroupe(id: number) {
    try {
      await leaveGroupApi(id);
      setGroups((prev) => prev.filter((g) => g.groups.id !== id));
      showToast("Vous avez quitté le groupe.", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setGroups((prev) => prev.filter((g) => g.groups.id !== id));
        showToast("Vous avez quitté le groupe.", "success");
      } else {
        showToast("Impossible de quitter ce groupe.", "error");
      }
    }
  }

  async function supprimerGroupe(id: number) {
    try {
      await deleteGroupApi(id);
      setGroups((prev) => prev.filter((g) => g.groups.id !== id));
      showToast("Groupe supprimé.", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setGroups((prev) => prev.filter((g) => g.groups.id !== id));
        showToast("Groupe supprimé.", "success");
      } else if (err instanceof ApiError && err.status === 403) {
        showToast("Vous n'êtes pas autorisé à supprimer ce groupe.", "error");
      } else {
        showToast("Erreur lors de la suppression.", "error");
      }
    }
  }

  const joined = groups.filter((g) => g.groups.creator_id !== currentUserId);
  const created = groups.filter((g) => g.groups.creator_id === currentUserId);
  const current = activeTab === "joined" ? joined : created;

  return (
    <div className="px-8 pt-10 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-head text-4xl font-black tracking-tight">
          <span style={{ color: "#FAF7F2" }}>Mes </span>
          <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>groupes</span>
        </h1>
        <p style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Suis et gère toutes tes sorties
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-6 relative z-10">
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "0.75rem", padding: "3px", display: "flex", gap: "3px", marginBottom: "1.5rem" }}>
          <button onClick={() => setActiveTab("joined")} style={{ flex: 1, textAlign: "center", padding: "0.5rem", fontSize: "0.82rem", fontWeight: activeTab === "joined" ? 600 : 500, cursor: "pointer", borderRadius: "0.5rem", border: "none", background: activeTab === "joined" ? "rgba(255,255,255,0.12)" : "transparent", color: activeTab === "joined" ? "#FAF7F2" : "rgba(250,247,242,0.4)", fontFamily: "inherit", transition: "all 0.2s" }}>
            Groupes rejoints ({joined.length})
          </button>
          <button onClick={() => setActiveTab("created")} style={{ flex: 1, textAlign: "center", padding: "0.5rem", fontSize: "0.82rem", fontWeight: activeTab === "created" ? 600 : 500, cursor: "pointer", borderRadius: "0.5rem", border: "none", background: activeTab === "created" ? "rgba(255,255,255,0.12)" : "transparent", color: activeTab === "created" ? "#FAF7F2" : "rgba(250,247,242,0.4)", fontFamily: "inherit", transition: "all 0.2s" }}>
            Groupes créés ({created.length})
          </button>
        </div>

        {current.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {current.map((group) => (
              <div key={group.id} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "0.75rem", flexShrink: 0, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>
                  {group.groups.activities?.category?.includes("Art") ? "🎨" : group.groups.activities?.category?.includes("Sport") ? "⚽" : group.groups.activities?.category?.includes("Cuisine") ? "🍳" : "🧘"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.groups.name}</h3>
                  <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)" }}>
                    {group.groups.activities?.title} · {group.groups.meeting_date} · {group.groups.location}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  {group.groups.creator_id === currentUserId ? (
                    <button onClick={() => supprimerGroupe(group.groups.id)} style={{ padding: "0.4rem 0.9rem", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", borderRadius: "0.5rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                      🗑 Supprimer
                    </button>
                  ) : (
                    <button onClick={() => quitterGroupe(group.groups.id)} style={{ padding: "0.4rem 0.9rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(250,247,242,0.7)", borderRadius: "0.5rem", fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
                      Quitter
                    </button>
                  )}
                  <Link href={`/groupes/${group.groups.id}`} style={{ padding: "0.4rem 0.9rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: 600, textDecoration: "none" }}>
                    Voir
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.5rem", padding: "4rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{activeTab === "joined" ? "🔍" : "✨"}</div>
            <p style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "0.5rem" }}>
              {activeTab === "joined" ? "Tu n'as pas encore rejoint de groupe" : "Tu n'as pas encore créé de groupe"}
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(250,247,242,0.4)", marginBottom: "1.5rem" }}>
              {activeTab === "joined" ? "Explore les activités et rejoins un groupe." : "Lance ta première sortie !"}
            </p>
            <Link href="/home" style={{ background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: "9999px", fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}>
              Explorer les activités
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MesGroupesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>
        <div className="relative z-10">
          <AppNavbar />
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>Chargement...</div>}>
            <MesGroupesContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
