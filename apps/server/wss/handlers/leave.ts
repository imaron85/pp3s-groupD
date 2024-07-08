import { ServerWebSocket } from "bun";
import { WebSocketData } from "..";
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
  delete ws.data.gameCode;
};
