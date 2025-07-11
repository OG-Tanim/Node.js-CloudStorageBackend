import mongoose, { Schema, Document } from 'mongoose';

export type FileType = 'note' | 'image' | 'pdf';

export interface IFile extends Document {
  name: string;
  type: FileType;
  owner: mongoose.Types.ObjectId;
  folder?: mongoose.Types.ObjectId;
  url: string;
  size: number;
  isFavorite: boolean;
  isLocked: boolean;
  sharedLink?: string;
  createdAt: Date;
}

const FileSchema: Schema<IFile> = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['note', 'image', 'pdf'], required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: Schema.Types.ObjectId, ref: 'Folder' },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    isFavorite: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    sharedLink: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const File = mongoose.model<IFile>('File', FileSchema);

export default File;
``;
