import { apiFetchList } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";

export function serviceTaskTrashed() {
  return apiFetchList<Task>("/tasks/trashed");
}
