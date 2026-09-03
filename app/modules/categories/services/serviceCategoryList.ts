import { apiFetchList } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";

export function serviceCategoryList() {
  return apiFetchList<Category>("/categories");
}
