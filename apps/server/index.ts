import express, { Express, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import quizRouter from "./routes/Quiz/put"; // Ensure this path is correct
import { connectDB } from "./connectors/mongodb";
import http from "http";
import { wss } from "./wss";
import { sessionMiddleware } from "./middleware";

const app: Express = express();
const port = process.env.EXPRESS_PORT ?? "3001";

connectDB().catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(
  cors({
    origin: process.env.APP_DOMAIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessionMiddleware);

app.get("/ping", (_, res) => res.send("pong"));
app.use("/quiz", quizRouter); // Ensure this line is correct and the router is registered

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = http.createServer(app);

console.log(`Attempting to start server on port ${port}`);

console.log("WSS port:", wss.port);

server.listen(parseInt(port), () =>
  console.log(`Server running on port ${port}`)
);
