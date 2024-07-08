import { nicknames } from "@/wss";

export const postNickname = async (req, res) => {
  req.session.nickname = req.body.nickname;
  nicknames.set(req.session.id, req.body.nickname);
  console.log("Session nickname:", req.session.nickname);
  res.status(200).end();
};
