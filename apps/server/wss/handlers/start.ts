import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";
import { nextHandler } from "./next";

export const startHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg: WsMessage
) => {
  const startMessage: WsMessage = {
    command: "start",
    payload: ws.data.gameCode,
  };
  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(startMessage));
  games.modify(ws.data.gameCode!, { joinable: false });

  nextHandler(ws);
};
