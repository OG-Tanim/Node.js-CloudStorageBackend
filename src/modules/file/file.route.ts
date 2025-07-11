import express from 'express';
import * as FileController from './file.controller';
import { upload } from 'middlewares/fileUpload';
import { requireAuth } from 'middlewares/requireAuth';
import { checkFileAccess } from 'middlewares/checkFileAccess';
import { publicApiLimiter } from 'middlewares/rateLimiter';
const router = express.Router();

// 🔒 Protected routes

//Upload File
router.post('/upload', requireAuth, upload.single('file'), FileController.uploadFileController);

//Duplicate File
router.post('/:id/duplicate', requireAuth, checkFileAccess, FileController.duplicateFile);
router.post('/:id/share', requireAuth, checkFileAccess, FileController.shareFile);

//Get Files by Folder
router.get('/root/:folderId?', requireAuth, FileController.getFilesByFolder);

//Get Specific File
router.get('/:id', requireAuth, checkFileAccess, FileController.getFileById);

//Get Files by Type
router.get('/type/:type', requireAuth, FileController.getFilesByType);

//Locked
router.get('/locked', requireAuth, FileController.getLockedItems);

//Favorites
router.get('/favorites', requireAuth, FileController.getFavoriteFiles);

//Calender
router.get('/date/:date', requireAuth, FileController.getFilesByDate);
router.get('/month/:month', requireAuth, FileController.getFilesByMonth);

//Delete Specific File
router.delete('/:id', requireAuth, checkFileAccess, FileController.deleteFile);

//Rename Specific File
router.patch('/:id/rename', requireAuth, checkFileAccess, FileController.renameFile);

//Add file to Favorites or Locked
router.patch('/:id/toggle', requireAuth, checkFileAccess, FileController.toggleFavoriteOrLock);

// 🌐 Public route
router.get('/public/:slug', publicApiLimiter, FileController.getSharedFile);

export default router;
