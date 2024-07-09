import { redisClient, redisPrefix } from "@/connectors";
import { ServerWebSocket } from "bun";
import cookieParser from "cookie-parser";
import { Game, WsMessage } from "shared-types";
import { leaveHandler } from "./handlers";
import { BehaviorSubject, Subscription } from "rxjs";

export type WebSocketData = {
  sessionId: string;
  gameCode?: string;
  gameSubscription?: Subscription;
};

export const sockets = new Map<string, ServerWebSocket<WebSocketData>>();
export const nicknames = new Map<string, string>();
// export const games = new Map<string, Game>();
export const gameSubject = new BehaviorSubject<Map<string, Game>>(new Map());

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
    tmp.get(key)?.players.add(player);
    gameSubject.next(tmp);
  },
  removePlayer(key: string, player: string) {
    const tmp = new Map(gameSubject.value);
    tmp.get(key)?.players.delete(player);
    gameSubject.next(tmp);
  },
};

// TODO: Remove when game creation is implemented
games.set("123", {
  gameCode: "123",
  players: new Set(),
  joinable: true,
  owner: "593fde15-c1de-4ca5-b043-e2c1b244eff9",
});

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
    }, // a socket is opened
    close(ws, code, message) {
      console.log("Closing socket:", ws.data.sessionId);
      ws.data.gameSubscription?.unsubscribe();

      if (ws.data.gameCode) {
        games.removePlayer(ws.data.gameCode, ws.data.sessionId);
      }
      sockets.delete(ws.data.sessionId);
    }, // a socket is closed
  }, // handlers
});
