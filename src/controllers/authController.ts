import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { REFRESH_SECRET } from '../config';
import {
  findUserById,
  findUserByLogin,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  updateRefreshToken,
  validatePassword,
} from '../services/authService';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(400).send({ message: 'Login and password are required' });
    return;
  }
  try {
    const existingUser = await findUserByLogin(login);
    if (existingUser) {
      res.status(400).send({ message: 'Login already in use' });
      return;
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.admin.create({
      data: {
        login,
        password: hashedPassword,
      },
    });
    res
      .status(201)
      .send({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;
  if (!login || !password) {
    res.status(400).send({ message: 'Login and password are required' });
    return;
  }
  try {
    const existingUser = await findUserByLogin(login);
    if (!existingUser) {
      res.status(400).send({ message: 'User not found' });
      return;
    }
    const isPasswordValid = await validatePassword(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      res.status(400).send({ message: 'Password incorrect' });
      return;
    }
    const accessToken = generateAccessToken(existingUser.id);
    const refreshToken = generateRefreshToken(existingUser.id);
    await updateRefreshToken(existingUser.id, refreshToken);

    res
      .status(200)
      .send({ message: 'User login successfully', accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).send({ message: 'Refresh token is required' });
    return;
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: number;
    };
    const existingUser = await findUserById(decoded.userId);

    if (!existingUser || existingUser.refreshToken !== refreshToken) {
      res.status(403).send({ message: 'Invalid refresh token' });
      return;
    }
    const accessToken = generateAccessToken(existingUser.id);
    res.status(200).send({ accessToken: accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).send({ message: 'Invalid or expired refresh token' });
  }
};
