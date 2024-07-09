"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import GameLoading from "./loading";
import GameError from "./error";
import { useWebSocket } from "../../../src/providers";
import { Question, WsMessage } from "shared-types";
import { backendUrl } from "../../../src/util";
import axios, { AxiosError } from "axios";
import GameWaiting from "./waiting";
import GamePlaying from "./playing";

export type GameState =
  | "loading"
  | "waiting"
  | "error"
  | "game"
  | "leaderboard";

export default function Game({ params: { code } }: any) {
  const ws = useWebSocket();
  const { isPending, error, data } = useQuery({
    retry: (failureCount, error: AxiosError) => {
      // Do not retry if the game does not exist or is running
      if (error.response?.status === 404 || error.response?.status === 403) {
        return false;
      }
      return failureCount <= 5; // Retry up to 5 times
    },
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
  const [currentQuestion, setCurrentQuestion] = useState<Question>();

  const listen = (ws: WebSocket, ev: MessageEvent<any>) => {
    const msg = WsMessage.parse(JSON.parse(ev.data));
    console.log("2Message from server ", msg);
    switch (msg.command) {
      case "players": {
        setPlayers(msg.payload);
        console.log("Joined");
        break;
      }
      case "start": {
        setGameState("game");
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
      {error ? <GameError error={error} /> : ""}
      {data ? (
        <>
          {gameState === "waiting" ? (
            <GameWaiting
              code={code}
              players={players}
              isOwner={data.isOwner}
              ws={ws}
              setGameState={setGameState}
            />
          ) : (
            ""
          )}
          {gameState === "game" ? (
            <GamePlaying
              endTime={new Date()}
              question=""
              answers={[]}
              onAnswer={(answer) => {}}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
}
