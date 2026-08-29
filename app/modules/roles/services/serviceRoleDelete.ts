import { apiFetch } from "@/lib/api";

export function serviceRoleDelete(id: number) {
  return apiFetch<{ message: string }>(`/admin/roles/${id}`, { method: "DELETE" });
}
