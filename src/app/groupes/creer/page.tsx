"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { AppNavbar } from "@/components/Navbar";
import { Activity } from "@/lib/data";
import { useToast } from "@/context/ToastContext";
import { createGroupApi, getActivitiesApi, getActivityByIdApi, ApiError } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RefreshCw } from "lucide-react";

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const FREQUENCES = [
  { value: "weekly", label: "Chaque semaine" },
  { value: "biweekly", label: "Toutes les 2 semaines" },
  { value: "monthly", label: "Chaque mois" },
];

function CreateGroupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const activityId = searchParams.get("activityId") || searchParams.get("activite");
  const [linkedActivity, setLinkedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState(activityId ?? "");
  const [form, setForm] = useState({
    name: "", description: "", city: "Paris",
    date: "", time: "", location: "", max_members: "",
  });
  const [recurrent, setRecurrent] = useState(false);
  const [frequence, setFrequence] = useState<"weekly" | "biweekly" | "monthly">("weekly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Jour auto-détecté depuis la date choisie (index 0=Dim, 1=Lun...)
  const [jourSelectionne, setJourSelectionne] = useState(1); // Lundi par défaut

  // Mettre à jour le jour quand la date change
  useEffect(() => {
    if (form.date) {
      setJourSelectionne(new Date(form.date + "T12:00:00").getDay());
    }
  }, [form.date]);

  useEffect(() => {
    if (activityId) {
      getActivityByIdApi(Number(activityId))
        .then((data) => {
          setLinkedActivity(data as Activity);
          setSelectedActivityId(String((data as Activity).id));
        })
        .catch(() => {});
    } else {
      getActivitiesApi()
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setActivities(list);
          setSelectedActivityId((current) => current || String(list[0]?.id ?? ""));
        })
        .catch(() => setActivities([]));
    }
  }, [activityId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedActivityId) { setError("Choisis une activité parente pour ce groupe."); return; }
    if (!form.name || !form.date || !form.location || !form.max_members) { setError("Merci de remplir tous les champs obligatoires (*)."); return; }
    if (Number(form.max_members) < 2) { setError("Le groupe doit avoir au minimum 2 participants."); return; }
    const timeStr = form.time || "12:00";
    const meeting_date = new Date(`${form.date}T${timeStr}:00`);
    if (isNaN(meeting_date.getTime())) { setError("La date est invalide."); return; }

    setLoading(true);
    try {
      const group = await createGroupApi({
        name: form.name,
        description: form.description,
        activity_id: Number(selectedActivityId),
        city: form.city,
        meeting_date: meeting_date.toISOString(),
        location: form.location,
        max_members: Number(form.max_members),
        contact_link: null,
        // Données récurrence
        is_recurring: recurrent,
        recurrence_frequency: recurrent ? frequence : null,
        recurrence_count: recurrent ? 52 : null, // 1 an max
      });
      showToast("Groupe créé avec succès !", "success");
      const createdId = typeof group === "object" && group && "id" in group ? (group as { id?: number }).id : undefined;
      router.push(createdId ? `/groupes/${createdId}` : "/mes-groupes?tab=created");
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

  return (
    <div className="wrap" style={{ paddingTop: "2rem", paddingBottom: "4rem", maxWidth: 640 }}>
      <button
        onClick={() => router.back()}
        style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "0.88rem", fontFamily: "var(--font-body)", marginBottom: "1.5rem", padding: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}
      >
        ← Retour
      </button>

      <div style={{ marginBottom: "2rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.4rem" }}>Nouvelle sortie</div>
        <h1 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem,3.5vw,2.5rem)", fontWeight: 900, color: "var(--text)" }}>
          Créer un groupe
        </h1>
        <p style={{ color: "var(--text-3)", fontSize: "0.95rem", marginTop: "0.35rem" }}>
          Organise une sortie et invite des gens à te rejoindre.
        </p>
      </div>

      {linkedActivity && (
        <div style={{ background: "var(--tc-soft)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "var(--r)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.88rem", color: "var(--tc-deep)", marginBottom: "1.5rem", fontWeight: 600 }}>
          Activité : {linkedActivity.title}
        </div>
      )}

      <div className="card card-pad">
        {error && (
          <div style={{ background: "rgba(196,96,58,0.10)", border: "1px solid rgba(196,96,58,0.25)", borderRadius: "var(--r)", padding: "0.75rem 1rem", marginBottom: "1.25rem", color: "var(--tc)", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {!linkedActivity && (
            <div>
              <label className="form-label">ACTIVITÉ PARENTE *</label>
              <select className="form-input" value={selectedActivityId} onChange={(e) => setSelectedActivityId(e.target.value)} style={{ cursor: "pointer" }}>
                {activities.length === 0 && <option value="">Aucune activité disponible</option>}
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>{activity.title}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="form-label">NOM DU GROUPE *</label>
            <input className="form-input" name="name" placeholder="Ex: Foot du dimanche — Vincennes" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <label className="form-label">DESCRIPTION</label>
            <textarea name="description" rows={3} placeholder="Décris l'ambiance, le niveau requis, ce qu'il faut apporter…" value={form.description} onChange={handleChange} className="form-input" style={{ resize: "none" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label className="form-label">DATE *</label>
              <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">HEURE</label>
              <input className="form-input" type="time" name="time" value={form.time} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="form-label">LIEU PRÉCIS *</label>
            <input className="form-input" name="location" placeholder="Ex: Parc de Vincennes, entrée principale" value={form.location} onChange={handleChange} />
            <p style={{ fontSize: "0.75rem", color: "var(--text-4)", marginTop: "0.3rem" }}>L&apos;adresse sera utilisée pour afficher l&apos;itinéraire aux membres.</p>
          </div>

          <div>
            <label className="form-label">NOMBRE MAX DE MEMBRES *</label>
            <input className="form-input" type="number" name="max_members" placeholder="Ex: 10" min="2" max="50" value={form.max_members} onChange={handleChange} />
            <p style={{ fontSize: "0.75rem", color: "var(--text-4)", marginTop: "0.3rem" }}>Minimum 2 participants.</p>
          </div>

          {/* ── Section récurrence ── */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
            {/* Toggle */}
            <button
              type="button"
              onClick={() => setRecurrent(!recurrent)}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: recurrent ? "rgba(196,96,58,0.08)" : "var(--surface-1)",
                border: `1px solid ${recurrent ? "rgba(196,96,58,0.3)" : "var(--border)"}`,
                borderRadius: "var(--r)", padding: "0.875rem 1rem",
                cursor: "pointer", width: "100%", textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <RefreshCw className="h-4 w-4" style={{ color: recurrent ? "var(--tc)" : "var(--text-3)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: recurrent ? "var(--tc-deep)" : "var(--text)", marginBottom: "0.1rem" }}>
                  Sortie récurrente
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                  {recurrent
                    ? `Récurrent — ${FREQUENCES.find(f => f.value === frequence)?.label.toLowerCase()} le ${JOURS[jourSelectionne]}`
                    : "Répéter cette sortie automatiquement"}
                </p>
              </div>
              {/* Toggle pill */}
              <div style={{
                width: 44, height: 24, borderRadius: 12, flexShrink: 0,
                background: recurrent ? "var(--tc)" : "var(--border)",
                position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  position: "absolute", top: 3, left: recurrent ? 23 : 3,
                  width: 18, height: 18, borderRadius: "50%", background: "white",
                  transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </div>
            </button>

            {/* Options récurrence — visibles seulement si activé */}
            {recurrent && (
              <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "1rem", background: "rgba(196,96,58,0.04)", borderRadius: "var(--r)", border: "1px solid rgba(196,96,58,0.12)" }}>

                {/* Select fréquence */}
                <div>
                  <label className="form-label">FRÉQUENCE</label>
                  <select
                    className="form-input"
                    value={frequence}
                    onChange={(e) => setFrequence(e.target.value as typeof frequence)}
                    style={{ cursor: "pointer" }}
                  >
                    {FREQUENCES.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>

                {/* Select jour */}
                <div>
                  <label className="form-label">JOUR</label>
                  <select
                    className="form-input"
                    value={jourSelectionne}
                    onChange={(e) => setJourSelectionne(Number(e.target.value))}
                    style={{ cursor: "pointer" }}
                  >
                    {JOURS.map((jour, i) => (
                      <option key={i} value={i}>{jour}</option>
                    ))}
                  </select>
                </div>

                {/* Récap */}
                <div style={{ gridColumn: "1 / -1", fontSize: "0.82rem", color: "var(--text-2)", padding: "0.5rem 0.75rem", background: "white", borderRadius: 8, border: "1px solid var(--border)" }}>
                  🔁 Récurrent — {FREQUENCES.find(f => f.value === frequence)?.label.toLowerCase()} le <strong>{JOURS[jourSelectionne]}</strong> à <strong>{form.time || "12:00"}</strong>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: "0.5rem" }}>
            {loading ? "Création en cours…" : "Créer le groupe →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateGroupPage() {
  return (
    <ProtectedRoute>
      <div className="page-bg grad-home">
        <div className="page-content">
          <AppNavbar />
          <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)" }}>Chargement…</div>}>
            <CreateGroupForm />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}