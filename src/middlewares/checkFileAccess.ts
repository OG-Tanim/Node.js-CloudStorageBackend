import { Request, Response, NextFunction } from 'express';
import File from 'models/File';
import User from 'models/User';
import bcrypt from 'bcryptjs';
import { AuthRequest } from './requireAuth';

export const checkFileAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const fileId = req.params.id;
  const passcode = req.headers['x-file-passcode'] as string;

  const file = await File.findById(fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });

  const isOwner = req.user && file.owner.toString() === req.user._id.toString();
  if (file.isLocked && !isOwner) {
    const owner = await User.findById(file.owner);
    const match = await bcrypt.compare(passcode as string, owner?.filePasscode || '');

    if (!match) {
      return res.status(401).json({ message: 'Unauthorized: Invalid passcode' });
    }
  }

  // Pass file to next handler
  (req as any).file = file;
  next();
};
