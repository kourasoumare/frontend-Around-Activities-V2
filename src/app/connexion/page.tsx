"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, loginApi } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Logo } from "@/components/Navbar";

export default function ConnexionPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi(form.email.trim(), form.password);
      if (!data?.token || !data?.user) {
        throw new ApiError("Réponse de connexion invalide côté serveur.", 500, data);
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Connexion réussie !", "success");

      const userInterests = (data.user as any)?.interests;
      const hasInterests = Array.isArray(userInterests) && userInterests.length > 0;
      if (data.user?.is_new_user && !hasInterests) {
        router.push("/onboarding");
      } else {
        router.push("/home");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setError(err.message);
      } else if (err instanceof ApiError && err.status >= 500) {
        setError(`Erreur serveur (${err.status}) : ${err.message}`);
      } else if (err instanceof ApiError) {
        setError(err.message || "Email ou mot de passe incorrect.");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
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
          <h1 className="font-display text-3xl font-bold">Content de te revoir</h1>
          <p className="mt-1 text-sm text-[var(--muted-text)]">Connecte-toi pour retrouver tes activités.</p>

          {error && (
            <div className="mt-4 rounded-xl border border-[var(--destructive)] bg-[rgba(184,74,58,0.06)] p-3 text-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                className="field"
                type="email"
                required
                autoComplete="email"
                placeholder="toi@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-sm font-medium">
                Mot de passe
                <Link href="/mot-de-passe-oublie" className="text-xs font-normal text-[var(--primary)] hover:underline">
                  Mot de passe oublié ?
                </Link>
              </span>
              <input
                className="field"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
            <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted-text)]">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-[var(--primary)] hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
