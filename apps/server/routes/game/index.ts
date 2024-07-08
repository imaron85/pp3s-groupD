import { Router } from "express";
import { get } from "./get";

export const gameRouter = Router();

gameRouter.get("/", (req, res) => {
  console.log("Received request to /game");
});

gameRouter.get("/:code", get);
