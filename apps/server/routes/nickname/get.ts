import { nicknames } from "@/wss";

export const getNickname = async (req, res) => {
  nicknames.set(req.session.id, req.session.nickname);
  res.status(200).json({ nickname: req.session.nickname });
};
