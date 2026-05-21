import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 text-center" style={{ background: "#2D1535" }}>

      {/* Dégradés animés */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse, rgba(196,96,58,0.30) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "-10%", background: "radial-gradient(ellipse, rgba(160,60,180,0.25) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10">
        <div
          className="font-head font-black mb-4"
          style={{
            fontSize: "10rem", lineHeight: 1,
            background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
          }}
        >
          404
        </div>

        <h1 className="font-head font-black tracking-tight mb-3" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
          Page introuvable
        </h1>

        <p style={{ color: "rgba(250,247,242,0.45)", fontSize: "0.875rem", marginBottom: "2.5rem", maxWidth: "280px", margin: "0 auto 2.5rem" }}>
          Cette page n&apos;existe pas ou a été déplacée.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "1rem 2rem",
            background: "linear-gradient(135deg, #C4603A, #E8924A)",
            color: "#fff", borderRadius: "9999px",
            fontWeight: 600, fontSize: "1rem",
            textDecoration: "none",
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
