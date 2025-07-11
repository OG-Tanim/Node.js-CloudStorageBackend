// src/modules/folder/folder.controller.ts
import { Request, Response, NextFunction } from 'express';
import Folder from 'models/Folder';
import { AuthRequest } from 'middlewares/requireAuth';
import { sendResponse } from 'utils/sendResponse';

export const createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, parentFolder } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user._id,
      parentFolder: parentFolder || undefined,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'Folder created successfully',
      data: folder,
    });
  } catch (err) {
    next(err);
  }
};

export const renameFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const folder = await Folder.findById(id);
    if (!folder || folder.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Folder not found or unauthorized' });
    }

    folder.name = name;
    await folder.save();

    sendResponse(res, {
      statusCode: 200,
      message: 'Folder renamed',
      data: folder,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findById(id);
    if (!folder || folder.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Folder not found or unauthorized' });
    }

    // Optional: handle deletion of subfolders or orphaned files here

    await Folder.findByIdAndDelete(id);

    sendResponse(res, {
      statusCode: 200,
      message: 'Folder deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getFoldersByUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folders = await Folder.find({ owner: req.user._id }).sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: 200,
      message: 'Folders retrieved successfully',
      data: folders,
    });
  } catch (err) {
    next(err);
  }
};

export const getFolderById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findById(id);
    if (!folder || folder.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Folder not found or unauthorized' });
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'Folder retrieved',
      data: folder,
    });
  } catch (err) {
    next(err);
  }
};
