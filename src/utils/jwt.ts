import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const JWT_SECRET = env.jwtSecret || 'default_secret';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
