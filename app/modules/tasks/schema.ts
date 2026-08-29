import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(255),
  description: z.string().min(1, "La descripción es obligatoria").max(2000),
  status: z.enum(["pending", "in_progress", "completed"]),
  priority: z.enum(["baja", "media", "alta"]),
  due_date: z.string().nullable(),
  category_id: z.number().int().positive().nullable(),
  tag_ids: z.array(z.number().int().positive()),
});

export type TaskValues = z.infer<typeof taskSchema>;
