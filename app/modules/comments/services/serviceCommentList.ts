import { apiFetchAllPages } from "@/lib/api";

import type { Comment } from "../type/typeCommentBase";

export function serviceCommentList() {
  return apiFetchAllPages<Comment>("/comments");
}
