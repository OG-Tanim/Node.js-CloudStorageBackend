import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  {
    statusCode = 200,
    message = 'Success',
    data,
  }: { statusCode?: number; message?: string; data?: T },
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
