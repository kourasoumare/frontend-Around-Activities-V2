"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Plus, MessageCircle, User as UserIcon, Compass, Home, LogOut, UserPlus, Bell, X } from "lucide-react";
import { useSocketContext } from "@/context/SocketContext";
import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ── Types ── */
type Notification = {
  id: number;
  type: string;
  content: string;
  link: string | null;
  created_at: string;
};

/* ── Toast ── */
function NotificationToast({ notif, onClose }: { notif: Notification; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed top-5 right-5 z-50 flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg"
      style={{ background: "var(--card)", border: "1px solid var(--border)", maxWidth: 320, backdropFilter: "blur(14px)" }}
    >
      <Bell className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
      <p className="text-sm flex-1" style={{ color: "var(--foreground)" }}>{notif.content}</p>
      <button onClick={onClose} className="shrink-0">
        <X className="h-4 w-4" style={{ color: "var(--muted-text)" }} />
      </button>
    </div>
  );
}

/* ── Hook notifications ── */
function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<Notification | null>(null);
  const { socket } = useSocketContext();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Charger les notifications au démarrage
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => Array.isArray(data) ? setNotifications(data) : null)
      .catch(() => null);
  }, [token]);

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!socket) return;
    socket.on("new_notification", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
      setToast(notif);
    });
    return () => { socket.off("new_notification"); };
  }, [socket]);

  // Supprimer une notification (clic dessus)
  async function deleteNotification(id: number) {
    if (!token) return;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await fetch(`${API}/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => null);
  }

  return { notifications, toast, setToast, deleteNotification };
}

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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logov2.png"
      alt="Around Activities"
      className="h-9 w-9 object-contain"
    />
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

/* ── Cloche avec dropdown ── */
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { notifications, toast, setToast, deleteNotification } = useNotifications();
  const unread = notifications.length;

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleNotifClick(notif: Notification) {
    await deleteNotification(notif.id);
    setOpen(false);
    if (notif.link) router.push(notif.link);
  }

  return (
    <>
      {/* Toast */}
      {toast && <NotificationToast notif={toast} onClose={() => setToast(null)} />}

      {/* Cloche */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/60"
        >
          <Bell className="h-5 w-5" style={{ color: "var(--muted-text)" }} />
          {unread > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: "var(--primary)" }}
            >
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-0 top-12 w-80 rounded-2xl shadow-lg overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)", backdropFilter: "blur(14px)" }}
          >
            <div className="border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-display font-bold text-sm">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm" style={{ color: "var(--muted-text)" }}>
                Aucune notification
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/60"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <Bell className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: "var(--foreground)" }}>{n.content}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted-text)" }}>
                        {new Date(n.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
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
              <NavLink href="/demandes-ami">
                <span className="relative">
                  Demandes
                  {notifCount > 0 && (
                    <span className="absolute -right-2.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "var(--primary)" }}>
                      {notifCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink href="/conversations">Conversations</NavLink>
              <NavLink href={`/profil/${user?.id ?? ""}`}>Profil</NavLink>
            </nav>
            <div className="flex items-center gap-2">
              {/* Cloche notifications */}
              <NotificationBell />
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
        {item("/demandes-ami", UserPlus, "Demandes")}
        {item("/conversations", MessageCircle, "Chats")}
        {item(`/profil/${user?.id ?? ""}`, UserIcon, "Profil")}
      </div>
    </nav>
  );
}