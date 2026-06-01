"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#2D1535", fontFamily: "var(--font-body)" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.5rem 2.5rem",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <Image src="/logo.png" alt="Around Activities" width={38} height={38} style={{ borderRadius: "50%" }} />
          <span style={{ fontFamily: "var(--font-head)", fontSize: "1.05rem", fontWeight: 900, color: "#FAF7F2" }}>
            Around Activities
          </span>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(250,247,242,0.6)", letterSpacing: "0.06em", textTransform: "uppercase", marginLeft: "0.25rem" }}>
            Nouveaux arrivants en France
          </span>
        </Link>
      </nav>

      {/* ── HERO SECTION ── */}
      <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: "640px" }}>
        <Image
          src="/hero.jpg"
          alt="Personnes qui se rencontrent à Paris"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)",
        }} />

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center",
          padding: "0 clamp(1.5rem, 6vw, 6rem)",
        }}>
          <div style={{ maxWidth: "560px" }}>
            <h1 style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#FAF7F2",
              margin: "0 0 1.5rem 0",
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
              letterSpacing: "-0.01em",
            }}>
              Des activités.<br />
              <span style={{
                background: "linear-gradient(135deg, #E8924A, #F0A860)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                De vraies rencontres.
              </span>
            </h1>

            <p style={{
              color: "rgba(250,247,242,0.82)",
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              lineHeight: 1.65,
              margin: "0 0 2.5rem 0",
              textShadow: "0 1px 8px rgba(0,0,0,0.35)",
              maxWidth: "460px",
            }}>
              Rejoins des groupes, découvre des activités et rencontre des personnes qui partagent tes centres d&apos;intérêt.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
              <Link href="/inscription" style={{
                display: "inline-block",
                padding: "1rem 2.25rem",
                background: "linear-gradient(135deg, #C4603A, #E8924A)",
                color: "#fff",
                borderRadius: "0.875rem",
                fontWeight: 700,
                fontSize: "1.05rem",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(196,96,58,0.45)",
                letterSpacing: "0.01em",
              }}>
                Trouver ma communauté →
              </Link>
              <p style={{ color: "rgba(250,247,242,0.55)", fontSize: "0.875rem", margin: 0 }}>
                Déjà membre ?{" "}
                <Link href="/connexion" style={{
                  color: "rgba(250,247,242,0.85)",
                  fontWeight: 500,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}>
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3 CARTES ── */}
      <div style={{
        background: "linear-gradient(180deg, #1E0D28 0%, #2D1535 100%)",
        padding: "5rem clamp(1.5rem, 5vw, 4rem)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "var(--font-head)",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 900,
            color: "#FAF7F2",
            margin: "0 0 0.75rem 0",
          }}>
            Comment ça fonctionne ?
          </h2>
          <p style={{ color: "rgba(250,247,242,0.45)", fontSize: "1rem", margin: 0 }}>
            Trois étapes simples pour ne plus être seul.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1000px",
          margin: "0 auto",
        }}>
          {[
            {
              emoji: "🎯",
              number: "01",
              title: "Activités",
              desc: "Découvre quoi faire autour de toi",
              border: "rgba(196,96,58,0.25)",
              glow: "rgba(196,96,58,0.08)",
            },
            {
              emoji: "👥",
              number: "02",
              title: "Communautés",
              desc: "Rejoins des groupes selon tes intérêts",
              border: "rgba(192,126,212,0.25)",
              glow: "rgba(160,60,180,0.1)",
            },
            {
              emoji: "✨",
              number: "03",
              title: "Rencontres",
              desc: "Crée des liens naturellement",
              border: "rgba(250,247,242,0.12)",
              glow: "rgba(255,255,255,0.03)",
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: `linear-gradient(135deg, ${card.glow}, rgba(255,255,255,0.03))`,
                border: `1px solid ${card.border}`,
                borderRadius: "1.25rem",
                padding: "2rem 1.75rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span style={{
                position: "absolute", top: "1rem", right: "1.25rem",
                fontFamily: "var(--font-head)",
                fontSize: "3.5rem", fontWeight: 900,
                color: "rgba(250,247,242,0.05)",
                lineHeight: 1, userSelect: "none",
              }}>
                {card.number}
              </span>

              <div style={{
                width: "52px", height: "52px",
                background: "rgba(255,255,255,0.07)",
                borderRadius: "0.875rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem",
                marginBottom: "1.25rem",
              }}>
                {card.emoji}
              </div>

              <h3 style={{
                fontFamily: "var(--font-head)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#FAF7F2",
                margin: "0 0 0.6rem 0",
              }}>
                {card.title}
              </h3>
              <p style={{
                color: "rgba(250,247,242,0.55)",
                fontSize: "0.95rem",
                lineHeight: 1.55,
                margin: 0,
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link href="/inscription" style={{
            display: "inline-block",
            padding: "0.9rem 2rem",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(250,247,242,0.8)",
            borderRadius: "0.875rem",
            fontWeight: 500,
            fontSize: "0.95rem",
            textDecoration: "none",
          }}>
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        background: "rgba(0,0,0,0.4)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem 2rem",
        textAlign: "center",
        color: "rgba(250,247,242,0.3)",
        fontSize: "0.8rem",
      }}>
        <span style={{ fontFamily: "var(--font-head)", color: "rgba(250,247,242,0.45)" }}>Around Activities</span>
        {" "}· Fait avec ❤️ pour les nouveaux arrivants · 2026
      </footer>
    </div>
  );
}
