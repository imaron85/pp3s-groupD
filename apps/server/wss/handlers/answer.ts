import { ServerWebSocket } from "bun";
import { games, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";
import { nextHandler } from "./next";
import { leaderboardHandler } from "./leaderboard";

export const answerHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage
) => {
  console.log("Answer received:", msg);

  const game = games.get(ws.data.gameCode!)!;
  console.log("Game:", game.currentQuestion);

  // TODO: Ignore answer if too late

  if (
    game.quiz.questions[game.currentQuestion].choices[msg.payload.answerIndex]
      .isCorrect
  ) {
    games.addScore(ws.data.gameCode!, ws.data.sessionId, 100);
  } else {
    games.addScore(ws.data.gameCode!, ws.data.sessionId, -100);
  }

  if (games.allAnswered(ws.data.gameCode!)) {
    games.resetRound(ws.data.gameCode!);
    leaderboardHandler(ws, msg, true);
  }
};
