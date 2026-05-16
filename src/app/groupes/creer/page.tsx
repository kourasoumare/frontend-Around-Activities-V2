"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { AppNavbar } from "@/components/Navbar";
import { ACTIVITIES } from "@/lib/data";

function CreateGroupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activite");
  const linkedActivity = ACTIVITIES.find((a) => a.id === Number(activityId));

  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "Paris",
    date: "",
    time: "",
    location: "",
    maxMembers: "",
    contactLink: "",
  });
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.date || !form.location || !form.maxMembers) {
      setError("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (Number(form.maxMembers) < 2) {
      setError("Le groupe doit avoir au minimum 2 participants.");
      return;
    }
    // TODO: POST /api/activities/:id/groups
    router.push("/mes-groupes");
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href={activityId ? `/activites/${activityId}` : "/home"} className="text-xs text-ink-3 hover:text-ink inline-flex items-center gap-1 mb-8">
        ← Retour
      </Link>

      <h1 className="font-head text-3xl font-black tracking-tight mb-1">
        Créer un groupe
      </h1>
      <p className="text-ink-3 text-sm mb-8">
        Organise une sortie et invite des gens à te rejoindre.
      </p>

      <div className="card">
        {/* Linked activity */}
        {linkedActivity && (
          <div className="bg-tc-light rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-tc-dark mb-8">
            🔗 Activité liée :{" "}
            <strong>{linkedActivity.emoji} {linkedActivity.title}</strong>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Nom du groupe *</label>
            <input
              className="form-input"
              name="name"
              placeholder="Ex: Aquarellistes du dimanche"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input resize-none"
              name="description"
              rows={3}
              placeholder="Décris l'ambiance, le niveau requis, ce qu'il faut apporter..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date *</label>
              <input
                className="form-input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">Heure</label>
              <input
                className="form-input"
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Lieu précis *</label>
            <input
              className="form-input"
              name="location"
              placeholder="Ex: Studio Art, 12 rue de la Paix, Paris 11e"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Ville</label>
            <select className="form-input" name="city" value={form.city} onChange={handleChange}>
              {["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Nombre max de membres *</label>
            <input
              className="form-input"
              type="number"
              name="maxMembers"
              placeholder="8"
              min="2"
              value={form.maxMembers}
              onChange={handleChange}
            />
            <p className="text-xs text-ink-3 mt-1">Minimum 2 participants.</p>
          </div>

          <div>
            <label className="form-label">Lien de contact (WhatsApp, Discord…)</label>
            <input
              className="form-input"
              type="url"
              name="contactLink"
              placeholder="https://..."
              value={form.contactLink}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full justify-center py-4 text-base rounded-2xl mt-2"
          >
            Créer le groupe →
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateGroupPage() {
  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />
      <Suspense fallback={<div className="p-10 text-center text-ink-3">Chargement...</div>}>
        <CreateGroupForm />
      </Suspense>
    </div>
  );
}
