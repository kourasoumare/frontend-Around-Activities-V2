"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#2D1535" }}>
        <div style={{ color: "rgba(250,247,242,0.4)", fontSize: "0.875rem" }}>
          Vérification en cours...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}