"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PublicNavbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-bg-3 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3">
  <img src="/logo.png" alt="Around Activities" className="h-10 w-auto" />
  <span className="font-head text-xl font-black text-ink tracking-tight">Around Activities</span>
</Link>
      <div className="flex items-center gap-4">
        <Link href="/connexion" className="text-sm font-medium text-ink-2 hover:text-ink px-3 py-1.5 rounded-xl hover:bg-bg-2 transition-all">
          Se connecter
        </Link>
        <Link href="/inscription" className="btn btn-primary btn-sm">
          S&apos;inscrire
        </Link>
      </div>
    </nav>
  );
}

export function AppNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/home", label: "Explorer", icon: "🧭" },
    { href: "/mes-groupes", label: "Mes groupes", icon: "👥" },
    { href: "/profil/1", label: "Profil", icon: "👤" },
  ];

  return (
    <>
      {/* Desktop top navbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-bg-3 sticky top-0 z-50">
        <Link href="/home" className="flex items-center gap-3">
  <img src="/logo.png" alt="Around Activities" className="h-10 w-auto" />
  <span className="font-head text-xl font-black text-ink tracking-tight">Around Activities</span>
</Link>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${pathname?.startsWith(item.href)
                  ? "text-tc bg-tc-light font-semibold"
                  : "text-ink-2 hover:text-ink hover:bg-bg-2"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="text-xs text-ink-3 hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-bg-2"
        >
          Se déconnecter
        </Link>
      </nav>

      {/* Mobile bottom navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-bg-3 px-6 py-3 z-50 flex justify-around">
        {[
          { href: "/home", label: "Accueil", icon: "🏠" },
          { href: "/home", label: "Explorer", icon: "🧭" },
          { href: "/groupes/creer", label: "Créer", icon: "➕" },
          { href: "/mes-groupes", label: "Groupes", icon: "👥" },
          { href: "/profil/1", label: "Profil", icon: "👤" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${pathname?.startsWith(item.href) ? "text-tc" : "text-ink-3"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
