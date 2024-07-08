"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import GameLoading from "./loading";
import GameError from "./error";
import { useWebSocket } from "../../../src/providers";
import { WsMessage } from "shared-types";
import { backendUrl } from "../../../src/util";

export default function Game({ params: { code } }: any) {
  const ws = useWebSocket();
  const { isPending, error, data } = useQuery({
    queryKey: ["game", code],
    queryFn: async () => {
      if (!ws.socket) {
        throw new Error("WebSocket not connected");
      }
      const response = await fetch(`${backendUrl}/game/${code}`);
      if (!response.ok) {
        throw new Error("Failed to fetch game data");
      }
      return await response.json();
    },
  });

  console.log("Game data:", data);
  console.log("Game error:", error);
  console.log("Game isPending:", isPending);

  const [players, setPlayers] = useState<string[]>([]);

  const listen = (ws: WebSocket, ev: MessageEvent<any>) => {
    const msg = WsMessage.parse(ev.data);

    switch (msg.command) {
      case "join": {
        setPlayers([...players, msg.payload]);
        console.log("Joined");
        break;
      }
      case "leave": {
        console.log("Left");
        break;
      }
      default: {
        console.log("Unknown command:", msg.command);
        break;
      }
    }
  };

  useEffect(() => {
    if (!error) {
      const joinMessage: WsMessage = {
        command: "join",
        payload: code,
      };

      ws.socket?.addEventListener("message", (ev: MessageEvent<any>) =>
        listen(ws.socket!, ev)
      );

      ws.socket?.send(JSON.stringify(joinMessage));

      return () => {
        ws.socket?.removeEventListener("message", (ev: MessageEvent<any>) =>
          listen(ws.socket!, ev)
        );
      };
    }
  }, [isPending, error, data]);

  return (
    <>
      {isPending ? <GameLoading /> : ""}
      {error ? <GameError /> : ""}
      {data ? <div>Data: {JSON.stringify(data)}</div> : ""}
    </>
  );
}
