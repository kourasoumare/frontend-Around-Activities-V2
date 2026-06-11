"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Plus, MessageCircle, User as UserIcon, Compass, Home, LogOut } from "lucide-react";
import { useSocketContext } from "@/context/SocketContext";
import type { ReactNode } from "react";

/* ── Avatar ── */
export function Avatar({ name, size = 40, color }: { name: string; size?: number; color?: string }) {
  const init = name.trim().split(/\s+/).map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);
  return (
    <span
      className="inline-grid place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.38, background: color ?? "var(--gradient-primary)", flexShrink: 0 }}
    >
      {init}
    </span>
  );
}

/* ── Logo ── */
export function Logo() {
  return (
    <span
      className="grid h-9 w-9 place-items-center rounded-2xl shadow-[0_6px_16px_-4px_rgba(196,96,58,0.5)]"
      style={{ background: "var(--gradient-primary)" }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </span>
  );
}

/* ── SearchBar ── */
export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--soft-text)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Rechercher une activité, une ville…"}
        className="field !pl-12"
      />
    </div>
  );
}

/* ── CreateButton ── */
export function CreateButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn-primary">
      <Plus className="h-4 w-4" /> {label}
    </Link>
  );
}

/* ── PageShell ── */
type Variant = "home" | "activity" | "group" | "chat" | "profile";

const radialClass: Record<Variant, string> = {
  home: "radial-home",
  activity: "radial-activity",
  group: "radial-group",
  chat: "radial-chat",
  profile: "radial-profile",
};

export function PageShell({
  variant = "home",
  children,
  noNav = false,
}: {
  variant?: Variant;
  children: ReactNode;
  noNav?: boolean;
}) {
  return (
    <div className={`page-shell ${radialClass[variant]}`}>
      <div className="doodle-bg" aria-hidden="true" />
      {!noNav && <AppNavbar />}
      <main className="relative z-10 pb-24 md:pb-8">{children}</main>
      {!noNav && <MobileNav />}
    </div>
  );
}

/* ── Desktop Navbar ── */
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-[rgba(196,96,58,0.1)] text-[var(--primary)]"
          : "text-[var(--muted-text)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </Link>
  );
}

export function AppNavbar() {
  const router = useRouter();
  const { pendingRequests } = useSocketContext();
  const notifCount = pendingRequests?.length ?? 0;

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.first_name ?? user?.firstName ?? "";
  const lastName = user?.last_name ?? user?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = fullName
    ? fullName.split(/\s+/).map((n: string) => n[0] ?? "").join("").toUpperCase().slice(0, 2)
    : "?";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/connexion");
  }

  return (
    <header className="sticky top-0 z-30 glass-panel">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href={user ? "/home" : "/"} className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-xl font-bold tracking-tight">
            Around <span className="text-grad">Activities</span>
          </span>
        </Link>

        {user ? (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink href="/home">Explorer</NavLink>
              <NavLink href="/mes-groupes">Mes activités</NavLink>
              <NavLink href="/conversations">
                <span className="relative">
                  Conversations
                  {notifCount > 0 && (
                    <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "var(--primary)" }}>
                      {notifCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink href={`/profil/${user?.id ?? ""}`}>Profil</NavLink>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href={`/profil/${user?.id ?? ""}`}
                className="hidden h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-[var(--primary-foreground)] md:flex"
                style={{ background: "var(--gradient-primary)" }}
              >
                {initials}
              </Link>
              <button
                onClick={handleLogout}
                className="hidden btn-secondary md:inline-flex !py-2 !px-3 text-sm"
                title="Se déconnecter"
              >
                <LogOut className="h-4 w-4" /> <span>Sortir</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/connexion" className="btn-secondary !py-2 text-sm">Se connecter</Link>
            <Link href="/inscription" className="btn-primary !py-2 text-sm">S&apos;inscrire</Link>
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Mobile Bottom Nav ── */
function MobileNav() {
  const pathname = usePathname();

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  if (!user) return null;

  function item(href: string, Icon: typeof Home, label: string) {
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={`flex flex-1 flex-col items-center gap-1 py-2 ${active ? "text-[var(--primary)]" : "text-[var(--muted-text)]"}`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-[10px] font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass-panel border-t md:hidden">
      <div className="mx-auto flex max-w-md">
        {item("/home", Home, "Accueil")}
        {item("/mes-groupes", Compass, "Mes activités")}
        {item("/conversations", MessageCircle, "Chats")}
        {item(`/profil/${user?.id ?? ""}`, UserIcon, "Profil")}
      </div>
    </nav>
  );
}
