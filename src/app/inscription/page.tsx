"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Logo } from "@/components/Navbar";
import { ArrowRight, ArrowLeft } from "lucide-react";

const CITIES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Strasbourg", "Rennes", "Montpellier"];

export default function InscriptionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", city: CITIES[0],
    email: "", password: "", confirmPassword: "",
  });

  const canStep1 = form.firstName.trim() && form.lastName.trim() && form.city;
  const canStep2 = form.email.trim() && form.password.length >= 6 && form.password === form.confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await registerApi(form) as any;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Compte créé avec succès !", "success");
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell radial-home min-h-screen">
      <div className="doodle-bg" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Logo />
          <span className="font-display text-xl font-bold">Around Activities</span>
        </Link>

        <div className="glass-card p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--muted-text)]">
              <span>Étape {step} / 2</span>
              <span>{step === 1 ? "Toi" : "Tes accès"}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(90,60,30,0.1)]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: step === 1 ? "50%" : "100%", background: "var(--gradient-primary)" }}
              />
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold">
            {step === 1 ? "Faisons connaissance" : "Crée tes accès"}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-text)]">
            {step === 1
              ? "Quelques infos pour personnaliser ton expérience."
              : "On garde tout ça bien à l'abri."}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-[var(--destructive)] bg-[rgba(184,74,58,0.06)] p-3 text-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => { e.preventDefault(); if (canStep1) setStep(2); }}
            >
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Prénom</span>
                  <input className="field" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Nom</span>
                  <input className="field" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Ville</span>
                <select className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <button disabled={!canStep1} className="btn-primary w-full !py-3">
                Continuer <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Email</span>
                <input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Mot de passe</span>
                <input className="field" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Confirmation</span>
                <input className="field" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <span className="mt-1 block text-xs text-[var(--destructive)]">Les mots de passe ne correspondent pas.</span>
                )}
              </label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary !py-3">
                  <ArrowLeft className="h-4 w-4" /> Retour
                </button>
                <button disabled={!canStep2 || loading} className="btn-primary flex-1 !py-3">
                  {loading ? "Création…" : "Créer mon compte"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[var(--muted-text)]">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-semibold text-[var(--primary)] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
