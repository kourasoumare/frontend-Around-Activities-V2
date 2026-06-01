"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { Activity } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { createGroupApi, getActivityByIdApi, ApiError } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function CreateGroupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const activityId = searchParams.get("activite");
  const [linkedActivity, setLinkedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (activityId) {
      getActivityByIdApi(Number(activityId)).then((data) => setLinkedActivity(data as Activity)).catch(() => {});
    }
  }, [activityId]);

  const [form, setForm] = useState({ name: "", description: "", city: "Paris", date: "", time: "", location: "", max_members: "", contact_link: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.date || !form.location || !form.max_members) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (Number(form.max_members) < 2) {
      setError("Le groupe doit avoir au minimum 2 participants.");
      return;
    }

    // Combine date + time into ISO string
    const timeStr = form.time || "12:00";
    const meeting_date = new Date(`${form.date}T${timeStr}:00`);
    
    if (isNaN(meeting_date.getTime())) {
      setError("La date est invalide.");
      return;
    }

    setLoading(true);
    try {
      await createGroupApi({
        name: form.name,
        description: form.description,
        activity_id: Number(activityId),
        city: form.city,
        meeting_date: meeting_date.toISOString(),
        location: form.location,
        max_members: Number(form.max_members),
        contact_link: form.contact_link || null,
      });
      showToast("Groupe créé avec succès !", "success");
      router.push("/mes-groupes?tab=created");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        showToast("Groupe créé avec succès !", "success");
        router.push("/mes-groupes?tab=created");
      } else {
        showToast("Erreur lors de la création du groupe.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "0.85rem 1rem",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "0.75rem", color: "#FAF7F2",
    fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
  };
  const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "rgba(250,247,242,0.5)", marginBottom: "0.5rem", letterSpacing: "0.05em" } as const;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href={activityId ? `/activites/${activityId}` : "/home"} style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "2rem" }}>
        ← Retour
      </Link>

      <h1 className="font-head font-black tracking-tight mb-1" style={{ fontSize: "2rem", color: "#FAF7F2" }}>
        Créer un{" "}
        <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>groupe</span>
      </h1>
      <p style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem", marginBottom: "2rem" }}>Organise une sortie et invite des gens à te rejoindre.</p>

      <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "1.5rem", padding: "2rem" }}>
        {linkedActivity && (
          <div style={{ background: "rgba(196,96,58,0.12)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "0.75rem", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#E8924A", marginBottom: "1.75rem" }}>
            🏷️ Catégorie : <strong>{linkedActivity.category}</strong>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={labelStyle}>NOM DU GROUPE *</label>
            <input style={inputStyle} name="name" placeholder="Ex: Aquarellistes du dimanche" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea name="description" rows={3} placeholder="Décris l'ambiance, le niveau requis..." value={form.description} onChange={handleChange} style={{ ...inputStyle, resize: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>DATE *</label>
              <input style={inputStyle} type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>HEURE</label>
              <input style={inputStyle} type="time" name="time" value={form.time} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>LIEU PRÉCIS *</label>
            <input style={inputStyle} name="location" placeholder="Ex: Studio Art, 12 rue de la Paix, Paris 11e" value={form.location} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>VILLE</label>
            <select name="city" value={form.city} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
              {["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"].map((c) => (
                <option key={c} value={c} style={{ background: "#1A0A2E" }}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>NOMBRE MAX DE MEMBRES *</label>
            <input style={inputStyle} type="number" name="max_members" placeholder="8" min="2" value={form.max_members} onChange={handleChange} />
            <p style={{ color: "rgba(250,247,242,0.3)", fontSize: "0.75rem", marginTop: "0.35rem" }}>Minimum 2 participants.</p>
          </div>

          <div>
            <label style={labelStyle}>LIEN DE CONTACT (WhatsApp, Discord…)</label>
            <input style={inputStyle} type="url" name="contact_link" placeholder="https://..." value={form.contact_link} onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: "1rem", background: loading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #C4603A, #E8924A)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 600, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: "0.5rem" }}>
            {loading ? "Création en cours..." : "Créer le groupe →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateGroupPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20 md:pb-0 relative" style={{ background: "#2D1535" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute gradient-animated" style={{ width: "60%", height: "60%", top: "0%", left: "0%", background: "radial-gradient(ellipse, rgba(196,96,58,0.20) 0%, transparent 70%)" }} />
          <div className="absolute gradient-animated" style={{ width: "50%", height: "50%", bottom: "0%", right: "0%", background: "radial-gradient(ellipse, rgba(160,60,180,0.15) 0%, transparent 70%)", animationDelay: "-4s" }} />
        </div>
        <div className="relative z-10">
          <AppNavbar />
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "rgba(250,247,242,0.4)" }}>Chargement...</div>}>
            <CreateGroupForm />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
