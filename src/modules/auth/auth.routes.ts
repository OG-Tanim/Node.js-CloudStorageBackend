import express from 'express';
import passport from 'passport';
import * as AuthController from './auth.controller';
import { generateToken } from '../../utils/jwt';
import { requireAuth } from '../../middlewares/requireAuth';

const router = express.Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.post('/logout', requireAuth, AuthController.logout);
router.get('/profile', requireAuth, AuthController.getCurrentUser);

// Google OAuth routes

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Send back JWT token after successful login
    const user = req.user as any;
    const token = generateToken(user._id.toString());
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  },
);

export default router;
