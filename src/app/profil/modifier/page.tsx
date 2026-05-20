"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppNavbar } from "@/components/Navbar";
import { MOCK_USER, INTERESTS } from "@/lib/data";

export default function ModifierProfilPage() {
  const router = useRouter();
  const user = MOCK_USER;

  const [form, setForm] = useState({
    firstName: user.firstName,
    city: user.city,
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleInterest(tag: string) {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/profil/1");
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>

      {/* Dégradés animés */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
        <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10">
        <AppNavbar />

        <div className="max-w-2xl mx-auto px-6 py-10">
          <Link href="/profil/1" style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>
            ← Retour au profil
          </Link>

          <h1 className="font-head font-black tracking-tight mb-1" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
            Modifier mon{" "}
            <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>profil</span>
          </h1>
          <p style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", marginBottom: "2rem" }}>Mets à jour tes informations.</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Infos générales */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1.25rem" }}>Informations générales</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>PRÉNOM</label>
                  <input
                    className="form-input"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAF7F2" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>VILLE</label>
                  <select
                    className="form-input"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAF7F2" }}
                  >
                    {["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"].map((c) => (
                      <option key={c} value={c} style={{ background: "#2D1535" }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Centres d'intérêt */}
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1.25rem" }}>Centres d&apos;intérêt</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {INTERESTS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "9999px",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      border: selectedInterests.includes(tag) ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)",
                      background: selectedInterests.includes(tag) ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)",
                      color: selectedInterests.includes(tag) ? "#E8924A" : "rgba(250,247,242,0.6)",
                    }}
                  >
                    {selectedInterests.includes(tag) ? `✓ ${tag}` : tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" }}
            >
              Enregistrer les modifications →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
