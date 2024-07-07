import express, { Request, Response } from "express";
import { quizRouter } from ".";

// GET all quizes
quizRouter.get("/", (req: Request, res: Response) => {
  res.send("GET all quizes");
});
