import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh';
