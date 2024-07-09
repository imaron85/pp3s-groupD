import { games, gameSubject, nicknames, sockets } from "@/wss";
import { WsMessage } from "shared-types";

export const get = async (req, res) => {
  try {
    console.log("Received request to /game/:code", req.params.code);

    if (!games.has(req.params.code)) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const game = games.get(req.params.code);

    if (
      // Game is not joinable
      game.joinable === false &&
      // And the user is not the owner or already in the game
      !game.owner === req.session.id &&
      !game.players.has(req.session.id)
    ) {
      res.status(403).json({ error: "Game is running" });
      return;
    }

    if (game.owner !== req.session.id)
      games.addPlayer(req.params.code, req.session.id);

    const ws = sockets.get(req.session.id);
    ws.data.gameCode = req.params.code;

    ws.subscribe(`game-${req.params.code}`);

    ws.data.gameSubscription = gameSubject.subscribe({
      next: (newGames) => {
        const newPlayers: WsMessage = {
          command: "players",
          payload: Array.from(newGames.get(ws.data.gameCode).players).map(
            (id) => nicknames.get(id)
          ),
        };

        ws.publish(`game-${req.params.code}`, JSON.stringify(newPlayers));
      },
    });
    res.status(200).json({
      message: "Joined game",
      isOwner: game.owner === req.session.id,
      players: Array.from(game.players).map((id) => nicknames.get(id)),
    });
  } catch (error) {
    console.error("Error subscribing to game:", error.message);
    res.status(500).json({ error: "Error subscribing to game" });
  }
};
