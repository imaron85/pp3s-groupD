import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";
import { leaderboardHandler } from "./leaderboard";

export const nextHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage
) => {
  const game = games.get(ws.data.gameCode!)!;

  if (ws.data.sessionId !== game.owner) return;

  const nextQuestion: WsQuestion = {
    question: {
      ...game.quiz.questions[game.currentQuestion + 1],
      choices: game.quiz.questions[game.currentQuestion + 1].choices.map(
        (choice) => ({ ...choice, isCorrect: undefined })
      ),
    },
    endTime: new Date(Date.now() + 30000),
  };
  const nextQuestionMessage: WsMessage = {
    command: "question",
    payload: nextQuestion,
  };

  games.modify(ws.data.gameCode!, {
    currentQuestion: game.currentQuestion + 1,
    // Allow half answers to be half a second late to account for network delays
    endTime: new Date(Date.now() + 30500),
  });

  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(nextQuestionMessage));
  ws.send(JSON.stringify(nextQuestionMessage));

  if (!ws.data.timer)
    ws.data.timer = setTimeout(() => {
      leaderboardHandler(ws);
    }, 30000);
};
