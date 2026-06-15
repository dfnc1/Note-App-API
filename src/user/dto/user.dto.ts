import { z, ZodType } from 'zod';

export type userResponse = {
  id: number;
  email: string;
};

export type createUserRequest = {
  email: string;
  password: string;
};

export const createUserSchema: ZodType<createUserRequest> = z
  .object({
    email: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  })
  .required();

export type updateUserRequest = {
  email?: string | null;
  password?: string | null;
};

export const updateUserSchema: ZodType<updateUserRequest> = z.object({
  email: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
});
