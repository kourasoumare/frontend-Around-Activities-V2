"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfileApi, ApiError } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier"];
const LANGUAGES = ["Français", "Anglais", "Arabe", "Bambara", "Espagnol", "Portugais", "Wolof", "Mandarin", "Hindi", "Allemand", "Italien", "Turc"];
const CATEGORIES = [
  { id: "Sport & Fitness",       label: "Sport & Fitness",       color: "#4A8C5E" },
  { id: "Art & Culture",         label: "Art & Culture",         color: "#8E5BA8" },
  { id: "Restaurant & Cuisine",  label: "Restaurant & Cuisine",  color: "#C4603A" },
  { id: "Musique & Événements",  label: "Musique & Événements",  color: "#D4A547" },
  { id: "Bien-être & Détente",   label: "Bien-être & Détente",   color: "#6BA89B" },
  { id: "Tech & Jeux vidéo",     label: "Tech & Jeux vidéo",     color: "#4B6CB7" },
  { id: "Nature & Plein air",    label: "Nature & Plein air",    color: "#6B8E4E" },
  { id: "Rencontres & Chill",    label: "Rencontres & Chill",    color: "#C97A8E" },
];

function OnboardingContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<number>(1);
  const [city, setCity] = useState(CITIES[0]);
  const [langs, setLangs] = useState<string[]>(["Français"]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUserId(u.id);
      if (u.city && CITIES.includes(u.city)) setCity(u.city);
    }
  }, []);

  const pct = ((step + 1) / 3) * 100;
  const canNext = step === 0 ? !!city : step === 1 ? langs.length > 0 : interests.length >= 1;

  async function finish() {
    try {
      const updated = await updateProfileApi(userId, {
        city,
        language: langs.join(", "),
        interests,
      });
      const stored = localStorage.getItem("user");
      if (stored) {
        const current = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...current, ...(updated as object), interests }));
      }
      showToast("Profil configuré !", "success");
      router.push("/home");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        router.push("/home");
      } else {
        showToast("Erreur, mais on continue !", "success");
        router.push("/home");
      }
    }
  }

  function next() {
    if (step < 2) setStep(step + 1);
    else finish();
  }

  return (
    <div className="page-shell radial-profile min-h-screen">
      <div className="doodle-bg" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted-text)]">
            <span>Étape {step + 1} / 3</span>
            <span>{["Ta ville", "Tes langues", "Tes passions"][step]}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(90,60,30,0.1)]">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
          </div>
        </div>

        <div className="glass-card p-8">
          {step === 0 && (
            <>
              <h1 className="font-display text-3xl font-bold">Où vis-tu ?</h1>
              <p className="mt-1 text-sm text-[var(--muted-text)]">On te montrera les activités proches.</p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className="rounded-xl border px-4 py-3 text-sm font-medium transition"
                    style={city === c
                      ? { background: "var(--gradient-primary)", color: "white", borderColor: "transparent", boxShadow: "var(--shadow-warm)" }
                      : { borderColor: "var(--border)", background: "rgba(253,250,246,0.7)" }
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="font-display text-3xl font-bold">Quelles langues parles-tu ?</h1>
              <p className="mt-1 text-sm text-[var(--muted-text)]">Sélectionne toutes celles que tu maîtrises.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {LANGUAGES.map((l) => {
                  const on = langs.includes(l);
                  return (
                    <button
                      key={l}
                      onClick={() => setLangs(on ? langs.filter((x) => x !== l) : [...langs, l])}
                      className={`pill ${on ? "pill-active" : ""}`}
                      style={on ? { background: "var(--gradient-primary)" } : undefined}
                    >
                      {on && <Check className="h-3.5 w-3.5" />} {l}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="font-display text-3xl font-bold">Tes centres d&apos;intérêt</h1>
              <p className="mt-1 text-sm text-[var(--muted-text)]">Choisis ceux qui te correspondent.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((c) => {
                  const on = interests.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setInterests(on ? interests.filter((x) => x !== c.id) : [...interests, c.id])}
                      className="relative rounded-2xl border p-4 text-left transition"
                      style={on
                        ? { background: c.color, borderColor: "transparent", color: "white", boxShadow: "var(--shadow-warm)" }
                        : { borderColor: "var(--border)", background: "rgba(253,250,246,0.7)" }
                      }
                    >
                      <span className="block h-2 w-8 rounded-full" style={{ background: on ? "white" : c.color }} />
                      <span className="mt-2 block text-sm font-semibold">{c.label}</span>
                      {on && <Check className="absolute right-3 top-3 h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-[var(--muted-text)]">{interests.length} sélectionné{interests.length > 1 ? "s" : ""}</p>
            </>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
            <button onClick={next} disabled={!canNext} className="btn-primary">
              {step === 2 ? "Terminer" : "Continuer"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
