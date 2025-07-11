import File from 'models/File';
import Folder from 'models/Folder';
import User from 'models/User';
import mongoose from 'mongoose';

const MAX_STORAGE = 15 * 1024 * 1024 * 1024; // 15 GB

export const getDashboardStats = async (userId: mongoose.Types.ObjectId) => {
  const user = await User.findById(userId);

  // Breakdown by type
  const fileStats = await File.aggregate([
    { $match: { owner: userId } },
    {
      $group: {
        _id: '$type',
        totalSize: { $sum: '$size' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Folder size aggregation
  const folderStats = await Folder.aggregate([
    { $match: { owner: userId } },
    {
      $lookup: {
        from: 'files',
        localField: '_id',
        foreignField: 'folder',
        as: 'files',
      },
    },
    {
      $project: {
        name: 1,
        totalSize: { $sum: '$files.size' },
        fileCount: { $size: '$files' },
      },
    },
  ]);

  return {
    storageUsed: user?.storageUsed || 0,
    storageLimit: MAX_STORAGE,
    fileStats, // array of { _id: 'pdf' | 'note' | 'image', count, totalSize }
    totalFolders: folderStats.length,
    folders: folderStats, // array of folders with size & file count
  };
};

export const getRecentFiles = async (userId: mongoose.Types.ObjectId) => {
  return await File.find({ owner: userId }).sort({ createdAt: -1 }).limit(20);
};
