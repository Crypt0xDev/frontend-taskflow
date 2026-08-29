import { apiFetch } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";
import type { CategoryValues } from "../schema";

export function serviceCategoryUpdate(id: number, input: CategoryValues) {
  return apiFetch<Category>(`/categories/${id}`, { method: "PUT", body: input });
}
