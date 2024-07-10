import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { QuizSchema } from "shared-types"; // Ensure the path is correct
import { QuizModel } from "@/connectors/mongodb";

const quizRouter = express.Router();

quizRouter.post("/create", async (req: Request, res: Response) => {
  console.log("Received request to /create", req.body);
  const { title, questions, author, description } = req.body;

  try {
    console.log("Validating quiz data...");
    const validatedQuiz = QuizSchema.parse({
      title,
      questions,
      description,
      _id: uuidv4(),
      author: author || "placeholder-author",
    });
    console.log("Quiz data validated:", validatedQuiz);

    console.log("Saving new quiz to the database...");
    const newQuiz = new QuizModel(validatedQuiz);
    await newQuiz.save();
    console.log("Quiz saved successfully:", newQuiz);

    return res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    console.error("Error in creating quiz:", error);
    return res
      .status(400)
      .json({ error: "Invalid quiz data or failed to save" });
  }
});

quizRouter.get("/test", (req: Request, res: Response) => {
  console.log("shared-types import works");
  res.status(200).json({ message: "Endpoint is working" });
});

quizRouter.get("/quizzes", async (req: Request, res: Response) => {
  console.log("Received request to /quizzes");
  try {
    const quizzes = await QuizModel.find();
    console.log("Fetched quizzes successfully:", quizzes);
    return res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

quizRouter.get("/quiz", async (req: Request, res: Response) => {
  console.log("Received request to /quiz with query:", req.query);

  const { _id, title, author, createdAt } = req.query;
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
    console.log("Fetched quiz successfully:", quiz);
    return res.status(200).json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

export default quizRouter;
