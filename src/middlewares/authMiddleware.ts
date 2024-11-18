import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET} from "../config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'] as string | undefined;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Access denied. No token provided.' });
    return;
  }
  try {
    (req as Request & { user?: JwtPayload | string }).user = jwt.verify(
      token,
      JWT_SECRET,
    ) as JwtPayload | string;
    next();
  } catch {
    res.status(403).send({ message: 'Invalid token' });
  }
};
