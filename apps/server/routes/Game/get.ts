import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";
import { Game as GameType, UserAnswer as UserAnswerType } from 'shared-types';
import { v4 as uuidv4 } from 'uuid';

const userAnswerSchema = new Schema<UserAnswerType & Document>({
    _id: { type: String },
    userId: { type: String, required: true },
    answers: [{ 
        questionId: { type: String, required: true },
        selectedChoice: { type: String, required: true }
    }],
});

const gameSchema = new Schema<GameType & Document>({
    _id: { type: String },
    quiz: { type: Object, required: true },
    userAnswers: { type: [userAnswerSchema], required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
});

const GameModel = mongoose.model<GameType & Document>('Game', gameSchema);
const gameRouter = express.Router();

gameRouter.get("/games", async (req: Request, res: Response) => {
    console.log("Received request to /games");
    try {
        const games = await GameModel.find();
        console.log("Fetched games successfully:", games);
        return res.status(200).json({ games });
    } catch (error) {
        console.error("Error fetching games:", error);
        return res.status(500).json({ error: "Failed to fetch games" });
    }
});

gameRouter.get("/game", async (req: Request, res: Response) => {
    const { _id, quiz, userId, startedAt, endedAt } = req.query;
    console.log("Received request to /game with query:", req.query);
    
    const query: any = {};
    if (_id) query._id = _id;
    if (quiz) query.quiz = quiz;
    if (userId) query['userAnswers.userId'] = userId;
    if (startedAt) query.startedAt = new Date(startedAt as string);
    if (endedAt) query.endedAt = new Date(endedAt as string);

    try {
        const game = await GameModel.findOne(query);
        if (!game) {
            console.log("No game found matching the criteria:", query);
            return res.status(404).json({ error: "Game not found" });
        }
        console.log("Fetched game successfully:", game);
        return res.status(200).json({ game });
    } catch (error) {
        console.error("Error fetching game:", error);
        return res.status(500).json({ error: "Failed to fetch game" });
    }
});

gameRouter.post("/game", async (req: Request, res: Response) => {
    console.log("Received request to create a new game with body:", req.body);
    try {
        const { quiz, userAnswers, startedAt, endedAt } = req.body;

        // Generate a new UUID for the game if not provided
        const _id = uuidv4();

        const newGame = new GameModel({
            _id,
            quiz,
            userAnswers,
            startedAt,
            endedAt,
        });

        await newGame.save();

        console.log("Created new game successfully:", newGame);
        return res.status(201).json({ game: newGame });
    } catch (error) {
        console.error("Error creating game:", error);
        return res.status(500).json({ error: "Failed to create game" });
    }
});

gameRouter.post("/game/:id/answers", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, answers } = req.body;

    console.log(`Received request to submit answers for game ${id} with body:`, req.body);

    try {
        const game = await GameModel.findById(id);

        if (!game) {
            console.log(`No game found with ID: ${id}`);
            return res.status(404).json({ error: "Game not found" });
        }

        const userAnswer = {
            _id: uuidv4(),
            userId,
            answers
        };

        game.userAnswers.push(userAnswer);
        await game.save();

        console.log("Submitted answers successfully:", game);
        return res.status(200).json({ game });
    } catch (error) {
        console.error("Error submitting answers:", error);
        return res.status(500).json({ error: "Failed to submit answers" });
    }
});

gameRouter.patch("/game/:id/answers", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, answers } = req.body;

    console.log(`Received request to update answers for game ${id} with body:`, req.body);

    try {
        const game = await GameModel.findById(id);

        if (!game) {
            console.log(`No game found with ID: ${id}`);
            return res.status(404).json({ error: "Game not found" });
        }

        const userAnswerIndex = game.userAnswers.findIndex(ua => ua.userId === userId);

        if (userAnswerIndex === -1) {
            console.log(`No answers found for user ${userId} in game ${id}`);
            return res.status(404).json({ error: "User answers not found" });
        }

        game.userAnswers[userAnswerIndex].answers = answers;
        await game.save();

        console.log("Updated answers successfully:", game);
        return res.status(200).json({ game });
    } catch (error) {
        console.error("Error updating answers:", error);
        return res.status(500).json({ error: "Failed to update answers" });
    }
});

export default gameRouter;
