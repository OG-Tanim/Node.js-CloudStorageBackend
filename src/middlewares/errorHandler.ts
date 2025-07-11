import { Request, Response, NextFunction } from 'express';
import { env } from 'config/env';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    status,
  });

  res.status(status).json({
    success: false,
    message,
    stack: env.nodeEnv === 'development' ? err.stack : undefined,
  });
};
