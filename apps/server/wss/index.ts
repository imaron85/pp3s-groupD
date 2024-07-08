import { redisClient, redisPrefix } from "@/connectors";
import { ServerWebSocket } from "bun";
import cookieParser from "cookie-parser";
import { WsMessage } from "shared-types";
import { leaveHandler } from "./handlers";

export type WebSocketData = {
  sessionId: string;
  gameCode?: string;
};

export const sockets = new Map<string, ServerWebSocket<WebSocketData>>();

export const wss = Bun.serve<WebSocketData>({
  port: process.env.WS_PORT ?? 3002,
  // async fetch(req, server) {
  //   const sessionId = cookieParser.signedCookie(
  //     req.headers.get("Cookie"),
  //     process.env.COOKIE_SECRET
  //   );
  //   console.log("Session ID:", sessionId);
  //   if (!sessionId) {
  //     return new Response("Unauthorized - No session cookie", { status: 401 });
  //   }
  //   redisClient
  //     .get(redisPrefix + sessionId)
  //     .then((session) => {
  //       if (!session) {
  //         console.log("Session not found");
  //         return new Response("Not Acceptable - Invalid session", {
  //           status: 406,
  //         });
  //       }
  //       console.log("Session found");
  //       // upgrade the request to a WebSocket
  //       if (
  //         server.upgrade(req, {
  //           data: {
  //             // pass the express sessionId to the WebSocket
  //             sessionId: sessionId,
  //           },
  //         })
  //       ) {
  //         console.log("Upgrade successful");
  //         return; // do not return a Response
  //       }
  //       return new Response("Upgrade failed", { status: 500 });
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching session:", err);
  //       //return new Response("Error fetching session", { status: 500 });
  //     });
  // },
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

    console.log("Fetching session:", sessionId);
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
    return new Response("Error upgrading to WebSocket", { status: 500 });
  },
  websocket: {
    message(ws, message) {
      console.log(message);
      const msg = WsMessage.parse(message);

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
      console.log("Websocket closed, Session ID:", ws.data.sessionId);
      sockets.delete(ws.data.sessionId);
    }, // a socket is closed
  }, // handlers
});
