import { apiFetch } from "@/lib/api";

export function serviceTaskDelete(id: number) {
  return apiFetch<{ message: string }>(`/tasks/${id}`, { method: "DELETE" });
}
