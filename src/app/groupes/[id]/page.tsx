"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AppNavbar } from "@/components/Navbar";
import { GROUPS, ACTIVITIES } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { joinGroupApi, ApiError } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AVATAR_COLORS = ["#C4603A", "#3A7CC4", "#60C43A", "#C43A7C", "#7C3AC4", "#C4A03A"];

export default function GroupDetailPage() {
  const params = useParams();
  const group = GROUPS.find((g) => g.id === Number(params.id));
  const [joined, setJoined] = useState(false);
  const { showToast } = useToast();

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#2D1535" }}>
        <p style={{ color: "rgba(250,247,242,0.4)" }}>Groupe introuvable.</p>
      </div>
    );
  }

  const activity = ACTIVITIES.find((a) => a.id === group.activityId);
  const isFull = group.members.length >= group.maxMembers;

  async function handleJoin() {
    if (!group) return;
    try {
      await joinGroupApi(group.id);
      setJoined(true);
      showToast("Vous avez rejoint le groupe !", "success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setJoined(true);
        showToast("Vous avez rejoint le groupe !", "success");
      } else {
        showToast("Impossible de rejoindre ce groupe.", "error");
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>

        <div className="relative z-10">
          <AppNavbar />

          <div className="px-8 pt-10 pb-20 relative overflow-hidden">
            <div className="max-w-3xl mx-auto relative z-10">
              <Link href={`/activites/${group.activityId}`} style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "1.5rem" }}>
                ← Retour à {activity?.title ?? "l'activité"}
              </Link>

              <h1 className="font-head font-black tracking-tight" style={{ fontSize: "2.5rem", color: "#FAF7F2", marginBottom: "1.25rem", lineHeight: 1.1 }}>
                {group.name}
              </h1>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { icon: "📅", text: group.date },
                  { icon: "📍", text: group.location },
                  { icon: "👥", text: `${group.members.length}/${group.maxMembers} membres` },
                ].map((pill) => (
                  <span key={pill.text} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "rgba(255,255,255,0.08)", borderRadius: "9999px", padding: "0.375rem 0.75rem", fontSize: "0.75rem", color: "rgba(250,247,242,0.80)" }}>
                    {pill.icon} {pill.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-8 -mt-8 relative z-10" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingBottom: "3rem" }}>

            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "0.75rem" }}>Description</h2>
              <p style={{ color: "rgba(250,247,242,0.6)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>{group.description}</p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)", marginBottom: "0.2rem" }}>Organisateur</p>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#FAF7F2" }}>{group.organizer}</p>
                </div>
                <a href={group.contactLink} target="_blank" rel="noopener noreferrer" style={{ padding: "0.4rem 1rem", background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.3)", color: "#E8924A", borderRadius: "0.5rem", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                  💬 Contact
                </a>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1rem" }}>
                Membres <span style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", fontWeight: 400 }}>({group.members.length}/{group.maxMembers})</span>
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {group.members.map((member, i) => (
                  <div key={member} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9999px", padding: "0.35rem 0.9rem 0.35rem 0.35rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: AVATAR_COLORS[i % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
                      {member.split(" ").map((x) => x[0]).join("")}
                    </div>
                    <span style={{ fontSize: "0.82rem", color: "rgba(250,247,242,0.8)" }}>{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {joined ? (
              <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "1.5rem", padding: "1.25rem", textAlign: "center", color: "#86efac", fontWeight: 600 }}>
                ✅ Tu as rejoint ce groupe ! Check le lien de contact pour la suite.
              </div>
            ) : isFull ? (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.5rem", padding: "1.25rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>
                Ce groupe est complet.{" "}
                <Link href={`/activites/${group.activityId}`} style={{ color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>
                  Voir d&apos;autres groupes
                </Link>
              </div>
            ) : (
              <button onClick={handleJoin} style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "1.5rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}>
                Rejoindre ce groupe
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}