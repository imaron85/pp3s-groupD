import express, { Request, Response } from 'express';

const router = express.Router();

// GET all quizes
router.get('/', (req: Request, res: Response) => {
  res.send('GET all quizes');
});