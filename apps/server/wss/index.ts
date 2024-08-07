import { redisClient, redisPrefix } from "@/connectors";
import { ServerWebSocket } from "bun";
import cookieParser from "cookie-parser";
import { Game, WsMessage } from "shared-types";
import {
  answerHandler,
  leaderboardHandler,
  leaveHandler,
  nextHandler,
  startHandler,
} from "./handlers";
import { BehaviorSubject, Subscription } from "rxjs";

export type WebSocketData = {
  sessionId: string;
  gameCode?: string;
  gameSubscription?: Subscription;
  timer?: Timer;
};

export const sockets = new Map<string, ServerWebSocket<WebSocketData>>();
export const nicknames = new Map<string, string>();
// export const games = new Map<string, Game>();
export const gameSubject = new BehaviorSubject<Map<string, Game>>(new Map());
export const socketMemory = new Map<string, WebSocketData>();

export const games = {
  set(key: string, value: Game) {
    gameSubject.next(new Map(gameSubject.value).set(key, value));
  },
  delete(key: string) {
    const tmp = new Map(gameSubject.value);
    tmp.delete(key);
    gameSubject.next(tmp);
  },
  modify(key: string, changes: Partial<Game>) {
    const tmp = new Map(gameSubject.value);
    tmp.set(key, { ...tmp.get(key), ...changes });
    gameSubject.next(tmp);
  },
  has(key: string) {
    return gameSubject.value.has(key);
  },
  get(key: string) {
    return gameSubject.value.get(key);
  },
  addPlayer(key: string, player: string) {
    const tmp = new Map(gameSubject.value);
    tmp.get(key).players.add(player);
    tmp.get(key).scores[player] = { round: 0, total: 0 };
    gameSubject.next(tmp);
  },
  removePlayer(key: string, player: string) {
    const tmp = new Map(gameSubject.value);
    tmp.get(key)?.players.delete(player);
    delete tmp.get(key)?.scores[player];
    gameSubject.next(tmp);
  },
  nextQuestion(key: string) {
    const tmp = new Map(gameSubject.value);
    tmp.get(key).currentQuestion += 1;
    gameSubject.next(tmp);
  },
  addScore(key: string, player: string, score: number) {
    console.log("Adding score:", score);
    const tmp = new Map(gameSubject.value);
    tmp.get(key).scores[player] = {
      round: score,
      total: tmp.get(key).scores[player].total + Math.max(score, 0),
    };
    gameSubject.next(tmp);
  },
  resetRound(key: string) {
    const tmp = new Map(gameSubject.value);
    const innerTmp = tmp.get(key);
    innerTmp.players.forEach((p) => {
      innerTmp.scores[p] = { ...innerTmp.scores[p], round: 0 };
    });
    gameSubject.next(tmp);
  },
  allAnswered(key: string) {
    return (
      Object.values(gameSubject.value.get(key).scores).find(
        (s) => s.round === 0
      ) === undefined
    );
  },
};

export const wss = Bun.serve<WebSocketData>({
  port: process.env.WS_PORT ?? 3002,
  async fetch(req, server) {
    const sessionId = cookieParser.signedCookie(
      decodeURIComponent(req.headers.get("Cookie")?.split("=")[1]),
      process.env.SESSION_SECRET || "secret"
    );

    if (!sessionId) {
      return new Response("Unauthorized - No session cookie", {
        status: 401,
      });
    }

    const session = await redisClient
      .get(redisPrefix + sessionId)
      .catch((err) => {
        console.error("Error fetching session:", err);
        return new Response("Error fetching session", { status: 500 });
      });

    if (!session) {
      return new Response("Not Acceptable - Invalid session", {
        status: 406,
      });
    }

    if (
      server.upgrade(req, {
        data: {
          // pass the express sessionId to the WebSocket
          sessionId: sessionId,
        },
      })
    ) {
      return;
    }
    return new Response("Error upgrading to WebSocket" + sessionId, {
      status: 500,
    });
  },
  websocket: {
    message(ws, message) {
      console.log(message);
      const msg = WsMessage.parse(JSON.parse(message as string));

      switch (msg.command) {
        case "leave": {
          leaveHandler(ws, msg);
          break;
        }
        case "next": {
          nextHandler(ws, msg);
          break;
        }
        case "start": {
          startHandler(ws, msg);
          break;
        }
        case "answer": {
          answerHandler(ws, msg);
          break;
        }
        case "leaderboard": {
          leaderboardHandler(ws, msg);
          break;
        }
        default: {
          console.log("Unknown command:", msg);
          break;
        }
      }
    }, // a message is received
    open(ws) {
      console.log("Websocket opened, Session ID:", ws.data.sessionId);
      // Check if the sessionId already exists in the sockets map
      // If it does, close the existing socket and replace it with the new one
      if (sockets.has(ws.data.sessionId)) {
        sockets
          .get(ws.data.sessionId)
          ?.close(1000, "Replaced by new connection");
      }
      sockets.set(ws.data.sessionId, ws);

      if (socketMemory.has(ws.data.sessionId)) {
        ws.data = socketMemory.get(ws.data.sessionId)!;
        socketMemory.delete(ws.data.sessionId);
        // re-subscribe to the game
        if (ws.data.gameCode) {
          games.addPlayer(ws.data.gameCode, ws.data.sessionId);
          ws.subscribe(`game-${ws.data.gameCode}`);
        }
      }
    }, // a socket is opened
    close(ws, code, message) {
      // Save the socket data in memory for reconnection because they are in a game
      if (games.has(ws.data.gameCode!))
        socketMemory.set(ws.data.sessionId, ws.data);
      else socketMemory.delete(ws.data.sessionId);

      console.log("Closing socket:", ws.data.sessionId, ws.data.gameCode);
      ws.data.gameSubscription?.unsubscribe();

      if (ws.data.gameCode && games.get(ws.data.gameCode)?.joinable) {
        games.removePlayer(ws.data.gameCode, ws.data.sessionId);
      }
      sockets.delete(ws.data.sessionId);
    }, // a socket is closed
  }, // handlers
});
