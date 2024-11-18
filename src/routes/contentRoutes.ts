import express, { Request } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  const user = (req as Request & { user?: string | JwtPayload }).user;
  res.status(200).send({ message: 'This is protected content', user });
});

export default router;
