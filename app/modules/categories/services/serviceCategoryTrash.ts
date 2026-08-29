import { apiFetch } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";

export const serviceCategoryTrashed = () => apiFetch<Category[]>("/categories/trashed");
export const serviceCategoryRestore = (id: number) =>
  apiFetch<Category>(`/categories/${id}/restore`, { method: "POST" });
export const serviceCategoryForceDelete = (id: number) =>
  apiFetch<{ message: string }>(`/categories/${id}/force`, { method: "DELETE" });
