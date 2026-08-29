import { Badge } from "@/components/ui/badge";

import { STATUS_LABELS, type TaskStatus } from "../type";

const STYLES: Record<TaskStatus, string> = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  in_progress:
    "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
};

export function UiTaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="secondary" className={STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
