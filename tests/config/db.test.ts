import mongoose from 'mongoose';
import { connectDB } from '../../src/config/db';

describe('MongoDB Connection', () => {
  it('should connect without throwing error', async () => {
    await expect(connectDB()).resolves.not.toThrow();
    await mongoose.disconnect();
  });
});
