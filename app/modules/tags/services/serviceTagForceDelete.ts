import { apiFetch } from "@/lib/api";

export function serviceTagForceDelete(id: number) {
  return apiFetch<{ message: string }>(`/tags/${id}/force`, { method: "DELETE" });
}
