"use client";
// WebSocketContext.tsx
import React, {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface WebSocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(
      process.env.WS_URL || "ws://localhost:3001"
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    newSocket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    // Cleanup on component unmount to prevent memory leaks
    return () => {
      if (newSocket) newSocket.close();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for easy access to the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);