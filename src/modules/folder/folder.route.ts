// src/modules/folder/folder.route.ts
import express from 'express';
import * as FolderController from './folder.controller';
import { requireAuth } from 'middlewares/requireAuth';

const router = express.Router();

// Create Folder
router.post('/', requireAuth, FolderController.createFolder);

// Get User's Folders
router.get('/', requireAuth, FolderController.getFoldersByUser);

// Get Specific Folder
router.get('/:id', requireAuth, FolderController.getFolderById);

// Rename Folder
router.patch('/:id/rename', requireAuth, FolderController.renameFolder);

//Delete Folder
router.delete('/:id', requireAuth, FolderController.deleteFolder);

export default router;
