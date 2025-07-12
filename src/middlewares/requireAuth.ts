import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User'; // Import IUser
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Token Missing' }); //sample Authorization Header: 'Bearer token123'
  }

  const token = authHeader?.split(' ')[1];

  try {
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, env.jwtSecret!);
    const user = await User.findById((decoded as any).userId).select('-password');

    if (!user) return res.status(401).json({ message: 'Invalid token or user not found' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
