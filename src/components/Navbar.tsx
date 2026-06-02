"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFriendRequestsApi } from "@/lib/api";

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
  const [userId, setUserId] = useState<number | null>(null);
  const [hasRequests, setHasRequests] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(stored.id ?? null);
  }, []);

  useEffect(() => {
    if (!userId) return;
    getFriendRequestsApi()
      .then((data) => { if (Array.isArray(data) && data.length > 0) setHasRequests(true); })
      .catch(() => {});
  }, [userId]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  }

  const navItems = [
    { href: "/home", label: "Explorer" },
    { href: "/mes-groupes", label: "Mes groupes" },
    { href: "/conversations", label: "Conversations", badge: hasRequests },
    { href: `/profil/${userId}`, label: "Profil" },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/profil/")) return pathname?.startsWith("/profil/") ?? false;
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 2rem", background: "rgba(45,21,53,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <Link href="/home" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
        <Image src="/logo.png" alt="Around Activities" width={34} height={34} style={{ borderRadius: "50%" }} />
        <span className="font-head" style={{ fontSize: "1rem", fontWeight: 900, color: "#FAF7F2" }}>Around Activities</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem", fontWeight: isActive(item.href) ? 600 : 500, color: isActive(item.href) ? "#E8924A" : "rgba(250,247,242,0.65)", background: isActive(item.href) ? "rgba(196,96,58,0.12)" : "transparent", textDecoration: "none", transition: "all 0.15s" }}>
            {item.label}
            {item.badge && (
              <span style={{ position: "absolute", top: "4px", right: "6px", width: 8, height: 8, borderRadius: "50%", background: "#E8924A" }} />
            )}
          </Link>
        ))}
      </div>

      <button onClick={handleLogout}
        style={{ fontSize: "0.8rem", color: "rgba(250,247,242,0.35)", background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", fontFamily: "inherit" }}>
        Se déconnecter
      </button>
    </nav>
  );
}
