import { Router } from "express";
import { postNickname } from "./post";
import { getNickname } from "./get";

export const nicknameRouter = Router();

nicknameRouter.post("/", postNickname);
nicknameRouter.get("/", getNickname);
