import { apiFetch } from "@/lib/api";

import type { Category } from "../type/typeCategoryBase";
import type { CategoryValues } from "../schema";

export function serviceCategoryCreate(input: CategoryValues) {
  return apiFetch<Category>("/categories", { method: "POST", body: input });
}
