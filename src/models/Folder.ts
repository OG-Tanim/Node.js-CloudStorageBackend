import mongoose, { Schema, Document } from "mongoose";

export interface IFolder extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  parentFolder?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FolderSchema: Schema<IFolder> = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentFolder: { type: Schema.Types.ObjectId, ref: "Folder" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Folder = mongoose.model<IFolder>("Folder", FolderSchema);

export default Folder;
