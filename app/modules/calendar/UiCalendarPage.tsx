"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

import { useCategoryOptions } from "@/app/modules/categories/hooks";
import { useTaskDelete, useTaskList, useTaskUpdate } from "@/app/modules/tasks/hooks";
import { PRIORITY_LABELS, type Task, type TaskPriority } from "@/app/modules/tasks/type";
import type { TaskInput } from "@/app/modules/tasks/type/typeTaskInput";
import { UiTaskForm } from "@/app/modules/tasks/ui/UiTaskForm";
import { UiTaskPriorityBadge } from "@/app/modules/tasks/ui/UiTaskPriorityBadge";
import { UiTaskStatusBadge } from "@/app/modules/tasks/ui/UiTaskStatusBadge";
import { UiTaskView } from "@/app/modules/tasks/ui/UiTaskView";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEKDAY_INITIALS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DOT: Record<TaskPriority, string> = {
  alta: "bg-red-500",
  media: "bg-amber-500",
  baja: "bg-slate-400",
};

function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function isOverdue(task: Task, todayKey: string): boolean {
  return task.status !== "completed" && !!task.due_date && task.due_date < todayKey;
}

export default function UiCalendarPage() {
  const { tasks, loading, reload } = useTaskList();
  const { update } = useTaskUpdate();
  const { remove } = useTaskDelete();
  const categories = useCategoryOptions();
  const { hasPermission } = useSession();
  const canCreate = hasPermission("tasks", "create");
  const canUpdate = hasPermission("tasks", "update");
  const canDelete = hasPermission("tasks", "delete");

  const today = new Date();
  const todayKey = ymd(today);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const byDay = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of tasks) {
      if (!t.due_date) continue;
      (map[t.due_date] ??= []).push(t);
    }
    return map;
  }, [tasks]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (firstDay.getDay() + 6) % 7;
  const cells: (Date | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function goToMonth(offset: number) {
    const next = new Date(year, month + offset, 1);
    setCursor(next);
    const isCurrentMonth = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    setSelectedKey(isCurrentMonth ? todayKey : ymd(next));
  }

  function goToToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedKey(todayKey);
  }

  async function handleEditSubmit(values: TaskInput) {
    if (!editing) return;
    const result = await update(editing.id, values);
    reload();
    return result;
  }

  const selectedDate = new Date(`${selectedKey}T00:00:00`);
  const selectedTasks = byDay[selectedKey] ?? [];

  return (
    <div className="space-y-4">
      <UiHeaderModule
        title="Calendario"
        description="Tus tareas organizadas por fecha de vencimiento."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Mes anterior" onClick={() => goToMonth(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <span aria-live="polite" className="min-w-32 text-center text-sm font-medium capitalize sm:min-w-40">
              {MONTHS[month]} {year}
            </span>
            <Button variant="outline" size="icon" aria-label="Mes siguiente" onClick={() => goToMonth(1)}>
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" className="sm:hidden" onClick={goToToday}>
              Hoy
            </Button>
          </div>
        }
      />

      {loading ? (
        <Skeleton className="h-96 rounded-md" />
      ) : (
        <>
          {/* Móvil: mes compacto + tareas del día elegido */}
          <div className="animate-fade-up space-y-4 sm:hidden">
            <div className="rounded-md border p-2">
              <div aria-hidden="true" className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                {WEEKDAY_INITIALS.map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} />;
                  const key = ymd(date);
                  const dayTasks = byDay[key] ?? [];
                  const overdue = dayTasks.some((t) => isOverdue(t, todayKey));
                  const isToday = key === todayKey;
                  const isSelected = key === selectedKey;
                  const count = dayTasks.length;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      aria-pressed={isSelected}
                      aria-label={`${date.getDate()} de ${MONTHS[month]}${
                        count ? `, ${count} ${count === 1 ? "tarea" : "tareas"}` : ""
                      }${overdue ? ", con vencidas" : ""}`}
                      className="flex h-12 flex-col items-center justify-center gap-1 rounded-lg"
                    >
                      <span
                        className={cn(
                          "grid size-7 place-items-center rounded-full text-sm",
                          isSelected
                            ? "bg-brand-700 font-semibold text-white"
                            : isToday
                              ? "font-semibold text-brand-700 ring-1 ring-brand-700 dark:text-brand-400 dark:ring-brand-400"
                              : "text-ink-900",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <span className="flex h-1.5 gap-0.5" aria-hidden="true">
                        {Array.from({ length: Math.min(count, 3) }).map((_, n) => (
                          <span
                            key={n}
                            className={cn("size-1.5 rounded-full", overdue ? "bg-red-500" : "bg-ink-400")}
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <section aria-live="polite" className="space-y-2">
              <h2 className="text-sm font-semibold">
                {capitalize(selectedDate.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" }))}
                {selectedKey === todayKey && <span className="font-normal text-muted-foreground"> · hoy</span>}
              </h2>
              {selectedTasks.length === 0 ? (
                <div className="rounded-md border p-6 text-center">
                  <p className="text-sm text-muted-foreground">Sin tareas para este día.</p>
                  {canCreate && (
                    <Button
                      variant="outline"
                      className="mt-3"
                      render={<Link href="/tasks?new=1" />}
                      nativeButton={false}
                    >
                      <Plus className="size-4" />
                      Crear tarea
                    </Button>
                  )}
                </div>
              ) : (
                selectedTasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setViewing(t)}
                    className="block w-full rounded-md border p-3 text-left transition-colors active:bg-muted"
                  >
                    <p
                      className={cn(
                        "font-medium",
                        t.status === "completed" && "text-muted-foreground line-through",
                      )}
                    >
                      {t.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <UiTaskStatusBadge status={t.status} />
                      <UiTaskPriorityBadge priority={t.priority} />
                      {isOverdue(t, todayKey) && (
                        <span className="text-xs font-medium text-destructive">Vencida</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </section>
          </div>

          {/* Tablet y superior: cuadrícula mensual */}
          <div className="hidden animate-fade-up overflow-x-auto rounded-md border sm:block">
            <div className="min-w-160">
              <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
                {WEEKDAYS.map((d) => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((date, i) => {
                  const key = date ? ymd(date) : `empty-${i}`;
                  const dayTasks = date ? byDay[key] ?? [] : [];
                  const isToday = date && key === todayKey;
                  return (
                    <div
                      key={key}
                      className={cn(
                        "min-h-24 border-b border-r p-1.5 nth-[7n]:border-r-0",
                        !date && "bg-muted/20",
                      )}
                    >
                      {date && (
                        <>
                          <div
                            className={cn(
                              "mb-1 text-xs",
                              isToday
                                ? "inline-grid size-5 place-items-center rounded-full bg-brand-700 font-bold text-white"
                                : "text-muted-foreground",
                            )}
                          >
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayTasks.slice(0, 3).map((t) => (
                              <div
                                key={t.id}
                                title={`${t.title} · ${PRIORITY_LABELS[t.priority]}`}
                                className={cn(
                                  "flex items-center gap-1 truncate rounded px-1 py-0.5 text-xs",
                                  t.status === "completed"
                                    ? "text-muted-foreground line-through"
                                    : "bg-muted",
                                )}
                              >
                                <span className={cn("size-1.5 shrink-0 rounded-full", DOT[t.priority])} />
                                <span className="truncate">{t.title}</span>
                              </div>
                            ))}
                            {dayTasks.length > 3 && (
                              <div className="px-1 text-[11px] text-muted-foreground">
                                +{dayTasks.length - 3} más
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      <UiTaskView
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        task={viewing}
        actions={
          viewing
            ? {
                onEdit: canUpdate
                  ? () => {
                      setViewing(null);
                      setEditing(viewing);
                    }
                  : undefined,
                onDelete: canDelete
                  ? () => {
                      setViewing(null);
                      setDeleting(viewing);
                    }
                  : undefined,
              }
            : undefined
        }
      />

      <UiTaskForm
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        task={editing}
        categories={categories}
        onSubmit={handleEditSubmit}
      />

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Enviar a la papelera?"
        description={deleting ? `La tarea «${deleting.title}» se moverá a la papelera.` : undefined}
        confirmText="Enviar a papelera"
        destructive
        onConfirm={async () => {
          if (deleting) {
            await remove(deleting.id);
            reload();
          }
        }}
      />
    </div>
  );
}
