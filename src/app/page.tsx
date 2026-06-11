"use client";

import Link from "next/link";
import { ArrowRight, Search, ChevronDown, MapPin, Sparkles, Plus, Users, MessageCircle, Compass, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Navbar";

export default function Landing() {
  return (
    <div className="page-shell">
      {/* Header on top of hero */}
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
      <section className="relative h-[100vh] min-h-[640px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero.jpg" alt="Amis à Paris" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(20,12,5,0.65) 0%, rgba(20,12,5,0.25) 50%, rgba(20,12,5,0) 100%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(253,250,246,0) 0%, var(--background) 100%)" }}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 md:px-8">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Nouvelle aventure en France
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
              Des activités.<br />
              <span className="bg-gradient-to-r from-[#FFD1A8] to-[#FF9966] bg-clip-text text-transparent">
                De vraies rencontres.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Rejoins des groupes à taille humaine, découvre ta nouvelle ville et rencontre des personnes qui partagent tes centres d&apos;intérêt.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/inscription" className="btn-primary !px-7 !py-3.5 text-base">
                Commencer l&apos;aventure <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section id="concept" className="relative isolate radial-home">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">Comment ça marche</span>
            <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl md:text-6xl">Trois étapes, mille histoires.</h2>
          </div>
          <ScrollStory />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div
            className="relative overflow-hidden rounded-[2rem] p-10 md:p-16"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-warm)" }}
          >
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="text-white">
                <h3 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
                  Prêt·e à rencontrer<br />
                  <span className="italic">votre nouvelle bande ?</span>
                </h3>
                <p className="mt-3 text-white/85">Crée ton compte en moins d&apos;une minute, gratuitement.</p>
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

      <footer className="relative border-t border-[var(--border)] px-5 py-10 md:px-8">
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

/* ---------- Scroll-driven story ---------- */
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

function ScrollStory() {
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
      const ratio = total > 0 ? scrolled / total : 0;
      setProgress(ratio * (STEPS.length - 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = Math.round(progress);
  const screens = [<ScreenExplore key="a" />, <ScreenGroup key="b" />, <ScreenChat key="c" />];

  return (
    <div ref={containerRef} className="relative mt-20" style={{ height: `${STEPS.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex justify-center">
            <PhoneFrame>
              <div
                className="flex flex-col"
                style={{
                  transform: `translateY(-${active * PHONE_H}px)`,
                  transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                {screens.map((s, i) => (
                  <div key={i} className="h-full w-full shrink-0 px-3 pt-2 pb-3" style={{ height: PHONE_H }}>
                    {s}
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </div>

          <div className="relative min-h-[400px]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-20 -left-2 select-none font-display text-[11rem] font-bold leading-none md:text-[14rem]"
              style={{ color: "rgba(196, 96, 58, 0.10)" }}
            >
              {STEPS[active].number}
            </span>
            {STEPS.map((s, i) => (
              <div
                key={s.number}
                className="absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "translateY(0)" : "translateY(24px)",
                  pointerEvents: i === active ? "auto" : "none",
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">{s.kicker}</span>
                <h3 className="relative mt-3 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
                  {s.titleA}<em className="italic text-[var(--primary)]">{s.titleEm}</em>
                </h3>
                <p className="relative mt-6 max-w-md text-lg leading-relaxed text-[var(--muted-text)]">{s.text}</p>
              </div>
            ))}
            <div className="absolute -bottom-4 left-0 flex gap-2">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 32 : 12,
                    background: i === active ? "var(--primary)" : "rgba(196,96,58,0.25)",
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

const PHONE_H = 470;

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[290px] rounded-[2.2rem] border-[5px] border-[#1a1410] bg-[#FDFAF6] shadow-[var(--shadow-lift)]">
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-20 -translate-x-1/2 rounded-full bg-[#1a1410]" />
      <div className="overflow-hidden rounded-[1.7rem]">
        <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-[10px] font-semibold text-[var(--foreground)]">
          <span>9:41</span><span>● ● ●</span>
        </div>
        <div className="relative overflow-hidden" style={{ height: PHONE_H }}>{children}</div>
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

function ScreenExplore() {
  const cats = [
    { emoji: "⚽", label: "Foot", color: "#4A8C5E" },
    { emoji: "🎨", label: "Art", color: "#8E5BA8" },
    { emoji: "🍷", label: "Brunch", color: "#C4603A" },
    { emoji: "🎷", label: "Jazz", color: "#D4A547" },
    { emoji: "🧘", label: "Yoga", color: "#6BA89B" },
    { emoji: "🥾", label: "Rando", color: "#6B8E4E" },
  ];
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
        <Search className="h-3.5 w-3.5 text-[var(--soft-text)]" />
        <span className="flex-1 text-[11px] text-[var(--soft-text)]">Tu as envie de quoi ?</span>
        <ChevronDown className="h-3 w-3 text-[var(--soft-text)]" />
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted-text)]">
        <MapPin className="h-3 w-3" /> Paris
        <span className="ml-auto rounded-full bg-[var(--primary)]/10 px-2 py-0.5 font-semibold text-[var(--primary)]">23 actives</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {cats.map((c) => (
          <div key={c.label} className="aspect-square rounded-2xl bg-white p-2 shadow-sm flex flex-col items-center justify-center gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-base" style={{ background: `${c.color}1f` }}>{c.emoji}</div>
            <span className="text-[9px] font-semibold">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-2)] p-3 text-[10px] text-white">
        <div className="flex -space-x-1.5">
          {[1,2,3,4].map(i => <div key={i} className="h-5 w-5 rounded-full border border-white bg-white/30" />)}
        </div>
        <p className="mt-1.5 font-semibold">+ 240 nouvelles personnes près de toi</p>
      </div>
    </div>
  );
}

function ScreenGroup() {
  return (
    <div className="space-y-2.5">
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-wider text-[var(--soft-text)]">Nouvelle sortie</span>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)]/10 text-lg">🎷</div>
          <div className="flex-1">
            <p className="text-[11px] font-bold">Soirée jazz au Sunside</p>
            <p className="text-[9px] text-[var(--soft-text)]">Vendredi 20 juin · 21h</p>
          </div>
        </div>
        <div className="mt-2.5 rounded-xl bg-[var(--background)] p-2 text-[9px] text-[var(--muted-text)]">📍 60 rue des Lombards, Paris</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1.5">
              {[1,2,3].map(i => <div key={i} className="h-5 w-5 rounded-full border border-white" style={{ background: ["#C4603A","#8E5BA8","#6BA89B"][i-1] }} />)}
            </div>
            <span className="text-[9px] text-[var(--muted-text)]">3 inscrits · 6 max</span>
          </div>
          <button className="rounded-full bg-[var(--primary)] px-3 py-1 text-[9px] font-bold text-white">Rejoindre</button>
        </div>
      </div>
      <button className="flex w-full items-center justify-center gap-1 rounded-full border-2 border-dashed border-[var(--border)] py-2 text-[10px] font-semibold text-[var(--muted-text)]">
        <Plus className="h-3 w-3" /> Créer ma sortie
      </button>
    </div>
  );
}

function ScreenChat() {
  const msgs = [
    { name: "Mei", text: "On se retrouve à 20h45 devant ?", color: "#8E5BA8", me: false },
    { name: "Moi", text: "Parfait, j'apporte les places 🎫", color: "#C4603A", me: true },
    { name: "Yanis", text: "Je suis dans le métro, à dans 10 !", color: "#4A8C5E", me: false },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10 text-base">🎷</div>
        <div className="flex-1">
          <p className="text-[11px] font-bold">Soirée jazz au Sunside</p>
          <p className="text-[8px] text-[var(--soft-text)]">3 membres · en ligne</p>
        </div>
      </div>
      <div className="space-y-2 px-1 py-1">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-1.5 ${m.me ? "flex-row-reverse" : ""}`}>
            {!m.me && <div className="h-5 w-5 shrink-0 rounded-full" style={{ background: m.color }} />}
            <div className={`max-w-[75%] rounded-2xl px-2.5 py-1.5 text-[10px] ${m.me ? "bg-[var(--primary)] text-white" : "bg-white text-[var(--foreground)] shadow-sm"}`}>
              {!m.me && <p className="text-[8px] font-bold opacity-70">{m.name}</p>}
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
        <span className="flex-1 text-[10px] text-[var(--soft-text)]">Écrire un message…</span>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-white text-[10px]">→</div>
      </div>
    </div>
  );
}
