import { apiFetch } from "@/lib/api";

import type { Tag } from "../type/typeTagBase";

export function serviceTagRestore(id: number) {
  return apiFetch<Tag>(`/tags/${id}/restore`, { method: "POST" });
}
