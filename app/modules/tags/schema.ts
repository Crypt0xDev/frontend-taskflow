import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().nullable(),
  color: z.string().nullable(),
});

export type TagValues = z.infer<typeof tagSchema>;
