import express, { Request } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { JwtPayload } from 'jsonwebtoken';
import {notFoundMiddleware} from "../middlewares/notFoundMiddleware";

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  const user = (req as Request & { user?: string | JwtPayload }).user;
  res.status(200).send({ message: 'This is protected content', user });
});
router.use(notFoundMiddleware('/content'));


export default router;
