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
  /** Móvil: tocar la tarjeta abre el detalle directamente. */
  onOpen: (task: Task) => void;
};

export function UiTaskList({ tasks, loading, selectedId, onSelect, onOpen }: Props) {
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
    <div className="animate-fade-up space-y-2 sm:space-y-0">
      {/* Móvil: tarjetas apiladas, sin scroll lateral */}
      <div className="space-y-2 sm:hidden">
        {tasks.map((task) => {
          const { label, overdue } = dueInfo(task);
          return (
            <button
              type="button"
              key={task.id}
              onClick={() => onOpen(task)}
              className="block w-full rounded-md border p-3 text-left transition-colors active:bg-muted"
            >
              <p className="font-medium">{task.title}</p>
              {task.description && (
                <p className="line-clamp-1 text-sm text-muted-foreground">{task.description}</p>
              )}
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
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <UiTaskStatusBadge status={task.status} />
                <UiTaskPriorityBadge priority={task.priority} />
                <span className="text-xs text-muted-foreground">{task.category?.name ?? "Sin categoría"}</span>
              </div>
              <div className="mt-1.5 text-xs">
                <span className={cn("text-muted-foreground", overdue && "font-medium text-destructive")}>
                  Vence: {label}
                  {overdue && " · vencida"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tablet y superior: tabla */}
      <div className="hidden rounded-md border sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Vence</TableHead>
              <TableHead className="hidden md:table-cell">Creada</TableHead>
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
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {formatDateTime(task.created_at)}
                </TableCell>
              </UiSelectableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
