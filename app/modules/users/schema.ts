import { z } from "zod";

const roleIdSchema = z.number({ error: "Selecciona un rol" }).int().positive("Selecciona un rol");

export const userCreateSchema = z.object({
  email: z.string().min(1, "El correo es obligatorio").email("Correo no válido"),
  user_name: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(8, "La contraseña temporal debe tener al menos 8 caracteres"),
  role_id: roleIdSchema,
});

export type UserCreateValues = z.infer<typeof userCreateSchema>;

export const userEditSchema = z.object({
  user_name: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().min(1, "El correo es obligatorio").email("Correo no válido"),
  role_id: roleIdSchema,
});

export type UserEditValues = z.infer<typeof userEditSchema>;

export const userResetPasswordSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type UserResetPasswordValues = z.infer<typeof userResetPasswordSchema>;
