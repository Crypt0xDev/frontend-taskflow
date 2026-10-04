import { apiFetch } from "@/lib/api";

export function serviceCategoryForceDelete(id: number) {
  return apiFetch<{ message: string }>(`/categories/${id}/force`, { method: "DELETE" });
}
