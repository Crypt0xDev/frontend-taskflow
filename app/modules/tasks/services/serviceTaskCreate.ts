import { apiFetch } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";
import type { TaskInput } from "../type/typeTaskInput";

export function serviceTaskCreate(input: TaskInput) {
  return apiFetch<Task>("/tasks", { method: "POST", body: input });
}
