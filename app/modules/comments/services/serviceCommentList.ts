import { apiFetch } from "@/lib/api";

import type { Comment } from "../type/typeCommentBase";

export function serviceCommentList() {
  return apiFetch<Comment[]>("/comments");
}
