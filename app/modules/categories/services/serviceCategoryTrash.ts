import { apiFetch, apiFetchList } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";

export const serviceCategoryTrashed = () => apiFetchList<Category>("/categories/trashed");
export const serviceCategoryRestore = (id: number) =>
  apiFetch<Category>(`/categories/${id}/restore`, { method: "POST" });
export const serviceCategoryForceDelete = (id: number) =>
  apiFetch<{ message: string }>(`/categories/${id}/force`, { method: "DELETE" });
