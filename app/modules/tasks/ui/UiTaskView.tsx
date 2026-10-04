"use client";

import { UiViewField, UiViewSheet, type ViewSheetActions } from "@/components/UiViewSheet";
import { formatDateTime } from "@/lib/utils";

import { PRIORITY_LABELS, type Task } from "../type";
import { UiTaskStatusBadge } from "./UiTaskStatusBadge";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  actions?: ViewSheetActions;
};

export function UiTaskView({ open, onOpenChange, task, actions }: Props) {
  return (
    <UiViewSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de la tarea"
      description="Información completa de la tarea."
      empty={task ? undefined : "No se encontró la tarea."}
      actions={actions}
    >
      {task && (
        <>
          <UiViewField label="Título">
            <p className="font-medium">{task.title}</p>
          </UiViewField>
          <UiViewField label="Descripción">
            <p className="whitespace-pre-wrap">{task.description}</p>
          </UiViewField>
          <UiViewField label="Estado">
            <div className="mt-1">
              <UiTaskStatusBadge status={task.status} />
            </div>
          </UiViewField>
          <UiViewField label="Prioridad">
            <p>{PRIORITY_LABELS[task.priority]}</p>
          </UiViewField>
          <UiViewField label="Vence">
            <p>{task.due_date ? new Date(`${task.due_date}T00:00:00`).toLocaleDateString("es") : "—"}</p>
          </UiViewField>
          <UiViewField label="Categoría">
            <p>{task.category?.name ?? "—"}</p>
          </UiViewField>
          <UiViewField label="Etiquetas">
            {task.tags && task.tags.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: tag.color ?? "var(--muted-foreground)" }}
                    />
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <p>—</p>
            )}
          </UiViewField>
          <UiViewField label="Creada">
            <p>{formatDateTime(task.created_at)}</p>
          </UiViewField>
          <UiViewField label="Actualizada">
            <p>{formatDateTime(task.updated_at)}</p>
          </UiViewField>
        </>
      )}
    </UiViewSheet>
  );
}
