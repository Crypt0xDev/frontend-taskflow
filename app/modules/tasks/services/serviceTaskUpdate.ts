import { apiFetch } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";
import type { TaskInput } from "../type/typeTaskInput";

export function serviceTaskUpdate(id: number, input: TaskInput) {
  return apiFetch<Task>(`/tasks/${id}`, { method: "PUT", body: input });
}
