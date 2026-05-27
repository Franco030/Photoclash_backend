import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  title: z.string().min(1, "El titulo es obligatorio"),
  avatarUrl: z.string().url("Debe ser una URL valida").optional(),
});
export const updateUserSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").optional(),
  title: z.string().min(1, "El titulo no puede estar vacio").optional(),
  avatarUrl: z.string().url("Debe ser una URL valida").optional(),
});
