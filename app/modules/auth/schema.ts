import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo no válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z
  .object({
    user_name: z.string().min(3, "Elige un nombre de usuario (mínimo 3 caracteres)"),
    email: z.string().min(1, "Ingresa tu correo").email("Correo no válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo no válido"),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().min(1).email(),
    code: z.string().regex(/^\d{6}$/, "El código debe tener 6 dígitos"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
