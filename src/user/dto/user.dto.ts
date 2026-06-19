import { z, ZodType } from 'zod';

export type authResponse = {
  token_type: 'Bearer';
  access_token: string;
};

export type userResponse = {
  id: number;
  email: string;
  password: string;
};

export type userRequest = {
  email: string;
  password: string;
};

export const userSchema: ZodType<userRequest> = z
  .object({
    email: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  })
  .required();
