import express, { Request, Response } from 'express';

const router = express.Router();

// PATCH a specific quiz by ID
router.patch('/:id', async (req: Request, res: Response) => {
    res.send('PATCH a specific quiz by ID');
  });