import { io } from "socket.io-client";
import { useMemo } from "react";

const socketUrl = import.meta.env.VITE_SOCKET_URL ?? "/events";

function useWebSocketEvent() {
  return useMemo(() => {
    const socket = io(socketUrl, {
      query: { eventId: "1" },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    return socket;
  }, []);
}

export default useWebSocketEvent;
