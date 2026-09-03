"use client";

import { UiTrashSheet } from "@/components/UiTrashSheet";
import { useTrash } from "@/hooks/useTrash";

import { serviceTaskForceDelete } from "../services/serviceTaskForceDelete";
import { serviceTaskRestore } from "../services/serviceTaskRestore";
import { serviceTaskTrashed } from "../services/serviceTaskTrashed";
import type { Task } from "../type/typeTaskBase";
import { UiTaskStatusBadge } from "./UiTaskStatusBadge";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
};

export function UiTaskTrash({ open, onOpenChange, onChanged }: Props) {
  const trash = useTrash<Task>(open, serviceTaskTrashed, serviceTaskRestore, serviceTaskForceDelete, {
    restored: "Tarea restaurada.",
    deleted: "Tarea eliminada definitivamente.",
    restoredAll: "Se restauraron todas las tareas.",
    emptied: "Papelera de tareas vaciada.",
  });

  return (
    <UiTrashSheet
      open={open}
      onOpenChange={onOpenChange}
      onChanged={onChanged}
      title="Papelera de tareas"
      emptyLabel="La papelera está vacía."
      itemLabel={{ one: "tarea", many: "tareas" }}
      trash={trash}
      renderItem={(task) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{task.title}</p>
          <div className="mt-1">
            <UiTaskStatusBadge status={task.status} />
          </div>
        </div>
      )}
    />
  );
}
