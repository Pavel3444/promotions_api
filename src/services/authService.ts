import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET } from '../config';

const prisma = new PrismaClient();
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
export const validatePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};
export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};
export const findUserByLogin = async (login: string) => {
  return prisma.admin.findUnique({ where: { login } });
};
export const findUserById = async (userId: number) => {
  return prisma.admin.findUnique({ where: { id: userId } });
};
export const updateRefreshToken = async (
  userId: number,
  refreshToken: string,
) => {
  return prisma.admin.update({
    where: { id: userId },
    data: { refreshToken },
  });
};
