import { apiFetch } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";

export function serviceTaskTrashed() {
  return apiFetch<Task[]>("/tasks/trashed");
}
