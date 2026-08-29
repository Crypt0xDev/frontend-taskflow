import type { TaskPriority, TaskStatus } from "./typeTaskBase";

export type TaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  category_id: number | null;
  tag_ids: number[];
};
