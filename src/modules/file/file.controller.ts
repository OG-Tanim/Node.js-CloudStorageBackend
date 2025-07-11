import { Response, NextFunction } from 'express';
import { uploadFile, deleteFromCloudinary } from './file.service';
import { sendResponse } from 'utils/sendResponse';
import { AuthRequest } from 'middlewares/requireAuth';
import File from 'models/File';
import User from 'models/User';
import Folder from 'models/Folder';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

export const uploadFileController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, type, folderId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }

    const uploaded = await uploadFile({
      name,
      type,
      ownerId: req.user._id,
      folderId,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
    });

    sendResponse(res, {
      statusCode: 201,
      message: 'File uploaded successfully',
      data: uploaded,
    });
  } catch (err) {
    next(err);
  }
};

//get files by folder
export const getFilesByFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folderQuery = folderId ? { folder: folderId } : { folder: { $exists: false } };

    const files = await File.find({
      owner: userId,
      ...folderQuery,
      isLocked: false,
    }).sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: 200,
      message: 'Files retrieved successfully',
      data: files,
    });
  } catch (err) {
    next(err);
  }
};
//delete file
export const deleteFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const file = await File.findById(id);

  if (!file || file.owner.toString() !== req.user._id.toString()) {
    throw new Error('404: File not found or unauthorized');
  }

  // 1. Delete from Cloudinary
  await deleteFromCloudinary(file.url);

  // 2. Delete from DB
  await File.findByIdAndDelete(id);

  // 3. Update user storage
  await User.findByIdAndUpdate(file.owner, { $inc: { storageUsed: -file.size } });

  sendResponse(res, { statusCode: 200, message: 'File deleted' });
};

//Rename file
export const renameFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const file = await File.findById(id);
  if (!file || file.owner.toString() !== req.user._id.toString()) {
    throw new Error('404, File not found or unauthorized');
  }

  file.name = name;
  await file.save();

  sendResponse(res, { statusCode: 200, message: 'File renamed', data: file });
};

//Duplicate file
export const duplicateFile = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const original = await File.findById(id);
  if (!original || original.owner.toString() !== req.user._id.toString()) {
    throw new Error('404, File not found or unauthorized');
  }

  const duplicated = await File.create({
    ...original.toObject(),
    _id: undefined,
    name: original.name + '_copy',
    createdAt: new Date(),
  });

  await User.findByIdAndUpdate(original.owner, { $inc: { storageUsed: duplicated.size } });

  sendResponse(res, { statusCode: 201, message: 'File duplicated', data: duplicated });
};

// Get single file by ID
export const getFileById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Allow if user is owner or if file is shared
    const isOwner = file.owner.toString() === req.user._id.toString();
    const isShared = !!file.sharedLink;

    if (!isOwner && !isShared) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'File retrieved successfully',
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

// Get files by type
export const getFilesByType = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params;
    const validTypes = ['note', 'image', 'pdf'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid file type' });
    }

    const files = await File.find({ owner: req.user._id, type, isLocked: false }).sort({
      createdAt: -1,
    });

    sendResponse(res, {
      statusCode: 200,
      message: `Files of type ${type} retrieved`,
      data: files,
    });
  } catch (err) {
    next(err);
  }
};

// Share a file (generate public link)
export const shareFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file || file.owner.toString() !== req.user._id.toString()) {
      throw new Error('404, File not found or unauthorized');
    }

    const slug = crypto.randomBytes(6).toString('hex');

    file.sharedLink = slug;
    await file.save();

    sendResponse(res, {
      statusCode: 200,
      message: 'Shareable link generated',
      data: {
        sharedUrl: `${process.env.CLIENT_URL}/share/${slug}`,
        slug,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Public route
export const getSharedFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const file = await File.findOne({ sharedLink: slug });

    if (!file) {
      return res.status(404).json({ success: false, message: 'Shared file not found' });
    }

    sendResponse(res, {
      statusCode: 200,
      message: 'Shared file retrieved',
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

//Toggle Favorite or Lock
export const toggleFavoriteOrLock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { toggle } = req.query; // 'favorite' or 'lock'
    const { passcode } = req.body;

    const file = await File.findById(id);
    if (!file || file.owner.toString() !== req.user._id.toString()) {
      throw new Error('404, File not found or unauthorized');
    }

    if (toggle === 'favorite') {
      file.isFavorite = !file.isFavorite;
    } else if (toggle === 'lock') {
      const user = await User.findById(req.user._id);
      if (!user?.filePasscode) {
        return res.status(403).json({ message: 'No passcode set. Please set one first.' });
      }

      const match = await bcrypt.compare(passcode || '', user.filePasscode);
      if (!match) {
        return res.status(401).json({ message: 'Invalid passcode' });
      }

      file.isLocked = !file.isLocked;
    } else {
      throw new Error('400, Invalid toggle option');
    }

    await file.save();

    sendResponse(res, {
      statusCode: 200,
      message: `File ${toggle} status toggled`,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

//Get All Locked files
export const getLockedItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const passcode = req.headers['x-file-passcode'] as string;

    if (!passcode) {
      return res.status(400).json({ message: 'Passcode is required in x-file-passcode header' });
    }

    const user = await User.findById(userId);
    const isValid = await bcrypt.compare(passcode, user?.filePasscode || '');

    if (!isValid) {
      return res.status(401).json({ message: 'Unauthorized: Invalid passcode' });
    }

    const lockedFiles = await File.find({ owner: userId, isLocked: true }).sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: 200,
      message: 'Locked files retrieved successfully',
      data: { files: lockedFiles },
    });
  } catch (err) {
    next(err);
  }
};

//Get All Favorites
export const getFavoriteFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const files = await File.find({
      owner: req.user._id,
      isFavorite: true,
      isLocked: false,
    }).sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: 200,
      message: 'Favorite files retrieved successfully',
      data: files,
    });
  } catch (err) {
    next(err);
  }
};

//Get Files by Specific Date
export const getFilesByDate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { date } = req.params;

    const parsedDate = dayjs(date, 'D-MM-YYYY', true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: 'Invalid date format. Use D-MM-YYYY.' });
    }

    const start = parsedDate.startOf('day').toDate();
    const end = parsedDate.endOf('day').toDate();

    const files = await File.find({
      owner: req.user._id,
      isLocked: false,
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });

    sendResponse(res, {
      statusCode: 200,
      message: `Files created on ${date}`,
      data: files,
    });
  } catch (err) {
    next(err);
  }
};

//Get Files by Month
export const getFilesByMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { month } = req.params;

    const parsedMonth = dayjs(month, 'MM-YYYY', true);
    if (!parsedMonth.isValid()) {
      return res.status(400).json({ message: 'Invalid month format. Use MM-YYYY.' });
    }

    const start = parsedMonth.startOf('month').toDate();
    const end = parsedMonth.endOf('month').toDate();

    const files = await File.find({
      owner: req.user._id,
      isLocked: false,
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 }); // Optional: latest first

    sendResponse(res, {
      statusCode: 200,
      message: `Files created in ${month}`,
      data: files.map((f) => ({
        _id: f._id,
        name: f.name,
        type: f.type,
        size: f.size,
        createdAt: f.createdAt,
        folder: f.folder,
        isFavorite: f.isFavorite,
        isLocked: f.isLocked,
      })),
    });
  } catch (err) {
    next(err);
  }
};
