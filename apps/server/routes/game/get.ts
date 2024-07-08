import { games, gameSubject, nicknames, sockets } from "@/wss";
import { WsMessage } from "shared-types";

export const get = async (req, res) => {
  try {
    console.log("Received request to /game/:code", req.params.code);

    if (!games.has(req.params.code)) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    games.addPlayer(req.params.code, req.session.id);

    console.log("Session joining game:", req.session.id);
    const ws = sockets.get(req.session.id);
    ws.data.gameCode = req.params.code;

    ws.subscribe(`game-${req.params.code}`);

    ws.data.gameSubscription = gameSubject.subscribe({
      next: (newGames) => {
        console.log("New games:", newGames);
        const newPlayers: WsMessage = {
          command: "players",
          payload: Array.from(newGames.get(req.params.code).players).map((id) =>
            nicknames.get(id)
          ),
        };

        ws.publish(`game-${req.params.code}`, JSON.stringify(newPlayers));
      },
    });
    res.status(200).json({
      message: "Joined game",
      players: Array.from(games.get(req.params.code).players).map((id) =>
        nicknames.get(id)
      ),
    });
  } catch (error) {
    console.error("Error subscribing to game:", error.message);
    res.status(500).json({ error: "Error subscribing to game" });
  }
};
