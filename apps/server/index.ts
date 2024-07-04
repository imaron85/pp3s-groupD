import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import {quizRouter} from "./routes/Quiz"; // Default export does not need curly braces
import { connectDB } from './connectors/mongodb';
import http from "http";

const app: Express = express();
const port = process.env.EXPRESS_PORT ?? "3001";

connectDB().catch(err => console.error('Failed to connect to MongoDB', err));

app.use(cors({
    origin: process.env.APP_DOMAIN || "http://localhost:3000", // Allow requests from frontend running on port 3000
    credentials: true,
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/quiz", quizRouter); // Define routes before error handling middleware

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = http.createServer(app);
server.listen(parseInt(port), () => console.log(`Server running on port ${port}`));
