import bcrypt from 'bcryptjs';
import User from 'models/User';

export const updateUsername = async (userId: string, newUsername: string) => {
  return User.findByIdAndUpdate(userId, { username: newUsername }, { new: true }).select(
    '-password',
  );
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !user.password) throw new Error('User not found');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Incorrect old password');

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
};

export const deleteAccount = async (userId: string) => {
  await User.findByIdAndDelete(userId);
};
