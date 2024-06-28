import session from "express-session";
import { v4 as uuid } from "uuid";
import { redisStore } from "../connectors/";

console.log(process.env.NODE_ENV);

const sessionOptions = {
  secret: process.env?.SESSION_SECRET || "secret",
  genid: () => {
    return uuid();
  },
  name: "pp3s-session",
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: false,
    maxAge: 1000 * 60 * 60 * 24,
    ...(process.env.NODE_ENV === "production"
      ? {
          domain: process.env.COOKIE_BASE,
          // TODO: Set secure to true when we have HTTPS
          secure: false,
        }
      : {}),
  },
  resave: true,
  saveUninitialized: true,
  store: redisStore,
} as const;

const sessionMiddleware = session(sessionOptions);
export default sessionMiddleware;
