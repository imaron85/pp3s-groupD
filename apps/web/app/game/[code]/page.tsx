"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import GameLoading from "./loading";
import GameError from "./error";
import { useWebSocket } from "../../../src/providers";
import { WsMessage } from "shared-types";
import { backendUrl } from "../../../src/util";
import axios from "axios";
import GameWaiting from "./waiting";

type GameState = "loading" | "waiting" | "error" | "game";

export default function Game({ params: { code } }: any) {
  const ws = useWebSocket();
  const { isPending, error, data } = useQuery({
    queryKey: ["game", code],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/game/${code}`, {
        withCredentials: true,
      });
      setPlayers(response.data.players);
      return response.data;
    },
    enabled: !!ws.socket,
  });

  const [gameState, setGameState] = useState<GameState>("loading");
  const [players, setPlayers] = useState<string[]>([]);

  const listen = (ws: WebSocket, ev: MessageEvent<any>) => {
    const msg = WsMessage.parse(JSON.parse(ev.data));
    console.log("2Message from server ", msg);
    switch (msg.command) {
      case "players": {
        setPlayers(msg.payload);
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
    if (ws.socket) {
      ws.socket.onmessage = (event) => {
        console.log("1Message from server ", event.data);
        listen(ws.socket!, event);
      };

      setGameState("waiting");
    }
    if (error) {
      setGameState("error");
    }
  }, [isPending, error, data, ws.socket]);

  return (
    <>
      {isPending ? <GameLoading /> : ""}
      {error ? <GameError /> : ""}
      {data ? (
        gameState === "waiting" ? (
          <GameWaiting
            code={code}
            players={players}
            isOwner={data.isOwner}
            ws={ws}
          />
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </>
  );
}
