import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";

export const nextHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage
) => {
  const game = games.get(ws.data.gameCode!)!;

  const nextQuestion: WsQuestion = {
    question: {
      ...game.quiz.questions[game.currentQuestion + 1],
      choices: game.quiz.questions[game.currentQuestion + 1].choices.map(
        (choice) => ({ ...choice, isCorrect: undefined })
      ),
    },
    // TODO: Add end time
    endTime: new Date(Date.now() + 30000),
  };
  const nextQuestionMessage: WsMessage = {
    command: "question",
    payload: nextQuestion,
  };

  games.modify(ws.data.gameCode!, {
    currentQuestion: game.currentQuestion + 1,
  });

  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(nextQuestionMessage));
  ws.send(JSON.stringify(nextQuestionMessage));
};
