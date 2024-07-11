import { WsMessage, WsScores } from "shared-types";
import { WebSocketContextType } from "../../../src/providers";
import { Dispatch, SetStateAction } from "react";
import { GameState } from "./page";
import Link from "next/link";

export const GameLeaderboard = ({
  scores,
  isOwner,
  ws,
  setGameState,
  isFinal,
  nickname,
}: {
  scores: WsScores;
  isOwner: boolean;
  ws: WebSocketContextType;
  setGameState: Dispatch<SetStateAction<GameState>>;
  isFinal: boolean;
  nickname: string;
}) => {
  const top = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  return (
    <div
      id={
        isOwner
          ? ""
          : scores.find((s) => s.player === nickname)?.roundScore !== 0
            ? "correctAnswer"
            : "incorrectAnswer"
      }
      className="w-screen h-screen flex flex-col justify-center items-center"
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow-md">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-bold">
            {isFinal ? "Final Leaderboard" : "Leaderboard"}
          </h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          {scores
            .slice(0, 5)
            .sort((a, b) => b.score - a.score)
            .map((score, index) => (
              <div
                key={score.player + index}
                className="flex items-center justify-between font-medium"
              >
                <div
                  className={`${index < 3 ? "bg-black" : "bg-neutral-400"} text-white rounded-full px-3 py-1 text-sm font-semibold`}
                >
                  {top[index]}
                </div>
                <div className="flex-1 ml-4">{score.player}</div>
                <div>{score.score}</div>
                <div className="text-xs ml-2">+{score.roundScore}</div>
              </div>
            ))}
        </div>
      </div>
      {isOwner && ws.socket && !isFinal ? (
        <button
          onClick={() => {
            const msg: WsMessage = {
              command: "next",
            };
            ws.socket!.send(JSON.stringify(msg));
            setGameState("game");
          }}
          className="w-full max-w-md mt-12 bg-primary text-primary-foreground text-center hover:bg-primary/90 p-2 rounded-xl"
        >
          Next Question
        </button>
      ) : (
        ""
      )}
      {isFinal ? (
        <Link
          href="/"
          className="w-full max-w-md mt-12 bg-primary text-primary-foreground text-center hover:bg-primary/90 p-2 rounded-xl"
        >
          Back to Home
        </Link>
      ) : (
        ""
      )}
    </div>
  );
};
