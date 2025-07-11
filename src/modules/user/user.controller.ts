import bcrypt from 'bcryptjs';
import { Response, NextFunction } from 'express';
import User from '../../models/User';
import * as UserService from './user.service';
import { sendResponse } from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/requireAuth';

export const updateUsername = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: User not authenticated',
      });
    }
    const result = await UserService.updateUsername(req.user._id.toString(), req.body.username);
    sendResponse(res, {
      statusCode: 200,
      message: 'Username updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: User not authenticated',
      });
    }
    const { oldPassword, newPassword } = req.body;
    await UserService.changePassword(req.user._id.toString(), oldPassword, newPassword);
    sendResponse(res, {
      statusCode: 200,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendResponse(res, {
        statusCode: 401,
        message: 'Unauthorized: User not authenticated',
      });
    }
    await UserService.deleteAccount(req.user._id.toString());
    sendResponse(res, {
      statusCode: 200,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const setFilePasscode = async (req: AuthRequest, res: Response) => {
  const { passcode } = req.body;
  if (!passcode || passcode.length < 4) {
    return res.status(400).json({ message: 'Passcode must be at least 4 characters' });
  }

  const hashed = await bcrypt.hash(passcode, 10);
  await User.findByIdAndUpdate(req.user._id, { filePasscode: hashed });

  sendResponse(res, {
    statusCode: 200,
    message: 'File passcode set successfully',
  });
};
