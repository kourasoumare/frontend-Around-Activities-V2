"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#2D1535" }}>

      {/* ── Navbar publique ── */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2.5rem" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <Image src="/logo.png" alt="Around Activities" width={38} height={38} style={{ borderRadius: "50%" }} />
          <div>
            <span className="font-head" style={{ fontSize: "1.05rem", fontWeight: 900, color: "#FAF7F2" }}>Around Activities</span>
            <span style={{ display: "block", fontSize: "0.7rem", color: "rgba(250,247,242,0.4)", marginTop: "0px" }}>Nouveaux arrivants en France</span>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link href="/connexion" style={{ padding: "0.45rem 1.1rem", borderRadius: "0.75rem", color: "rgba(250,247,242,0.85)", fontSize: "0.85rem", fontWeight: 500, textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)" }}>
            Se connecter
          </Link>
          <Link href="/inscription" style={{ padding: "0.45rem 1.1rem", borderRadius: "0.75rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
            S&apos;inscrire
          </Link>
        </div>
      </nav>

      {/* ── Hero plein écran ── */}
      <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: "600px" }}>
        <Image src="/hero.jpg" alt="Jeunes à Paris" fill style={{ objectFit: "cover", objectPosition: "center" }} priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.25) 100%)" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 5rem" }}>
          <div style={{ maxWidth: "560px" }}>
            <h1 className="font-head font-black leading-tight tracking-tight" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", marginBottom: "1.25rem" }}>
              <span style={{ color: "#FFFFFF", display: "block" }}>Des activités.</span>
              <span style={{ background: "linear-gradient(135deg, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>
                De vraies rencontres.
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2rem", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
              Rejoins des groupes, découvre des activités et rencontre des personnes qui partagent tes centres d&apos;intérêt.
            </p>
            <Link href="/inscription" style={{ display: "inline-block", padding: "1rem 2rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", borderRadius: "0.875rem", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>
              Trouver ma communauté →
            </Link>
            <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>
              Déjà membre ?{" "}
              <Link href="/connexion" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 3 cartes ── */}
      <div style={{ background: "linear-gradient(180deg, #1E0D28 0%, #2D1535 100%)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", marginBottom: "3rem" }}>
          <h2 className="font-head font-black tracking-tight" style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "#FAF7F2", marginBottom: "0.75rem" }}>
            Comment ça fonctionne ?
          </h2>
          <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "1rem" }}>
            Trois étapes simples pour ne plus être seul.
          </p>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {[
            { num: "01", emoji: "🎯", title: "Activités", desc: "Découvre quoi faire autour de toi" },
            { num: "02", emoji: "👥", title: "Communautés", desc: "Rejoins des groupes selon tes intérêts" },
            { num: "03", emoji: "✨", title: "Rencontres", desc: "Crée des liens naturellement" },
          ].map((card) => (
            <div key={card.num} style={{ position: "relative", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2rem", overflow: "hidden" }}>
              <span className="font-head font-black" style={{ position: "absolute", top: "1rem", right: "1.25rem", fontSize: "3.5rem", color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>
                {card.num}
              </span>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.emoji}</div>
              <h3 style={{ fontWeight: 700, color: "#FAF7F2", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{card.title}</h3>
              <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/inscription" style={{ display: "inline-block", padding: "0.75rem 2rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(250,247,242,0.7)", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }}>
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}
