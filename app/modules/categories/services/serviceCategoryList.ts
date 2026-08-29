import { apiFetch } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";

export function serviceCategoryList() {
  return apiFetch<Category[]>("/categories");
}
