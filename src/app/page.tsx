"use client";

import Link from "next/link";
import { ArrowRight, Search, Sparkles, Plus, Users, MessageCircle, Compass, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Navbar";

export default function Landing() {
  return (
    <div className="page-shell">
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Logo />
            <span className="font-display text-xl font-bold tracking-tight">Around Activities</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/connexion" className="rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-white/10">
              Se connecter
            </Link>
            <Link href="/inscription" className="btn-primary !py-2 text-sm">S&apos;inscrire</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[100vh] min-h-[600px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.jpg"
          alt="Amis à Paris"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] md:object-center"
        />
        {/* Gradient desktop */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(90deg, rgba(20,12,5,0.70) 0%, rgba(20,12,5,0.25) 55%, rgba(20,12,5,0) 100%)" }}
        />
        {/* Gradient mobile */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to top, rgba(10,6,2,0.85) 0%, rgba(10,6,2,0.4) 50%, rgba(10,6,2,0.1) 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(253,250,246,0) 0%, var(--background) 100%)" }}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 md:justify-center md:px-8 md:pb-0">
          <div className="text-white md:max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Nouvelle aventure en France
            </span>
            <h1 className="mt-4 font-display text-[2.4rem] font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
              Des activités.<br />
              <span className="bg-gradient-to-r from-[#FFD1A8] to-[#FF9966] bg-clip-text text-transparent">
                De vraies rencontres.
              </span>
            </h1>
            <p className="mt-4 text-base text-white/85 md:mt-6 md:max-w-xl md:text-lg">
              Rejoins des groupes à taille humaine, découvre ta nouvelle ville et rencontre des personnes qui partagent tes centres d&apos;intérêt.
            </p>
            <div className="mt-6 md:mt-8">
              <Link href="/inscription" className="btn-primary !px-7 !py-3.5 text-base">
                Commencer l&apos;aventure <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section id="concept" className="relative isolate radial-home">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:py-24 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Comment ça marche</span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl md:text-6xl">Trois étapes, mille histoires.</h2>
          </div>
          <ScrollStory />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div
            className="relative overflow-hidden rounded-[2rem] p-8 md:p-16"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-warm)" }}
          >
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-8">
              <div className="text-white">
                <h3 className="font-display text-2xl font-bold leading-tight sm:text-4xl md:text-5xl">
                  Prêt·e à rencontrer<br />
                  <span className="italic">votre nouvelle bande ?</span>
                </h3>
                <p className="mt-3 text-sm text-white/85 md:text-base">Crée ton compte en moins d&apos;une minute, gratuitement.</p>
              </div>
              <Link
                href="/inscription"
                className="shrink-0 rounded-full bg-white px-8 py-4 font-semibold text-[var(--primary)] shadow-lg transition hover:-translate-y-0.5"
              >
                Créer mon compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-[var(--border)] px-5 py-8 md:py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[var(--muted-text)] md:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-base font-bold text-[var(--foreground)]">Around Activities</span>
          </div>
          <p>© {new Date().getFullYear()} — Fait avec soin à Paris.</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Données ─── */
const STEPS = [
  {
    number: "01", kicker: "Explorez",
    titleA: "Trouvez votre ", titleEm: "tribu",
    text: "Parcourez des dizaines d'activités autour de chez vous — sport, art, cuisine, musique, bien-être. Chaque communauté regroupe les gens qui partagent une vraie passion commune.",
  },
  {
    number: "02", kicker: "Rejoignez",
    titleA: "Proposez une ", titleEm: "sortie",
    text: "Une envie subite ? Un café, une expo, un jogging ? Créez un groupe en 30 secondes et laissez la magie opérer. Les intéressés vous rejoignent.",
  },
  {
    number: "03", kicker: "Vivez",
    titleA: "Sortez pour de ", titleEm: "vrai",
    text: "La messagerie de groupe sert à organiser les détails. Ensuite, rangez votre téléphone et vivez l'instant présent — c'est là que tout se passe.",
  },
];

const PHONE_H = 470;
const PHONE_H_MOBILE = 340;

/* ─── Hook scroll ─── */
function useScrollProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? (scrolled / total) * (STEPS.length - 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { containerRef, progress };
}

/* ─── Transitions communes ─── */
function screenStyle(isActive: boolean, i: number, active: number) {
  const offset = i < active ? -18 : i > active ? 18 : 0;
  return {
    opacity: isActive ? 1 : 0,
    transform: `translateY(${offset}px) scale(${isActive ? 1 : 0.97})`,
    filter: isActive ? "blur(0px)" : "blur(3px)",
    transition: [
      "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
      "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
      "filter 500ms cubic-bezier(0.4, 0, 0.2, 1)",
    ].join(", "),
    transitionDelay: isActive ? "60ms" : "0ms",
    pointerEvents: (isActive ? "auto" : "none") as React.CSSProperties["pointerEvents"],
    willChange: "opacity, transform, filter",
  };
}

/* ─── Version mobile ─── */
function ScrollStoryMobile() {
  const [active, setActive] = useState(0);
  const screens = [<ScreenExplore key="a" />, <ScreenGroup key="b" />, <ScreenChat key="c" />];

  return (
    <div className="mt-10 flex flex-col items-center gap-6">
      <PhoneFrame mobile>
        <div className="relative w-full" style={{ height: PHONE_H_MOBILE }}>
          {screens.map((s, i) => (
            <div key={i} className="absolute inset-0 px-3 pt-2 pb-3" style={screenStyle(i === active, i, active)}>
              {s}
            </div>
          ))}
        </div>
      </PhoneFrame>

      <div className="w-full max-w-sm px-2 text-center">
        {STEPS.map((s, i) => (
          <div key={s.number} style={{ display: i === active ? "block" : "none" }}>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">{s.kicker}</span>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
              {s.titleA}<em className="italic text-[var(--primary)]">{s.titleEm}</em>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted-text)]">{s.text}</p>
          </div>
        ))}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-text)] disabled:opacity-30 text-lg"
          >←</button>
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? 32 : 12,
                  height: 8,
                  borderRadius: 999,
                  background: i === active ? "var(--primary)" : "rgba(196,96,58,0.25)",
                  transition: "width 400ms cubic-bezier(0.22, 1, 0.36, 1), background 400ms ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setActive((a) => Math.min(STEPS.length - 1, a + 1))}
            disabled={active === STEPS.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-text)] disabled:opacity-30 text-lg"
          >→</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Version desktop ─── */
