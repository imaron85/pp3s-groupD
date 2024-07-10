import { ServerWebSocket } from "bun";
import { games, nicknames, WebSocketData } from "..";
import { WsMessage, WsQuestion, WsScores } from "shared-types";
import { nextHandler } from "./next";

export const leaderboardHandler = (
  ws: ServerWebSocket<WebSocketData>,
  msg?: WsMessage,
  internal?: boolean
) => {
  const game = games.get(ws.data.gameCode!)!;

  if (game.owner !== ws.data.sessionId && !internal) return;

  if (ws.data.timer) clearTimeout(ws.data.timer);
  delete ws.data.timer;

  console.log("Leaderboard:", game.scores);
  const leaderboard: WsScores = Object.keys(game.scores).map((player) => ({
    player: nicknames.get(player),
    score: game.scores[player].total,
    roundScore: Math.max(game.scores[player].round, 0),
  }));

  games.resetRound(ws.data.gameCode!);

  const leaderboardMessage: WsMessage = {
    command: "leaderboard",
    payload: {
      leaderboard: leaderboard,
      isFinal: game.currentQuestion === game.quiz.questions.length - 1,
    },
  };
  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(leaderboardMessage));
  ws.send(JSON.stringify(leaderboardMessage));
};
