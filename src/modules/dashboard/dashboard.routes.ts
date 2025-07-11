import express from 'express';
import { requireAuth } from 'middlewares/requireAuth';
import * as dashboard from './dashboard.controller';

const router = express.Router();

//Storage used, each file type's count and accumulated size
router.get('/stats', requireAuth, dashboard.getStatsController);

//Recents
router.get('/recents', requireAuth, dashboard.getRecentsController);

export default router;
