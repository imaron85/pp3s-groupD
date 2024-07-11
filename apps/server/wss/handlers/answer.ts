import { ServerWebSocket } from "bun";
import { games, sockets, WebSocketData } from "..";
import { WsMessage, WsQuestion } from "shared-types";
import { nextHandler } from "./next";
import { leaderboardHandler } from "./leaderboard";

export const answerHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage
) => {
  const game = games.get(ws.data.gameCode!)!;

  console.log("ANSWER FIRED: Debug info:\n GAME:", game);
  console.log("DATA: ", ws.data);
  console.log("MSG: ", msg);

  if (
    game.quiz.questions[game.currentQuestion].choices[msg.payload.answerIndex]
      .isCorrect &&
    new Date() < game.endTime
  ) {
    games.addScore(
      ws.data.gameCode!,
      ws.data.sessionId,
      Math.round((game.endTime.getTime() - new Date().getTime()) / 500) * 10
    );
  } else {
    games.addScore(ws.data.gameCode!, ws.data.sessionId, -100);
  }

  if (games.allAnswered(ws.data.gameCode!)) {
    leaderboardHandler(ws, msg, true);
    clearTimeout(sockets.get(game.owner)?.data.timer);
    delete sockets.get(game.owner)?.data.timer;
  }
};
