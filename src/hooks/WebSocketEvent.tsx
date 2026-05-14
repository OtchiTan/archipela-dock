import { io, type Socket } from "socket.io-client";
import { useMemo } from "react";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "/events";

function useWebSocketEvent(eventId: number | null): Socket | null {
  return useMemo(() => {
    if (eventId === null) {
      return null;
    }

    const socket = io(socketUrl, {
      query: { eventId: String(eventId) },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    return socket;
  }, [eventId]);
}

export default useWebSocketEvent;
