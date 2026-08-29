import { apiFetch } from "@/lib/api";

export function serviceUserDelete(id: number) {
  return apiFetch<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" });
}
