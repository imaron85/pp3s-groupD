import mongoose, { connect, connection, Schema, model } from "mongoose";
import dotenv from "dotenv";
import { Quiz as QuizType } from "shared-types";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/quizapp";
const db = mongoose.connection;
const connectDB = async () => {
  let attempts = 0;
  while (attempts < 5) {
    try {
      await connect(MONGO_URI, {});
      console.log("MongoDB connected");
      break;
    } catch (error) {
      attempts++;
      console.error("MongoDB connection error:", error);
      console.log(`Attempting to reconnect... (${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
  if (attempts >= 5) {
    process.exit(1); // Exit process after repeated failures
  }
};

export { connectDB, db };

const quizSchema = new Schema<QuizType & Document>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [{ type: Object, required: true }],
  author: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const QuizModel = mongoose.model<QuizType & Document>(
  "Quiz",
  quizSchema
);
