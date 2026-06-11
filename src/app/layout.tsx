import type { Metadata } from "next";
import "../styles/globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { SocketProvider } from "@/context/SocketContext";

export const metadata: Metadata = {
  title: "Around Activities",
  description: "Trouve des sorties qui te ressemblent et rencontre des personnes facilement.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased" style={{ background: "var(--page)", fontFamily: "var(--font-body)" }}>
        <ToastProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
