import express from 'express';
import * as UserController from './user.controller';
import { requireAuth } from 'middlewares/requireAuth';

const router = express.Router();

router.patch('/update-username', requireAuth, UserController.updateUsername);

router.patch('/change-password', requireAuth, UserController.changePassword);

router.delete('/delete-account', requireAuth, UserController.deleteAccount);

router.patch('/set-passcode', requireAuth, UserController.setFilePasscode);

export default router;
