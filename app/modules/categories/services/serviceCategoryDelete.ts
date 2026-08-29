import { apiFetch } from "@/lib/api";

export function serviceCategoryDelete(id: number) {
  return apiFetch<{ message: string }>(`/categories/${id}`, { method: "DELETE" });
}
