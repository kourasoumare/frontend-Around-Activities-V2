"use client";

import Link from "next/link";
import { useState } from "react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6" style={{ background: "#2D1535" }}>

      {/* Dégradés animés */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "-10%", left: "-10%", background: "radial-gradient(ellipse, rgba(196,96,58,0.30) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "-10%", background: "radial-gradient(ellipse, rgba(160,60,180,0.25) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <video src="/logo.mp4" autoPlay loop muted playsInline className="h-16 w-16 rounded-full object-cover" />
            <span className="font-head text-xl font-black" style={{ color: "#FAF7F2" }}>Around Activities</span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(12px)", textAlign: "center" }}>

          <div style={{ fontSize: "3rem", marginBottom: "1.25rem" }}></div>

          <h1 className="font-head font-black tracking-tight mb-2" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
            Mot de passe{" "}
            <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>oublié</span>
          </h1>
          <p style={{ color: "rgba(250,247,242,0.5)", fontSize: "0.875rem", marginBottom: "2rem" }}>
            On t&apos;envoie un lien de réinitialisation par email.
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "left" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                  TON ADRESSE EMAIL
                </label>
                <input
                  type="email"
                  placeholder="jules@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                />
              </div>
              <button
                type="submit"
                style={{ width: "100%", padding: "0.9rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}
              >
                Recevoir le lien →
              </button>
            </form>
          ) : (
            <div style={{ background: "rgba(196,96,58,0.12)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "left" }}>
              <p style={{ color: "#FAF7F2", fontWeight: 600, marginBottom: "0.5rem" }}>✅ Lien envoyé !</p>
              <p style={{ color: "rgba(250,247,242,0.6)", fontSize: "0.875rem" }}>
                Si cet email existe dans notre base, tu recevras un lien dans quelques minutes. Pense à vérifier tes spams.
              </p>
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/connexion" style={{ color: "#E8924A", fontSize: "0.875rem", textDecoration: "none", fontWeight: 500 }}>
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}