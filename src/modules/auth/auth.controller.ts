import { Request, Response, NextFunction } from 'express';
import * as AuthService from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import { AuthRequest } from '../../middlewares/requireAuth';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const result = await AuthService.signup(username, email, password);
    sendResponse(res, { statusCode: 201, message: 'User registered' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    sendResponse(res, { statusCode: 200, message: 'Login successful', data: result });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    sendResponse(res, { statusCode: 200, message: result.message, data: null });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, newPassword);
    sendResponse(res, { statusCode: 200, message: result.message, data: null });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For purely JWT-based authentication, logout is primarily a client-side action
    // (discarding the JWT). The server simply acknowledges the logout request.
    sendResponse(res, { statusCode: 200, message: 'Logged out successfully', data: null });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    message: 'Current user retrieved',
    data: req.user,
  });
};
