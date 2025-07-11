import mongoose, { Schema, Document } from "mongoose";

export interface ISharedLink extends Document {
  slug: string;
  file: mongoose.Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
}

const SharedLinkSchema: Schema<ISharedLink> = new Schema(
  {
    slug: { type: String, unique: true, required: true },
    file: { type: Schema.Types.ObjectId, ref: "File", required: true },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const SharedLink = mongoose.model<ISharedLink>("SharedLink", SharedLinkSchema);

export default SharedLink;
