import { games, nicknames, sockets } from "@/wss";
import { WsMessage } from "shared-types";

export const get = async (req, res) => {
  console.log("Received request to /game/:code", req.params.code);

  if (!games.has(req.params.code)) {
    res.status(404).json({ error: "Game not found" });
    return;
  }

  games.get(req.params.code).players.add(req.session.id);
  console.log(games);
  console.log(nicknames);

  const newPlayers: WsMessage = {
    command: "players",
    payload: Array.from(games.get(req.params.code).players).map((id) =>
      nicknames.get(id)
    ),
  };
  console.log(newPlayers);

  console.log("Session joining game:", req.session.id);
  const ws = sockets.get(req.session.id);

  console.log("Sockets: ", sockets.keys());
  try {
    ws.subscribe(`game-${req.params.code}`);
    ws.publish(`game-${req.params.code}`, JSON.stringify(newPlayers));
    res.status(200).json({
      message: "Joined game",
      players: newPlayers.payload,
    });
  } catch (error) {
    console.error("Error subscribing to game:", error.message);
    res.status(500).json({ error: "Error subscribing to game" });
  }
};
