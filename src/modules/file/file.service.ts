import cloudinary from 'config/cloudinary';
import { extractPublicIdFromUrl } from './file.utils';
import File from 'models/File';
import User from 'models/User';
import { v4 as uuidv4 } from 'uuid';

interface UploadFileOptions {
  name: string;
  type: 'note' | 'image' | 'pdf';
  ownerId: string;
  folderId?: string;
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export const uploadFile = async ({
  name,
  type,
  ownerId,
  folderId,
  buffer,
  mimetype,
  size,
}: UploadFileOptions) => {
  // 1. Upload to Cloudinary
  const base64Str = `data:${mimetype};base64,${buffer.toString('base64')}`;

  const uploadRes = await cloudinary.uploader.upload(base64Str, {
    folder: 'cloud-storage',
    public_id: uuidv4(),
    resource_type: 'auto',
  });

  // 2. Save file to DB
  const file = await File.create({
    name,
    type,
    owner: ownerId,
    folder: folderId,
    url: uploadRes.secure_url,
    size,
  });

  // 3. Update user’s storage usage
  await User.findByIdAndUpdate(ownerId, {
    $inc: { storageUsed: size },
  });

  return file;
};

export const deleteFromCloudinary = async (url: string) => {
  const publicId = extractPublicIdFromUrl(url);
  await cloudinary.uploader.destroy(publicId);
};
