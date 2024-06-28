import * as z from "zod";
import { ObjId } from "./utils";

// Define the Choice schema
export const ChoiceSchema = z
  .object({
    _id: ObjId.optional(),
    text: z.string().min(1), // Choice text should be non-empty
    isCorrect: z.boolean(), // Whether this choice is the correct answer
    imageUrl: z.string().url().optional(), // Optional URL of an image
  })
  .strict();

export type Choice = z.infer<typeof ChoiceSchema>;

// Define the Question schema
export const QuestionSchema = z
  .object({
    _id: ObjId.optional(),
    questionText: z.string().min(1), // Question text should be non-empty
    choices: z.array(ChoiceSchema).min(2), // At least two choices required
    imageUrl: z.string().url().optional(), // Optional URL of an image
  })
  .strict();

export type Question = z.infer<typeof QuestionSchema>;

// Define the Quiz schema
export const QuizSchema = z
  .object({
    _id: ObjId.optional(),
    title: z.string().min(1), // Title should be non-empty
    description: z.string().optional(), // Description is optional
    questions: z.array(QuestionSchema).min(1), // At least one question required
    author: z.string().optional(), // Author information is optional
    createdAt: z
      .date()
      .default(() => new Date())
      .optional(), // Creation date with default
  })
  .strict();

export type Quiz = z.infer<typeof QuizSchema>;
