import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";

export const answerHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage
) => {
  //   const game = games.get(ws.data.gameCode!)!;
  //   if(new Date() > )
  //   ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(nextQuestionMessage));
  //   ws.send(JSON.stringify(nextQuestionMessage));
};
