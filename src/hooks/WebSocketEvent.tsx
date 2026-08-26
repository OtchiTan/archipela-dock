import { useMemo } from "react";
import { io, type Socket } from "socket.io-client";

function useWebSocketEvent(eventId: number | null): Socket | null {
  return useMemo(() => {
    if (eventId === null) {
      return null;
    }

    const socket = io("api/events", {
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
