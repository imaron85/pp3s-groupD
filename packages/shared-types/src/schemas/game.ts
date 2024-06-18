import * as z from "zod";
import { QuizSchema } from "./quiz";
import { ObjId } from "./utils";


// Define the UserAnswer schema
export const UserAnswerSchema = z.object({
  _id: ObjId.optional(),
  userId: z.string(), // User ID should be a string
  answers: z.array(z.object({
    questionId: z.string(), // Reference to the question
    selectedChoice: z.string(), // The selected choice
  })).min(1), // At least one answer is required
}).strict();

export type UserAnswer = z.infer<typeof UserAnswerSchema>;

// Define the Game schema
export const GameSchema = z.object({
    _id: ObjId.optional(),
    quiz: QuizSchema, // Reference to the quiz schema
    userAnswers: z.array(UserAnswerSchema).min(1), // At least one user's answers are required
    startedAt: z.date().default(() => new Date()), // Start date of the game
    endedAt: z.date().optional(), // End date of the game, optional
  }).strict();
  
  export type Game = z.infer<typeof GameSchema>;