"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import GameLoading from "./loading";
import GameError from "./error";
import { useWebSocket } from "../../../src/providers";
import { WsMessage } from "shared-types";
import { backendUrl } from "../../../src/util";
import axios from "axios";

export default function Game({ params: { code } }: any) {
  const ws = useWebSocket();
  const { isPending, error, data } = useQuery({
    queryKey: ["game", code],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/game/${code}`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!ws.socket,
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
      ws.socket?.addEventListener("message", (ev: MessageEvent<any>) =>
        listen(ws.socket!, ev)
      );

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
