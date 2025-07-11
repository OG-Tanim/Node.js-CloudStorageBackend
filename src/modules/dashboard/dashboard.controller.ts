import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from 'middlewares/requireAuth';
import { getDashboardStats, getRecentFiles } from './dashboard.service';
import { sendResponse } from 'utils/sendResponse';

export const getStatsController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await getDashboardStats(req.user._id);
    sendResponse(res, {
      statusCode: 200,
      message: 'Dashboard stats fetched',
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

export const getRecentsController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const recents = await getRecentFiles(req.user._id);
    sendResponse(res, {
      statusCode: 200,
      message: 'Recent files fetched',
      data: recents,
    });
  } catch (err) {
    next(err);
  }
};
