"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getFriendRequestsApi } from "@/lib/api";
import { FriendRequest } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface SocketContextValue {
  socket: Socket | null;
  pendingRequests: FriendRequest[];
  removePendingRequest: (id: number) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  pendingRequests: [],
  removePendingRequest: () => {},
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const pathname = usePathname();

  // Helper pour parser la réponse quelle que soit sa forme
  function parseRequests(reqs: unknown): FriendRequest[] {
    if (Array.isArray(reqs)) return reqs as FriendRequest[];
    const raw = reqs as Record<string, unknown>;
    if (Array.isArray(raw?.requests)) return raw.requests as FriendRequest[];
    if (Array.isArray(raw?.data)) return raw.data as FriendRequest[];
    return [];
  }

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setPendingRequests([]);
      }
      return;
    }

    // Re-fetch les demandes à chaque navigation
    getFriendRequestsApi()
      .then((reqs) => {
        setPendingRequests(parseRequests(reqs));
      })
      .catch(() => {});

    if (socketRef.current) return;

    const s = io(BASE_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = s;
    setSocket(s);

    s.on("friend_request", () => {
      getFriendRequestsApi()
        .then((reqs) => {
          setPendingRequests(parseRequests(reqs));
        })
        .catch(() => {});
    });

    s.on("disconnect", () => {
      socketRef.current = null;
      setSocket(null);
    });
  }, [pathname]);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  function removePendingRequest(id: number) {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <SocketContext.Provider value={{ socket, pendingRequests, removePendingRequest }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}