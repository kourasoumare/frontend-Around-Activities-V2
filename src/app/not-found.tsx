import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
      <div>
        <div className="font-head text-9xl font-black text-tc-light mb-4">404</div>
        <h1 className="font-head text-3xl font-black tracking-tight text-ink mb-3">
          Page introuvable
        </h1>
        <p className="text-ink-3 text-sm mb-8 max-w-xs mx-auto">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn btn-primary btn-lg">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
