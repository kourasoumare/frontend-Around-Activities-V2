import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { MOCK_USER, MY_GROUPS } from "@/lib/data";

const AVATAR_COLORS = ["#C4603A", "#3A7CC4", "#60C43A", "#C43A7C", "#7C3AC4"];

export default function ProfilPage() {
  const user = MOCK_USER;
  const groups = MY_GROUPS.slice(0, 3);
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="bg-ink px-8 pt-10 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_30%_50%,rgba(196,96,58,0.15)_0%,transparent_70%)]" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-head text-2xl font-black text-white border-4 border-white/20 mb-5"
            style={{ background: AVATAR_COLORS[0] }}
          >
            {initials}
          </div>

          <h1 className="font-head text-3xl font-black text-white tracking-tight mb-1">
            {user.firstName} {user.lastName}
          </h1>

          <p className="text-white text-sm flex items-center gap-1">
            📍 {user.city} · Membre depuis {user.createdAt}
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-8 -mt-10 relative z-10 space-y-6 pb-10">

        {/* Interests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Centres d&apos;intérêt</h2>
            <Link href="/profil/modifier" className="btn btn-outline btn-sm">
              ✏️ Modifier
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.interests.map((tag) => (
              <span key={tag} className="interest-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Recent groups */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Groupes récents</h2>
            <Link
              href="/mes-groupes"
              className="text-xs text-tc font-semibold hover:underline"
            >
              Voir tout →
            </Link>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groupes/${group.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-ink-3">
                      {group.activity} · {group.date}
                    </p>
                  </div>
                  <span className="text-xs text-ink-3">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Groupes rejoints",
              value: MY_GROUPS.filter((g) => !g.isOrganizer).length,
              color: "#C4603A",
            },
            {
              label: "Groupes créés",
              value: MY_GROUPS.filter((g) => g.isOrganizer).length,
              color: "#B8722E",
            },
            {
              label: "Intérêts",
              value: user.interests.length,
              color: "#F0A860",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-bg-2 rounded-2xl p-4 text-center"
            >
              <p
                className="font-head text-3xl font-black"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-white mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
