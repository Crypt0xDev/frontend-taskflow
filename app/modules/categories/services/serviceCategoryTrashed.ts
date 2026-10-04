import { apiFetchAllPages } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";

export function serviceCategoryTrashed() {
  return apiFetchAllPages<Category>("/categories/trashed");
}
