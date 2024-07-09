import { z } from "zod";

export const Game = z.object({
  gameCode: z.string(),
  owner: z.string(),
  joinable: z.boolean(),
  players: z.set(z.string()),
});

export type Game = z.infer<typeof Game>;
