import { z } from "zod";

export const WsMessage = z.object({
  command: z.enum(["join", "leave", "message", "players"]),
  timestamp: z.date().optional(),
  payload: z.any(),
});

export type WsMessage = z.infer<typeof WsMessage>;
