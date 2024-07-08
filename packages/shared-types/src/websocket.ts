import { z } from "zod";

export const WsMessage = z.object({
  command: z.enum(["join", "leave", "message"]),
  timestamp: z.date().optional(),
  payload: z.string(),
});

export type WsMessage = z.infer<typeof WsMessage>;
