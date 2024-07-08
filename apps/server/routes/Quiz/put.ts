import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { QuizSchema } from 'shared-types'; // Ensure the path is correct
import { Quiz as QuizType } from 'shared-types'; // Ensure the path is correct
import mongoose, { Schema, Document } from "mongoose";

const quizSchema = new Schema<QuizType & Document>({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Object, required: true }],
    author: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const QuizModel = mongoose.model<QuizType & Document>('Quiz', quizSchema);
const quizRouter = express.Router();

quizRouter.post("/create", async (req: Request, res: Response) => {
    console.log("Received request to /create", req.body);
    const { title, questions, author } = req.body;

    try {
        console.log("Validating quiz data...");
        const validatedQuiz = QuizSchema.parse({
            title,
            questions,
            _id: uuidv4(),
            author: author || "placeholder-author"
        });
        console.log("Quiz data validated:", validatedQuiz);

        console.log("Saving new quiz to the database...");
        const newQuiz = new QuizModel(validatedQuiz);
        await newQuiz.save();
        console.log("Quiz saved successfully:", newQuiz);

        return res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
    } catch (error) {
        console.error("Error in creating quiz:", error);
        return res.status(400).json({ error: "Invalid quiz data or failed to save" });
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



export default quizRouter;
