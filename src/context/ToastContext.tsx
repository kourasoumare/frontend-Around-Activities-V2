"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.875rem 1.25rem",
              borderRadius: "0.75rem",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              animation: "slideInRight 0.3s ease",
              background: toast.type === "success" ? "rgba(34,197,94,0.95)" : "rgba(239,68,68,0.95)",
              border: toast.type === "success" ? "1px solid rgba(34,197,94,1)" : "1px solid rgba(239,68,68,1)",
              color: "white",
              fontSize: "0.875rem", fontWeight: 500,
              minWidth: "280px",
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: "white",
              display: "inline-block",
            }} />
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}