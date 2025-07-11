import { Request, Response, NextFunction } from 'express';

export const validateStaticPageKey = (req: Request, res: Response, next: NextFunction) => {
  const allowedKeys = ['about', 'privacy', 'terms'];
  const { key } = req.params;

  if (!allowedKeys.includes(key)) {
    return res.status(404).json({ message: 'Static page not found.' });
  }

  next();
};
