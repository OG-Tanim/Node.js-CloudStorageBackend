import { z } from 'zod';

export const updateUsernameSchema = z.object({
  body: z.object({
    username: z.string().min(3),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
  }),
});
