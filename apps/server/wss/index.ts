import { redisClient, redisPrefix } from "@/connectors";
import { ServerWebSocket } from "bun";
import cookieParser from "cookie-parser";

export type WebSocketData = {
  sessionId: string;
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
      req.headers.get("Cookie"),
      process.env.COOKIE_SECRET
    );

    if (!sessionId) {
      return new Response("Unauthorized - No session cookie", {
        status: 401,
      });
    }

    const session = await redisClient.get(redisPrefix + sessionId);

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
    return new Response("Error fetching session", { status: 500 });
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
