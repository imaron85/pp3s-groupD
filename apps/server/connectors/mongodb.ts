import { connect, connection, Schema, model } from 'mongoose';
import { Quiz, Question, Choice, UserAnswer, Game } from 'shared-types'; // Assume these types are exported from your zod schema files
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

const connectDB = async () => {
  try {
    await connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define Mongoose schemas
const choiceSchema = new Schema<Choice>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  imageUrl: { type: String },
}, { _id: true, strict: true });

const questionSchema = new Schema<Question>({
  questionText: { type: String, required: true },
  choices: { type: [choiceSchema], required: true },
  imageUrl: { type: String },
}, { _id: true, strict: true });

const quizSchema = new Schema<Quiz>({
  title: { type: String, required: true },
  description: { type: String },
  questions: { type: [questionSchema], required: true },
  author: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { _id: true, strict: true });

const userAnswerSchema = new Schema<UserAnswer>({
  userId: { type: String, required: true },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedChoice: { type: Schema.Types.ObjectId, ref: 'Choice', required: true },
  }],
}, { _id: true, strict: true });

const gameSchema = new Schema<Game>({
  quiz: { type: quizSchema, required: true },
  userAnswers: { type: [userAnswerSchema], required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
}, { _id: true, strict: true });

// Create Mongoose models
const ChoiceModel = model<Choice>('Choice', choiceSchema);
const QuestionModel = model<Question>('Question', questionSchema);
const QuizModel = model<Quiz>('Quiz', quizSchema);
const UserAnswerModel = model<UserAnswer>('UserAnswer', userAnswerSchema);
const GameModel = model<Game>('Game', gameSchema);

// Export connection and models
export { connectDB, ChoiceModel, QuestionModel, QuizModel, UserAnswerModel, GameModel };
