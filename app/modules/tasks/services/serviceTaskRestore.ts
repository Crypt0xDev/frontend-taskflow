import { apiFetch } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";

export function serviceTaskRestore(id: number) {
  return apiFetch<Task>(`/tasks/${id}/restore`, { method: "POST" });
}
