import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { QuizSchema } from 'shared-types'; // Ensure the path is correct
import { Quiz as QuizType } from 'shared-types';  // Adjust the path if needed
import mongoose, { Schema, Document } from "mongoose";

const quizSchema = new Schema<QuizType & Document>({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Object, required: true }],  // Simplify as necessary
    author: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const QuizModel = mongoose.model<QuizType & Document>('Quiz', quizSchema);
const quizRouter = express.Router();

quizRouter.post("/create", async (req: Request, res: Response) => {
    const { title, questions, author } = req.body; // Assume author is now being sent in the request
    console.error("Eerereererer");

    try {
        // Validate incoming data
        const validatedQuiz = QuizSchema.parse({
            title,
            questions,
            _id: uuidv4(), // Generate a UUID for the quiz
            author: author || "placeholder-author" // Use provided author or a placeholder
        });

        // Create a new quiz document using the validated data
        const newQuiz = new QuizModel(validatedQuiz);
        await newQuiz.save(); // Save the new quiz to the database

        return res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
    } catch (error) {
        console.error("Error in creating quiz:", error);
        return res.status(400).json({ error: "Invalid quiz data or failed to save" });
    }
});

export default quizRouter;
