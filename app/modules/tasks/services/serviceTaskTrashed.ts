import { apiFetchAllPages } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";

export function serviceTaskTrashed() {
  return apiFetchAllPages<Task>("/tasks/trashed");
}
