import express, { Request, Response } from "express";
import { quizRouter } from "./";
import { Quiz, QuizSchema } from "shared-types";

quizRouter.post("/create", (req: Request, res: Response) => {
  // Extract the quiz data from the request body
  const { title, questions } = req.body;

  let quiz: Quiz;
  try {
    quiz = QuizSchema.parse({
      // TODO: make complete
      title: title,
      questions: questions,
      // author: attach nickname to session id => use that
      _id: uuid.v4(),
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid quiz data" });
  }

  // TODO: replace by actual long lasting db connection object
  db.quiz.insertOne(quiz).catch((error) => {
    console.error("Error saving quiz to database:", error);
    res.status(500).json({ error: "Error saving quiz to database" });
  });

  // Return a success response
  return res.status(201).json({ message: "Quiz created successfully" });
});