function ScrollStoryDesktop() {
  const { containerRef, progress } = useScrollProgress();
  const active = Math.round(progress);
  const screens = [<ScreenExplore key="a" />, <ScreenGroup key="b" />, <ScreenChat key="c" />];

  return (
    <div ref={containerRef} className="relative mt-20" style={{ height: `${STEPS.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="grid w-full grid-cols-2 items-center gap-16">

          <div className="flex justify-center">
            <PhoneFrame>
              <div className="relative w-full" style={{ height: PHONE_H }}>
                {screens.map((s, i) => (
                  <div key={i} className="absolute inset-0 px-3 pt-2 pb-3" style={screenStyle(i === active, i, active)}>
                    {s}
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </div>

          <div className="relative min-h-[400px]">
            {STEPS.map((s, i) => (
              <span
                key={s.number}
                aria-hidden
                className="pointer-events-none absolute -top-20 -left-2 select-none font-display text-[14rem] font-bold leading-none"
                style={{
                  color: "rgba(196, 96, 58, 0.10)",
                  opacity: i === active ? 1 : 0,
                  transition: "opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDelay: i === active ? "100ms" : "0ms",
                }}
              >
                {s.number}
              </span>
            ))}

            {STEPS.map((s, i) => {
              const isActive = i === active;
              const offsetText = i < active ? -20 : i > active ? 20 : 0;
              return (
                <div
                  key={s.number}
                  className="absolute inset-0"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${offsetText}px)`,
                    filter: isActive ? "blur(0px)" : "blur(2px)",
                    transition: [
                      "opacity 550ms cubic-bezier(0.4, 0, 0.2, 1)",
                      "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                      "filter 450ms cubic-bezier(0.4, 0, 0.2, 1)",
                    ].join(", "),
                    transitionDelay: isActive ? "120ms" : "0ms",
                    pointerEvents: isActive ? "auto" : "none",
                    willChange: "opacity, transform, filter",
                  }}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">{s.kicker}</span>
                  <h3 className="relative mt-3 font-display text-5xl font-bold leading-[1.05] md:text-6xl">
                    {s.titleA}<em className="italic text-[var(--primary)]">{s.titleEm}</em>
                  </h3>
                  <p className="relative mt-6 max-w-md text-lg leading-relaxed text-[var(--muted-text)]">{s.text}</p>
                </div>
              );
            })}

            <div className="absolute -bottom-4 left-0 flex gap-2">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{
                    width: i === active ? 32 : 12,
                    background: i === active ? "var(--primary)" : "rgba(196,96,58,0.25)",
                    transition: "width 400ms cubic-bezier(0.22, 1, 0.36, 1), background 400ms ease",
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Wrapper ─── */
function ScrollStory() {
  return (
    <>
      <div className="md:hidden">
        <ScrollStoryMobile />
      </div>
      <div className="hidden md:block">
        <ScrollStoryDesktop />
      </div>
    </>
  );
}

/* ─── PhoneFrame ─── */
function PhoneFrame({ children, mobile = false }: { children: React.ReactNode; mobile?: boolean }) {
  return (
    <div
      className="relative rounded-[2.2rem] border-[5px] border-[#1a1410] bg-[#FDFAF6] shadow-[var(--shadow-lift)]"
      style={{ width: mobile ? 230 : 290 }}
    >
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[#1a1410]" />
      <div className="overflow-hidden rounded-[1.7rem]">
        <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-[10px] font-semibold text-[var(--foreground)]">
          <span>9:41</span><span>● ● ●</span>
        </div>
        <div className="relative overflow-hidden" style={{ height: mobile ? PHONE_H_MOBILE : PHONE_H }}>
          {children}
        </div>
        <div className="flex items-center justify-around border-t border-[var(--border)] bg-white/70 px-2 py-2">
          {[
            { Icon: Compass, label: "Explorer" },
            { Icon: Users, label: "Activités" },
            { Icon: MessageCircle, label: "Chats" },
            { Icon: User, label: "Profil" },
          ].map((t, i) => (
            <div key={t.label} className="flex flex-col items-center gap-0.5">
              <t.Icon className={`h-4 w-4 ${i === 0 ? "text-[var(--primary)]" : "text-[var(--soft-text)]"}`} />
              <span className={`text-[8px] ${i === 0 ? "font-semibold text-[var(--primary)]" : "text-[var(--soft-text)]"}`}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Écrans ─── */
function ScreenExplore() {
  const activities = [
    { title: "Yoga du matin", img: "/bien etre.png", members: 12 },
    { title: "Expo Pompidou", img: "/art.png", members: 8 },
    { title: "Foot à Vincennes", img: "/sport.png", members: 18 },
    { title: "Soirée techno", img: "/divertissement.png", members: 24 },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
        <Search className="h-3 w-3 text-[var(--soft-text)]" />
        <span className="flex-1 text-[10px] text-[var(--soft-text)]">Rechercher une activité…</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {["Tout", "Sport", "Art", "Cuisine", "Musique"].map((f, i) => (
          <span
            key={f}
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold"
            style={i === 0
              ? { background: "var(--primary)", color: "white" }
              : { background: "white", color: "var(--muted-text)", border: "1px solid var(--border)" }
            }
          >{f}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {activities.map((a) => (
          <div key={a.title} className="relative overflow-hidden rounded-2xl" style={{ height: 80 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.img} alt={a.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%)" }} />
            <div className="absolute bottom-0 left-0 right-0 p-1.5">
              <p className="text-[9px] font-bold leading-tight text-white">{a.title}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <Users className="h-2.5 w-2.5 text-white/80" />
                <span className="text-[8px] text-white/80">{a.members} membres</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)] p-2 text-white">
        <div className="flex -space-x-1.5 shrink-0">
          {["#C4603A","#8E5BA8","#6BA89B","#4A8C5E"].map((c, i) => (
            <div key={i} className="h-5 w-5 rounded-full border-2 border-white/60" style={{ background: c }} />
          ))}
        </div>
        <p className="text-[9px] font-semibold">+240 personnes près de toi</p>
      </div>
    </div>
  );
}

function ScreenGroup() {
  const groups = [
    { title: "Balade photo Marais", date: "Sam 22 juin · 10h", members: 4, max: 8, img: "/art.png" },
    { title: "Course matinale", date: "Dim 23 juin · 8h30", members: 6, max: 10, img: "/sport.png" },
  ];
  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-2xl" style={{ height: 64 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art.png" alt="Art & Culture" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-[11px] font-bold text-white">Art & Culture</p>
          <p className="text-[8px] text-white/80">Communauté · 34 membres</p>
        </div>
        <span className="absolute right-2 top-2 rounded-full bg-[var(--primary)] px-2 py-0.5 text-[8px] font-bold text-white">Membre ✓</span>
      </div>
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Sorties à venir</p>
      {groups.map((g) => (
        <div key={g.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="relative" style={{ height: 46 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.img} alt={g.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)" }} />
            <p className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white">{g.title}</p>
          </div>
          <div className="flex items-center justify-between px-2 py-1.5">
            <div>
              <p className="text-[8px] text-[var(--soft-text)]">{g.date}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <div className="h-1 w-14 overflow-hidden rounded-full bg-[var(--border)]">
                  <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${(g.members / g.max) * 100}%` }} />
                </div>
                <span className="text-[8px] text-[var(--muted-text)]">{g.members}/{g.max}</span>
              </div>
            </div>
            <button className="rounded-full bg-[var(--primary)] px-2.5 py-1 text-[8px] font-bold text-white">Rejoindre</button>
          </div>
        </div>
      ))}
      <button className="flex w-full items-center justify-center gap-1 rounded-full border-2 border-dashed border-[var(--border)] py-1.5 text-[9px] font-semibold text-[var(--muted-text)]">
        <Plus className="h-3 w-3" /> Proposer une sortie
      </button>
    </div>
  );
}

function ScreenChat() {
  const msgs = [
    { name: "Mei", text: "On se retrouve à 20h45 devant ?", color: "#8E5BA8", me: false },
    { name: "Moi", text: "Parfait, j'apporte les places 🎫", color: "#C4603A", me: true },
    { name: "Yanis", text: "Je suis dans le métro, à dans 10 !", color: "#4A8C5E", me: false },
    { name: "Moi", text: "👍 Top, on vous attend !", color: "#C4603A", me: true },
  ];
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="relative overflow-hidden rounded-2xl shrink-0" style={{ height: 58 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Musique.png" alt="Musique" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5">
          <p className="text-[11px] font-bold text-white">Soirée jazz au Sunside</p>
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {["#C4603A","#8E5BA8","#6BA89B"].map((c, i) => (
                <div key={i} className="h-3.5 w-3.5 rounded-full border border-white/60" style={{ background: c }} />
              ))}
            </div>
            <span className="text-[8px] text-white/80">3 membres · en ligne</span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-1.5 px-0.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-1.5 ${m.me ? "flex-row-reverse" : ""}`}>
            {!m.me && <div className="h-5 w-5 shrink-0 rounded-full" style={{ background: m.color }} />}
            <div
              className="max-w-[75%] rounded-2xl px-2.5 py-1.5 text-[10px]"
              style={m.me
                ? { background: "var(--primary)", color: "white" }
                : { background: "white", color: "var(--foreground)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
              }
            >
              {!m.me && <p className="text-[8px] font-bold opacity-60 mb-0.5">{m.name}</p>}
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
        <span className="flex-1 text-[10px] text-[var(--soft-text)]">Écrire un message…</span>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[10px] font-bold">→</div>
      </div>
    </div>
  );
}