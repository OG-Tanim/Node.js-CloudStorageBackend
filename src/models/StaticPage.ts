import mongoose, { Schema, Document } from 'mongoose';

export interface IStaticPage extends Document {
  key: 'about' | 'privacy' | 'terms';
  title: string;
  content: string; // full HTML body or plaintext
}

const StaticPageSchema: Schema = new Schema({
  key: { type: String, enum: ['about', 'privacy', 'terms'], unique: true, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const StaticPage = mongoose.model<IStaticPage>('StaticPage', StaticPageSchema);
export default StaticPage;
