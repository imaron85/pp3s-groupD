import { games, gameSubject, nicknames, sockets } from "@/wss";
import { Game, WsMessage } from "shared-types";
import { Quiz as QuizType } from "shared-types";
import mongoose, { Schema, Document } from "mongoose";
import { QuizModel } from "@/connectors/mongodb";

export const put = async (req, res) => {
  try {
    const ws = sockets.get(req.session.id);

    const newGame: Game = {
      gameCode: [0, 0, 0, 0, 0, 0]
        .map(() => Math.floor(Math.random() * 10))
        .join(""),
      owner: req.session.id,
      joinable: true,
      players: new Set(),
      quiz: await QuizModel.findOne({ _id: req.body.quizId }),
    };

    games.set(newGame.gameCode, newGame);
    res.status(201).json({ message: "Game created", game: newGame });

    //     ws.data.gameCode = req.params.code;

    //     ws.subscribe(`game-${req.params.code}`);

    //     ws.data.gameSubscription = gameSubject.subscribe({
    //       next: (newGames) => {
    //         const newPlayers: WsMessage = {
    //           command: "players",
    //           payload: Array.from(newGames.get(req.params.code).players).map((id) =>
    //             nicknames.get(id)
    //           ),
    //         };

    //         ws.publish(`game-${req.params.code}`, JSON.stringify(newPlayers));
    //       },
    //     });
    //     res.status(200).json({
    //       message: "Joined game",
    //       isOwner: games.get(req.params.code).owner === req.session.id,
    //       players: Array.from(games.get(req.params.code).players).map((id) =>
    //         nicknames.get(id)
    //       ),
    //     });
  } catch (error) {
    console.error("Error creating game:", error.message);
    res.status(500).json({ error: "Error creating game" });
  }
};
