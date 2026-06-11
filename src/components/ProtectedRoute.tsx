"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Navbar";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/connexion");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="page-shell radial-home" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="doodle-bg" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <Logo />
          <p style={{ color: "var(--muted-text)", fontSize: "0.82rem", fontFamily: "var(--font-sans)" }}>
            Vérification en cours…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
