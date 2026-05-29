"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { Activity } from "@/lib/data";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { getActivitiesApi } from "@/lib/api";

const CATEGORY_IMAGES: Record<string, string> = {
  "Sport & Fitness": "/football.jpg",
  "Art & Culture": "/aquarelle.jpg",
  "Restaurant & Cuisine": "/cuisine.jpg",
  "Musique & Événements": "/guitare.jpg",
  "Bien-être & Détente": "/yoga.jpg",
  "Tech & Jeux vidéo": "/coding.jpg",
  "Nature & Plein air": "/randonnee.jpg",
  "Rencontres & Chill": "/photo.jpg",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  "Sport & Fitness": "⚽",
  "Art & Culture": "🎨",
  "Restaurant & Cuisine": "🍳",
  "Musique & Événements": "🎵",
  "Bien-être & Détente": "🧘",
  "Tech & Jeux vidéo": "💻",
  "Nature & Plein air": "🌿",
  "Rencontres & Chill": "📸",
};

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await getActivitiesApi();
      setActivities(data);
    };
    fetchActivities();
  }, []);

  const filtered = activities.filter((a) =>
    search === "" || a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "30%", left: "20%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-3s" }} />
        </div>

        <div className="relative z-10">
          <AppNavbar />

          <div className="px-8 pt-10 pb-16 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Bonjour,</p>
              <h1 className="font-head font-black tracking-tight mb-6" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#FAF7F2" }}>
                {user.first_name ? `${user.first_name} de` : "Bienvenue depuis"}{" "}
                <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {user.city || "France"}
                </span>
              </h1>
              <p style={{ color: "rgba(250,247,242,0.55)", fontSize: "1rem", marginBottom: "2rem", maxWidth: "480px" }}>
                Choisis une activité qui te correspond et rejoins un groupe près de chez toi.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "9999px", padding: "0.6rem 1.25rem", maxWidth: "400px" }}>
                <span style={{ color: "rgba(250,247,242,0.4)" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Cherche une catégorie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, border: "none", background: "transparent", color: "#FAF7F2", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ color: "rgba(250,247,242,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 pb-16 relative z-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 className="font-head font-black tracking-tight" style={{ fontSize: "1.5rem", color: "#FAF7F2" }}>
                Activités disponibles
              </h2>
              <span style={{ color: "rgba(250,247,242,0.35)", fontSize: "0.8rem" }}>
                {filtered.length} catégorie{filtered.length > 1 ? "s" : ""}
              </span>
            </div>

            {filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                {filtered.map((activity) => {
                  const img = activity.image_url || CATEGORY_IMAGES[activity.category] || "/aquarelle.jpg";
                  const groupCount = activity._count?.groups ?? 0;
                  return (
                    <div key={activity.id} style={{ borderRadius: "1.25rem", overflow: "hidden", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transition: "transform 0.2s, box-shadow 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                      
                      {/* Image */}
                      <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                        <Image src={img} alt={activity.category} fill style={{ objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,10,30,0.7) 0%, transparent 50%)" }} />
                        <span style={{ position: "absolute", top: "0.75rem", left: "0.75rem", background: "rgba(45,21,53,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "9999px", padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#FAF7F2" }}>
                          {CATEGORY_EMOJIS[activity.category] || "✨"} {activity.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(250,247,242,0.5)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                          <span>👥</span>
                          <span>{groupCount} groupe{groupCount !== 1 ? "s" : ""} disponible{groupCount !== 1 ? "s" : ""}</span>
                        </div>
                        <Link href={`/activites/${activity.id}`} style={{ display: "block", width: "100%", padding: "0.65rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", borderRadius: "0.75rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", textAlign: "center" }}>
                          Voir les groupes →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(250,247,242,0.4)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
                <p style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "0.5rem" }}>Aucune catégorie trouvée</p>
                <p style={{ fontSize: "0.875rem" }}>Essaie un autre mot-clé.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
