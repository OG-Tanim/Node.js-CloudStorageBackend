import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../../models/User';
import { generateToken } from '../../utils/jwt';
import { env } from '../../config/env';

export const signup = async (username: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  const token = generateToken(user._id.toString());

  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    storageUsed: user.storageUsed,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return { user: userResponse, token };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken(user._id.toString());
  const userResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    storageUsed: user.storageUsed,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return { user: userResponse, token };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new Error('No user with that email');

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 min
  await user.save();

  const resetLink = `${env.clientUrl}/reset-password/${token}`;

  // [You can plug in SendGrid, Mailgun, or Ethereal test email later]
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: env.emailFrom,
      pass: env.emailPass,
    },
  });

  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  return { message: 'Reset link sent' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) throw new Error('Token expired or invalid');

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return { message: 'Password reset successful' };
};
