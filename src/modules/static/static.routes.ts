import express from 'express';
import { validateStaticPageKey } from '../../middlewares/validateStaticPageKey';
import { getStaticPage } from './static.controller';
import { publicApiLimiter } from 'middlewares/rateLimiter';
const router = express.Router();

//static/about or /static/privacy or /static/terms
router.get('/:key', publicApiLimiter, validateStaticPageKey, getStaticPage);

export default router;
