import { apiFetchList } from "@/lib/api";

import type { Task } from "../type/typeTaskBase";

export function serviceTaskList(q?: string) {
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiFetchList<Task>(`/tasks${query}`);
}
