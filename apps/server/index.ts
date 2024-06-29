import cookieParser from "cookie-parser";
import express, { Express } from "express";
import helmet from "helmet";
import { sessionMiddleware } from "./middleware";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { ServerWebSocket } from "bun";

// TODO: Type extension to the session object
// declare module "express-session" {
//   interface SessionData {
//     nonce: {
//       [key in AuthProvider]?: string;
//     };
//     user?: SessionUser;
//   }
// }

const app: Express = express();
const port = process.env.EXPRESS_PORT ?? "3001";

app.use(
  cors({
    origin: [process.env.APP_DOMAIN ?? "http://localhost:3001"],
    credentials: true,
  })
);

// set defaults
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(helmet());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(sessionMiddleware);

app.get("/ping", (_, res) => res.send("pong"));

const server = http.createServer(app);
server.listen(parseInt(port));

type WebSocketData = {
  sessionId: string;
};

const sockets = new Map<string, ServerWebSocket<WebSocketData>>();

Bun.serve<WebSocketData>({
  port: 3002,
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (
      server.upgrade(req, {
        data: {
          // pass the express sessionId to the WebSocket
          sessionId: cookieParser.signedCookie(
            req.headers.get("Cookie"),
            process.env.COOKIE_SECRET
          ),
        },
      })
    ) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
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
    drain(ws) {},
  }, // handlers
});
