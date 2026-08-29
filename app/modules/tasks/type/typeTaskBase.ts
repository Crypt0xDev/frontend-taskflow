export type TaskStatus = "pending" | "in_progress" | "completed";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completada",
};

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: STATUS_LABELS.pending },
  { value: "in_progress", label: STATUS_LABELS.in_progress },
  { value: "completed", label: STATUS_LABELS.completed },
];

export type TaskPriority = "baja" | "media" | "alta";

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "baja", label: PRIORITY_LABELS.baja },
  { value: "media", label: PRIORITY_LABELS.media },
  { value: "alta", label: PRIORITY_LABELS.alta },
];

export type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  category_id: number | null;
  category?: { id: number; name: string } | null;
  tags?: { id: number; name: string; color: string | null }[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
