import { apiFetchList } from "@/lib/api";

import type { Comment } from "../type/typeCommentBase";

export function serviceCommentList() {
  return apiFetchList<Comment>("/comments");
}
