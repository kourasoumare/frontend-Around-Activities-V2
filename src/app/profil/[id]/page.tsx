import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { MOCK_USER, MY_GROUPS } from "@/lib/data";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProfilPage() {
  const user = MOCK_USER;
  const groups = MY_GROUPS.slice(0, 3);
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <ProtectedRoute>
    <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>

      {/* Dégradés animés */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10">
        <AppNavbar />

        <div className="px-8 pt-10 pb-24 relative overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #C4603A, #E8924A)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontSize: "2rem", fontWeight: 900, color: "#fff", border: "3px solid rgba(255,255,255,0.15)", marginBottom: "1.25rem" }}>
              {initials}
            </div>

            <h1 className="font-head font-black tracking-tight" style={{ fontSize: "2rem", color: "#FAF7F2", marginBottom: "0.25rem" }}>
              {user.firstName}{" "}
              <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                {user.lastName}
              </span>
            </h1>
            <p style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.875rem" }}>
              📍 {user.city} · Membre depuis {user.createdAt}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-8 -mt-10 relative z-10" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", paddingBottom: "3rem" }}>

          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2" }}>Centres d&apos;intérêt</h2>
              <Link href="/profil/modifier" style={{ padding: "0.4rem 1rem", background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.3)", color: "#E8924A", borderRadius: "0.5rem", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>
                ✏️ Modifier
              </Link>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {user.interests.map((tag) => (
                <span key={tag} style={{ background: "rgba(196,96,58,0.15)", border: "1px solid rgba(196,96,58,0.25)", color: "#E8924A", padding: "0.35rem 0.9rem", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2" }}>Groupes</h2>
              <Link href="/mes-groupes" style={{ fontSize: "0.78rem", color: "#E8924A", fontWeight: 600, textDecoration: "none" }}>
                Voir tout →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {groups.map((group) => (
                <Link key={group.id} href={`/groupes/${group.id}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "0.75rem", background: "rgba(255,255,255,0.04)", textDecoration: "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "0.625rem", background: "rgba(196,96,58,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
                    {group.activity.includes("peinture") ? "🎨" : group.activity.includes("Foot") ? "⚽" : group.activity.includes("Cuisine") ? "🍳" : "🧘"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "#FAF7F2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{group.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)" }}>{group.activity} · {group.date}</p>
                  </div>
                  <span style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.875rem" }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { label: "Groupes rejoints", value: MY_GROUPS.filter((g) => !g.isOrganizer).length },
              { label: "Groupes créés", value: MY_GROUPS.filter((g) => g.isOrganizer).length },
              { label: "Intérêts", value: user.interests.length },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem", padding: "1.25rem", textAlign: "center" }}>
                <p className="font-head font-black" style={{ fontSize: "2rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>{stat.value}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(250,247,242,0.4)", marginTop: "0.25rem" }}>{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}