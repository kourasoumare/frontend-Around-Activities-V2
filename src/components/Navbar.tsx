"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSocketContext } from "@/context/SocketContext";

export function PublicNavbar() {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 2rem", background: "rgba(45,21,53,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
        <Image src="/logo.png" alt="Around Activities" width={36} height={36} style={{ borderRadius: "50%" }} />
        <span className="font-head" style={{ fontSize: "1.05rem", fontWeight: 900, color: "#FAF7F2" }}>Around Activities</span>
      </Link>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Link href="/connexion" style={{ padding: "0.45rem 1.1rem", borderRadius: "0.75rem", color: "rgba(250,247,242,0.7)", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
          Se connecter
        </Link>
        <Link href="/inscription" style={{ padding: "0.45rem 1.1rem", borderRadius: "0.75rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
          S&apos;inscrire
        </Link>
      </div>
    </nav>
  );
}

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingRequests } = useSocketContext();
  const hasNotification = pendingRequests.length > 0;

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const userId = user.id ?? 1;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  const navItems = [
    { href: "/home", label: "Explorer" },
    { href: "/mes-groupes", label: "Mes groupes" },
    { href: "/conversations", label: "Conversations", badge: hasNotification },
    { href: `/profil/${userId}`, label: "Profil" },
  ];

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between px-8 py-3 bg-white border-b border-bg-3 sticky top-0 z-50">
        <Link href="/home" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <Image src="/logo.png" alt="Around Activities" width={36} height={36} style={{ borderRadius: "50%" }} />
          <span className="font-head" style={{ fontSize: "1.05rem", fontWeight: 900, color: "#1a1a2e" }}>Around Activities</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all relative ${pathname?.startsWith(item.href) ? "text-tc bg-tc-light font-semibold" : "text-ink-2 hover:text-ink hover:bg-bg-2"}`}
            >
              {item.label}
              {item.badge && (
                <span style={{ position: "absolute", top: 6, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
              )}
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} style={{ fontSize: "0.8rem", color: "#999", background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.8rem", borderRadius: "0.5rem" }}>
          Se déconnecter
        </button>
      </nav>

      {/* Mobile bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-bg-3 px-2 py-2 z-50 flex justify-around">
        {[
          { href: "/home", label: "Explorer", icon: "🧭" },
          { href: "/groupes/creer", label: "Créer", icon: "➕" },
          { href: "/mes-groupes", label: "Groupes", icon: "👥" },
          { href: "/conversations", label: "Messages", icon: "💬", badge: hasNotification },
          { href: `/profil/${userId}`, label: "Profil", icon: "👤" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors relative ${pathname?.startsWith(item.href) ? "text-tc" : "text-ink-3"}`}
          >
            <span className="text-xl relative">
              {item.icon}
              {item.badge && (
                <span style={{ position: "absolute", top: 0, right: -2, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", display: "inline-block" }} />
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
