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
  games.resetRound(ws.data.gameCode!);

  const leaderboard: WsScores = Object.keys(game.scores).map((player) => ({
    player: nicknames.get(player),
    score: game.scores[player].total,
    roundScore: Math.max(game.scores[player].round, 0),
  }));

  const leaderboardMessage: WsMessage = {
    command: "leaderboard",
    payload: leaderboard,
  };
  ws.publish(`game-${ws.data.gameCode!}`, JSON.stringify(leaderboardMessage));
  ws.send(JSON.stringify(leaderboardMessage));
};
