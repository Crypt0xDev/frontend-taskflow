"use client";

import { UiSelectableRow } from "@/components/UiSelectableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatDateTime } from "@/lib/utils";

import type { Task } from "../type";
import { UiTaskPriorityBadge } from "./UiTaskPriorityBadge";
import { UiTaskStatusBadge } from "./UiTaskStatusBadge";

function dueInfo(task: Task): { label: string; overdue: boolean } {
  if (!task.due_date) return { label: "—", overdue: false };
  const due = new Date(`${task.due_date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = task.status !== "completed" && due < today;
  return { label: due.toLocaleDateString("es"), overdue };
}

type Props = {
  tasks: Task[];
  loading: boolean;
  selectedId: number | null;
  onSelect: (task: Task) => void;
};

export function UiTaskList({ tasks, loading, selectedId, onSelect }: Props) {
  if (loading) return <TableSkeleton />;
  if (tasks.length === 0) {
    return (
      <div className="animate-fade-up rounded-md border p-10 text-center">
        <p className="font-medium">No hay tareas todavía</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea tu primera tarea con el botón «Crear».
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Vence</TableHead>
            <TableHead>Creada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <UiSelectableRow
              key={task.id}
              selected={task.id === selectedId}
              onSelect={() => onSelect(task)}
            >
              <TableCell className="font-medium">
                <div>{task.title}</div>
                <div className="line-clamp-1 text-sm font-normal text-muted-foreground">
                  {task.description}
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-xs font-normal"
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: tag.color ?? "var(--muted-foreground)" }}
                        />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {task.category?.name ?? "—"}
              </TableCell>
              <TableCell>
                <UiTaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <UiTaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell className="text-sm">
                {(() => {
                  const { label, overdue } = dueInfo(task);
                  return (
                    <span
                      className={cn(
                        "text-muted-foreground",
                        overdue && "font-medium text-destructive",
                      )}
                    >
                      {label}
                      {overdue && " · vencida"}
                    </span>
                  );
                })()}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(task.created_at)}
              </TableCell>
            </UiSelectableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2 rounded-md border p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}
