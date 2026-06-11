"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, MessageCircle, UserPlus, X } from "lucide-react";
import { PageShell, Avatar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { acceptFriendRequestApi, getFriendRequestsApi, refuseFriendRequestApi } from "@/lib/api";
import { FriendRequest } from "@/lib/data";
import { useSocketContext } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";

function parseRequests(reqs: unknown): FriendRequest[] {
  if (Array.isArray(reqs)) return reqs as FriendRequest[];
  const raw = reqs as Record<string, unknown>;
  if (Array.isArray(raw?.requests)) return raw.requests as FriendRequest[];
  if (Array.isArray(raw?.data)) return raw.data as FriendRequest[];
  return [];
}

function DemandesAmiContent() {
  const { pendingRequests, removePendingRequest } = useSocketContext();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<FriendRequest[]>(pendingRequests);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    setRequests(pendingRequests);
  }, [pendingRequests]);

  useEffect(() => {
    getFriendRequestsApi()
      .then((raw) => setRequests(parseRequests(raw)))
      .catch(() => setRequests(pendingRequests))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function accept(requestId: number) {
    setBusyId(requestId);
    try {
      await acceptFriendRequestApi(requestId);
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      removePendingRequest(requestId);
      showToast("Demande acceptée.", "success");
    } catch {
      showToast("Impossible d'accepter cette demande.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function refuse(requestId: number) {
    setBusyId(requestId);
    try {
      await refuseFriendRequestApi(requestId);
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      removePendingRequest(requestId);
      showToast("Demande refusée.", "success");
    } catch {
      showToast("Impossible de refuser cette demande.", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <PageShell variant="profile">
      <div className="mx-auto max-w-4xl px-4 pt-8 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--primary)]">Réseau</p>
            <h1 className="font-display text-4xl font-bold">Demandes d'ami</h1>
            <p className="mt-1 text-[var(--muted-text)]">Accepte ou refuse les invitations reçues.</p>
          </div>
          <Link href="/conversations" className="btn-secondary">
            <MessageCircle className="h-4 w-4" />
            Conversations
          </Link>
        </div>

        <div className="mt-8 space-y-3">
          {loading ? (
            <div className="glass-card p-10 text-center text-sm text-[var(--muted-text)]">Chargement...</div>
          ) : requests.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/80 text-[var(--primary)]">
                <UserPlus className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">Aucune demande en attente</h2>
              <p className="mt-1 text-sm text-[var(--muted-text)]">Les nouvelles demandes apparaîtront ici.</p>
            </div>
          ) : (
            requests.map((request) => {
              const name = `${request.requester?.first_name ?? ""} ${request.requester?.last_name ?? ""}`.trim() || "Utilisateur";
              return (
                <div key={request.id} className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Avatar name={name} size={52} />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-display text-lg font-bold">{name}</h2>
                    <p className="text-sm text-[var(--muted-text)]">Souhaite t'ajouter en ami.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => accept(request.id)}
                      disabled={busyId === request.id}
                      className="btn-primary !px-4 !py-2 text-sm"
                    >
                      <Check className="h-4 w-4" />
                      Accepter
                    </button>
                    <button
                      onClick={() => refuse(request.id)}
                      disabled={busyId === request.id}
                      className="btn-secondary !px-4 !py-2 text-sm"
                    >
                      <X className="h-4 w-4" />
                      Refuser
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default function DemandesAmiPage() {
  return (
    <ProtectedRoute>
      <DemandesAmiContent />
    </ProtectedRoute>
  );
}
