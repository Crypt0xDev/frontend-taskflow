import { apiFetch } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";

export function serviceCategoryRestore(id: number) {
  return apiFetch<Category>(`/categories/${id}/restore`, { method: "POST" });
}
