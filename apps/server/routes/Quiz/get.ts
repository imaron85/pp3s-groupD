import express, { Request, Response } from "express";
import { QuizModel } from "@/connectors/mongodb";

const quizRouter = express.Router();

quizRouter.get("/quizzes", async (req: Request, res: Response) => {
  console.log("Received request to /quizzes");
  try {
    const quizzes = await QuizModel.find();
    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

quizRouter.get("/quiz", async (req: Request, res: Response) => {
  const { _id, title, author, createdAt } = req.query;
  console.log("Received request to /quiz with query:", req.query);

  const query: any = {};
  if (_id) query._id = _id;
  if (title) query.title = title;
  if (author) query.author = author;
  if (createdAt) query.createdAt = new Date(createdAt as string);

  try {
    const quiz = await QuizModel.findOne(query);
    if (!quiz) {
      console.log("No quiz found matching the criteria:", query);
      return res.status(404).json({ error: "Quiz not found" });
    }
    return res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

quizRouter.get("/test", (req: Request, res: Response) => {
  console.log("shared-types import works");
  res.status(200).json({ message: "Endpoint is working" });
});

export default quizRouter;
