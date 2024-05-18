import cookieParser from "cookie-parser";
import express, { Express } from "express";
import helmet from "helmet";
import { sessionMiddleware } from "./middleware";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";

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
const port = process.env.EXPRESS_PORT ?? 3000;

app.use(
  cors({
    origin: [process.env.APP_DOMAIN ?? "http://localhost:3000"],
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
