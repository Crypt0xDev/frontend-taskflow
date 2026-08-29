import { apiFetch } from "@/lib/api";

export function serviceCommentDelete(id: number) {
  return apiFetch<{ message: string }>(`/comments/${id}`, { method: "DELETE" });
}
