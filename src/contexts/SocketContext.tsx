"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

type SocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveSocketBaseUrl(): string {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (wsUrl) {
    return trimTrailingSlash(wsUrl);
  }

  const socketPort = process.env.NEXT_PUBLIC_SOCKET_PORT?.trim();
  if (socketPort) {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.origin);
      url.port = socketPort;
      return trimTrailingSlash(url.origin);
    }

    return `http://localhost:${socketPort}`;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiUrl) {
    return trimTrailingSlash(apiUrl);
  }

  if (typeof window !== "undefined") {
    return trimTrailingSlash(window.location.origin);
  }

  return "http://localhost:8082";
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const userId = session?.user?.id?.trim();
    if (status !== "authenticated" || !userId) {
      return;
    }

    const socketUrl = `${resolveSocketBaseUrl()}/realtime`;
    const nextSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const handleConnect = () => {
      nextSocket.emit("register-user", { userId });
      setSocket(nextSocket);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocket((prev) => (prev?.id === nextSocket.id ? null : prev));
    };

    nextSocket.on("connect", handleConnect);
    nextSocket.on("disconnect", handleDisconnect);

    return () => {
      nextSocket.disconnect();
      nextSocket.off("connect", handleConnect);
      nextSocket.off("disconnect", handleDisconnect);
    };
  }, [session?.user?.id, status]);

  const value = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}