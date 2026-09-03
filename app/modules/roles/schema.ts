import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().nullable(),
  permission_ids: z.array(z.number()),
});

export type RoleValues = z.infer<typeof roleSchema>;
