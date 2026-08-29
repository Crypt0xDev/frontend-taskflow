import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  description: z.string().max(255).nullable(),
  color: z.string().nullable(),
});

export type CategoryValues = z.infer<typeof categorySchema>;

export const CATEGORY_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#64748b", // slate
];
