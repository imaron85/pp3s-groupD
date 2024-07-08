import { sockets } from "@/wss";
import { WsMessage } from "shared-types";

export const get = async (req, res) => {
  console.log("Received request to /game/:code", req.params.code);

  const joinMessage: WsMessage = {
    command: "join",
    payload: req.session.id,
  };

  console.log("Session joining game:", req.session.id);
  const ws = sockets.get(req.session.id);

  console.log("Sockets: ", sockets.keys());
  try {
    ws.subscribe(`game-${req.params.code}`);
    ws.publish(`game-${req.params.code}`, JSON.stringify(joinMessage));
    res.status(200).json({ message: "Joined game" });
  } catch (error) {
    console.error("Error subscribing to game:", error.message);
    res.status(500).json({ error: "Error subscribing to game" });
  }
};
