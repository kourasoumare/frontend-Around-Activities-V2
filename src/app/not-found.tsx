import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-bg grad-auth" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", textAlign: "center" }}>
      <div className="page-content">
        <div style={{
          fontFamily: "var(--font-head)", fontWeight: 900, lineHeight: 1,
          fontSize: "clamp(6rem, 15vw, 10rem)",
          background: "var(--tc-grad)",
          WebkitBackgroundClip: "text", backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1.25rem",
        }}>
          404
        </div>

        <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--text)", marginBottom: "0.75rem" }}>
          Page introuvable
        </h1>

        <p style={{ color: "var(--text-3)", fontSize: "0.9rem", marginBottom: "2rem", maxWidth: 280, margin: "0 auto 2rem" }}>
          Cette page n&apos;existe pas ou a été déplacée.
        </p>

        <Link href="/" style={{
          display: "inline-block",
          padding: "0.85rem 2rem",
          background: "var(--tc-grad)",
          color: "#fff", borderRadius: "9999px",
          fontWeight: 600, fontSize: "0.95rem",
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(196,96,58,0.30)",
        }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}