import express from 'express';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.route';
import fileRoutes from './modules/file/file.route';
import folderRoutes from './modules/folder/folder.route';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import staticRoutes from './modules/static/static.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong!' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/static', staticRoutes);
// Centralized error handling middleware
app.use(errorHandler);

export default app;
