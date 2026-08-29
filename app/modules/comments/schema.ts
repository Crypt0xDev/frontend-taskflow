import { z } from "zod";

export const commentSchema = z.object({
  body: z.string().min(1, "Escribe un comentario").max(2000),
});

export type CommentValues = z.infer<typeof commentSchema>;
