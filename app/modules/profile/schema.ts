import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(1, "El nombre es obligatorio").min(3, "Mínimo 3 caracteres").max(255),
  email: z.string().min(1, "El correo es obligatorio").email("Correo no válido"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Ingresa tu contraseña actual"),
    password: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    password_confirmation: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
