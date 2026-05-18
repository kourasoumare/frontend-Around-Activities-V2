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
    // TODO: PUT /api/users/:id
    router.push("/profil/1");
  }

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-0">
      <AppNavbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/profil/1" className="text-xs text-ink-3 hover:text-ink inline-flex items-center gap-1 mb-8">
          ← Retour au profil
        </Link>

        <h1 className="font-head text-3xl font-black tracking-tight mb-1">
          Modifier mon profil
        </h1>
        <p className="text-ink-3 text-sm mb-8">Mets à jour tes informations.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-ink">Informations générales</h2>
            <div>
              <label className="form-label">Prénom</label>
              <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Ville</label>
              <select className="form-input" name="city" value={form.city} onChange={handleChange}>
                {["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold text-ink mb-4">Centres d&apos;intérêt</h2>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
  selectedInterests.includes(tag)
    ? "border-purple-700 bg-purple-700 text-white scale-105 shadow-md"
    : "border-black bg-white text-black hover:border-purple-700 hover:text-purple-700"
}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center py-4 text-base rounded-2xl">
            Enregistrer les modifications →
          </button>
        </form>
      </div>
    </div>
  );
}
