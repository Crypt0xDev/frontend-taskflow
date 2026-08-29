import { Badge } from "@/components/ui/badge";

import { PRIORITY_LABELS, type TaskPriority } from "../type";

const STYLES: Record<TaskPriority, string> = {
  baja: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  media: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  alta: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
};

export function UiTaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="secondary" className={STYLES[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
