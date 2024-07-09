import { z } from "zod";
import { QuestionSchema } from "./schemas";

export const WsMessage = z.object({
  command: z.enum([
    "join",
    "leave",
    "message",
    "players",
    "start",
    "next",
    "question",
    "answer",
    "leaderboard",
  ]),
  timestamp: z.date().optional(),
  payload: z.any(),
});

export type WsMessage = z.infer<typeof WsMessage>;

export const WsQuestion = z.object({
  question: QuestionSchema,
  endTime: z.date(),
});

export type WsQuestion = z.infer<typeof WsQuestion>;
