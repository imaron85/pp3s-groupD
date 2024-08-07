import { WsMessage } from "shared-types";
import { WebSocketContextType } from "../../../src/providers";
import QRCode from "react-qr-code";
import { Dispatch, SetStateAction } from "react";
import { GameState } from "./page";

export default function GameWaiting({
  code,
  players,
  isOwner,
  ws,
  setGameState,
}: {
  code: string;
  players: string[];
  isOwner: boolean;
  ws: WebSocketContextType;
  setGameState: Dispatch<SetStateAction<GameState>>;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <QRCode value={`https://pp3s.aron.cx/game/${code}`} className="mb-12" />
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-3xl font-bold text-card-foreground">
            Waiting Lobby
          </h1>
          <div className="bg-primary px-6 py-3 rounded-lg text-primary-foreground font-semibold text-2xl">
            {code.match(/.{1,3}/g)?.join(" ")}
          </div>
          <p>Waiting for other players to join...</p>
          <ul className="w-full space-y-4">
            {players?.map((player, index) => (
              <li
                key={player + index}
                className="flex items-center justify-center bg-muted px-4 py-3 rounded-lg"
              >
                {player}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isOwner && ws.socket ? (
        <button
          onClick={() => {
            const msg: WsMessage = {
              command: "start",
              payload: code,
            };
            ws.socket!.send(JSON.stringify(msg));
            setGameState("game");
          }}
          className="w-full max-w-md mt-12 bg-primary text-primary-foreground text-center hover:bg-primary/90 p-2 rounded-xl"
        >
          Start Game
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
