import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";

export const nextHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage
) => {
  const game = games.get(ws.data.gameCode!)!;

  const nextQuestion: WsQuestion = {
    question: game.quiz.questions[game.currentQuestion + 1],
    // TODO: Add end time
    endTime: new Date(Date.now() + 30000),
  };
  const nextQuestionMessage: WsMessage = {
    command: "question",
    payload: nextQuestion,
  };
  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(nextQuestionMessage));
  ws.send(JSON.stringify(nextQuestionMessage));
};
