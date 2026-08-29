import { apiFetch } from "@/lib/api";

import type { Comment } from "../type/typeCommentBase";

export function serviceCommentCreate(body: string) {
  return apiFetch<Comment>("/comments", { method: "POST", body: { body } });
}
