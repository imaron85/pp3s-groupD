"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import GameLoading from "./loading";
import GameError from "./error";
import { useWebSocket } from "../../../src/providers";
import { Question, QuestionSchema, WsMessage } from "shared-types";
import { backendUrl } from "../../../src/util";
import axios, { AxiosError } from "axios";
import GameWaiting from "./waiting";
import GamePlaying from "./playing";
import { useAnimation } from "framer-motion";

export type GameState =
  | "loading"
  | "waiting"
  | "error"
  | "game"
  | "leaderboard";

export default function Game({ params: { code } }: any) {
  const ws = useWebSocket();
  const controls = useAnimation();

  const [gameState, setGameState] = useState<GameState>("loading");
  const [players, setPlayers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<
    Question & { endTime: Date }
  >();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const calcRemainingTime = (endTime: Date) => {
    const time = Math.floor((endTime.getTime() - Date.now()) / 1000);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const { isPending, error, data } = useQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
    enabled: !!ws.socket && gameState === "waiting",
  });

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
      case "question": {
        setCurrentQuestion({
          endTime: new Date(msg.payload.endTime),
          ...msg.payload.question,
        });
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

  useEffect(() => {
    if (gameState === "game") {
      setTimeRemaining(calcRemainingTime(new Date(currentQuestion?.endTime!)));
      const interval = setInterval(() => {
        setTimeRemaining(
          calcRemainingTime(new Date(currentQuestion?.endTime!))
        );
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [gameState, currentQuestion]);

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
              question={currentQuestion?.questionText || ""}
              answers={
                currentQuestion?.choices?.map((choice) => choice.text) || []
              }
              onAnswer={(answer) => {
                const msg: WsMessage = {
                  command: "answer",
                  payload: {
                    questionId: currentQuestion?._id!,
                    answerId: currentQuestion?.choices![answer]!._id,
                  },
                };
                ws.socket!.send(JSON.stringify(msg));
              }}
              isOwner={data.isOwner}
              remainingTime={timeRemaining}
              controls={controls}
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
