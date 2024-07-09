import { z } from "zod";
import { QuizSchema } from "./schemas";

export const Game = z.object({
  gameCode: z.string(),
  owner: z.string(),
  joinable: z.boolean(),
  players: z.set(z.string()),
  quiz: QuizSchema,
  currentQuestion: z.number(),
  scores: z.record(
    z.object({
      round: z.number(),
      total: z.number(),
    })
  ),
});

export type Game = z.infer<typeof Game>;
