import { redisClient, redisPrefix } from "@/connectors";
import { ServerWebSocket } from "bun";
import cookieParser from "cookie-parser";

export type WebSocketData = {
  sessionId: string;
};

export const sockets = new Map<string, ServerWebSocket<WebSocketData>>();

export const wss = Bun.serve<WebSocketData>({
  port: 3002,
  fetch(req, server) {
    const sessionId = cookieParser.signedCookie(
      req.headers.get("Cookie"),
      process.env.COOKIE_SECRET
    );
    if (!sessionId) {
      return new Response("Unauthorized - No session cookie", { status: 401 });
    }
    redisClient
      .get(redisPrefix + sessionId)
      .then((session) => {
        if (!session) {
          return new Response("Unauthorized - Invalid session", {
            status: 401,
          });
        }
        // upgrade the request to a WebSocket
        if (
          server.upgrade(req, {
            data: {
              // pass the express sessionId to the WebSocket
              sessionId: sessionId,
            },
          })
        ) {
          return; // do not return a Response
        }
        return new Response("Upgrade failed", { status: 500 });
      })
      .catch((err) => {
        console.error("Error fetching session:", err);
        return new Response("Error fetching session", { status: 500 });
      });
  },
  websocket: {
    message(ws, message) {
      console.log(message);
    }, // a message is received
    open(ws) {
      console.log("open");
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
      console.log("close");
      sockets.delete(ws.data.sessionId);
    }, // a socket is closed
  }, // handlers
});
