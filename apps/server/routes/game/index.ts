import { Router } from "express";
import { get } from "./get";
import { put } from "./put";

export const gameRouter = Router();

gameRouter.get("/", (req, res) => {
  console.log("Received request to /game");
});

gameRouter.post("/", put);

gameRouter.get("/:code", get);
