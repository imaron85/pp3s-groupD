import express, { Request, Response } from "express";
const router = express.Router();

// GET a specific quiz by ID
router.get("/:id", async (req: Request, res: Response) => {
  res.send("GET a specific quiz by ID");
});
