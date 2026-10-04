import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Ingresa tu nombre").max(100, "Máximo 100 caracteres"),
  email: z.string().trim().min(1, "Ingresa tu correo").email("Correo no válido"),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(2000, "Máximo 2000 caracteres"),
});

export type ContactValues = z.infer<typeof contactSchema>;
