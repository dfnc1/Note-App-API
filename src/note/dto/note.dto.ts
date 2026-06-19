import { ZodType, z } from 'zod';

export type noteResponse = {
  id: number;
  title?: string | null;
  content?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export type createNoteRequest = {
  title: string;
  content: string;
  user_id: number;
};

export const createNoteSchema: ZodType<createNoteRequest> = z
  .object({
    title: z.string().min(1).max(100),
    content: z.string().min(1),
    user_id: z.number().min(1).positive(),
  })
  .required();

export type updateNoteRequest = {
  id: number;
  title?: string | null;
  content?: string | null;
};

export const updateNoteSchema: ZodType<updateNoteRequest> = z.object({
  id: z.number().positive(),
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
});
