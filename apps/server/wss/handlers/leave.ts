import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage } from "shared-types";

export const leaveHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg: WsMessage
) => {
  const leaveMessage: WsMessage = {
    command: "leave",
    payload: ws.data.sessionId,
  };
  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(leaveMessage));
  ws.unsubscribe(`game-${ws.data.gameCode!}`);
  ws.data.gameSubscription?.unsubscribe();
  games.removePlayer(ws.data.gameCode, ws.data.sessionId);
  delete ws.data.gameCode;
};
