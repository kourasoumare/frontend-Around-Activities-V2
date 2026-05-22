"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppNavbar } from "@/components/Navbar";
import { MOCK_USER, INTERESTS } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { updateProfileApi, ApiError } from "@/lib/api";

export default function ModifierProfilPage() {
const router = useRouter();
const { showToast } = useToast();
const user = MOCK_USER;

const [form, setForm] = useState({ firstName: user.firstName, city: user.city });
const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests);
const [loading, setLoading] = useState(false);
const [cityOpen, setCityOpen] = useState(false);
const cities = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"];

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
}

function toggleInterest(tag: string) {
setSelectedInterests((prev) =>
prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
);
}

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setLoading(true);
try {
await updateProfileApi(user.id, { firstName: form.firstName, city: form.city, interests: selectedInterests });
showToast("Profil mis à jour !", "success");
router.push("/profil/1");
} catch (err) {
if (err instanceof ApiError && err.status === 0) {
// Mode démo sans backend
showToast("Profil mis à jour !", "success");
router.push("/profil/1");
} else {
showToast("Erreur lors de la mise à jour.", "error");
}
} finally {
setLoading(false);
}
}

return (
<div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
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
<input className="form-input" name="firstName" value={form.firstName} onChange={handleChange}
style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAF7F2" }} />
</div>
<div>
<label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>VILLE</label>
<div style={{ position: "relative" }}>
<button type="button" onClick={() => setCityOpen(!cityOpen)}
style={{ width: "100%", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", color: "#FAF7F2", fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
{form.city} <span style={{ color: "rgba(250,247,242,0.4)" }}>▾</span>
</button>
{cityOpen && (
<div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1A0A2E", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.75rem", overflow: "hidden", zIndex: 50 }}>
{cities.map((c) => (
<button key={c} type="button" onClick={() => { setForm((prev) => ({ ...prev, city: c })); setCityOpen(false); }}
style={{ width: "100%", padding: "0.75rem 1rem", background: form.city === c ? "rgba(196,96,58,0.20)" : "transparent", color: form.city === c ? "#E8924A" : "rgba(250,247,242,0.7)", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "0.875rem", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
{form.city === c ? "✓ " : ""}{c}
</button>
))}
</div>
)}
</div>
</div>
</div>
</div>

{/* Centres d'intérêt */}
<div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "1.75rem" }}>
<h2 style={{ fontWeight: 600, color: "#FAF7F2", marginBottom: "1.25rem" }}>Centres d&apos;intérêt</h2>
<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
{INTERESTS.map((tag) => (
<button key={tag} type="button" onClick={() => toggleInterest(tag)}
style={{ padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", border: selectedInterests.includes(tag) ? "2px solid #C4603A" : "2px solid rgba(255,255,255,0.12)", background: selectedInterests.includes(tag) ? "rgba(196,96,58,0.20)" : "rgba(255,255,255,0.05)", color: selectedInterests.includes(tag) ? "#E8924A" : "rgba(250,247,242,0.6)" }}>
{selectedInterests.includes(tag) ? `✓ ${tag}` : tag}
</button>
))}
</div>
</div>

<button type="submit" disabled={loading}
style={{ width: "100%", padding: "1rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
{loading ? "Enregistrement..." : "Enregistrer les modifications →"}
</button>
</form>
</div>
</div>
</div>
);
}
