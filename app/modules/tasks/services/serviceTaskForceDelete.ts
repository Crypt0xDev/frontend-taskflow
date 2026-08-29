import { apiFetch } from "@/lib/api";

export function serviceTaskForceDelete(id: number) {
  return apiFetch<{ message: string }>(`/tasks/${id}/force`, { method: "DELETE" });
}
