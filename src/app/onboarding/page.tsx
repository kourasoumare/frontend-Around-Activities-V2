"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { INTERESTS } from "@/lib/data";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("Paris");
  const [selected, setSelected] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleFinish() {
    if (selected.length < 3) return;
    // TODO: PUT /api/users/:id with city and interests
    router.push("/home");
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-xl">
        {/* Progress bar */}
        <div className="bg-bg-2 rounded-full h-1 mb-10 overflow-hidden">
          <div
            className="bg-tc h-full rounded-full transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {/* Step 1 — City */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="text-xs font-semibold text-tc tracking-widest uppercase mb-2">
              Étape 1 sur 2
            </div>
            <h1 className="font-head text-3xl font-black tracking-tight mb-2">
              Ta ville
            </h1>
            <p className="text-ink-3 text-sm mb-8">
              On personnalise ton expérience selon là où tu es.
            </p>

            <div>
              <label className="form-label">Confirme ta ville</label>
              <select
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille"].map(
                  (c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              className="btn btn-primary w-full justify-center py-3.5 mt-8"
              onClick={() => setStep(2)}
            >
              Continuer →
            </button>
          </div>
        )}

        {/* Step 2 — Interests */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="text-xs font-semibold text-tc tracking-widest uppercase mb-2">
              Étape 2 sur 2
            </div>
            <h1 className="font-head text-3xl font-black tracking-tight mb-2">
              Tes centres d&apos;intérêt
            </h1>
            <p className="text-ink-3 text-sm mb-6">
              Choisis au moins 3 catégories qui te correspondent.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {INTERESTS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
  selected.includes(tag)
    ? "border-purple-700 bg-purple-700 text-white scale-105 shadow-md"
    : "border-black bg-white text-black hover:border-purple-700 hover:text-purple-700"
}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {selected.length >= 3 && (
              <p className="text-sm text-tc font-medium mb-2">
                ✓ Super ! {selected.length} sélectionné{selected.length > 1 ? "s" : ""}.
              </p>
            )}

            <button
              className={`btn w-full justify-center py-3.5 mt-4 ${
                selected.length >= 3 ? "btn-primary" : "btn-secondary opacity-60"
              }`}
              onClick={handleFinish}
              disabled={selected.length < 3}
            >
              Terminer et explorer →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
