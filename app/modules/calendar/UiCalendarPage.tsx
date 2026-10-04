"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { UiHeaderModule } from "@/components/UiHeaderModule";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useTaskList } from "@/app/modules/tasks/hooks";
import { PRIORITY_LABELS, type Task, type TaskPriority } from "@/app/modules/tasks/type";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
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

export default function UiCalendarPage() {
  const { tasks, loading } = useTaskList();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
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

  const todayKey = ymd(today);

  return (
    <div className="space-y-4">
      <UiHeaderModule
        title="Calendario"
        description="Tus tareas organizadas por fecha de vencimiento."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Mes anterior"
              onClick={() => setCursor(new Date(year, month - 1, 1))}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-40 text-center text-sm font-medium capitalize">
              {MONTHS[month]} {year}
            </span>
            <Button variant="outline" size="icon" aria-label="Mes siguiente"
              onClick={() => setCursor(new Date(year, month + 1, 1))}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      {loading ? (
        <Skeleton className="h-96 rounded-md" />
      ) : (
        <>
          {/* Móvil: agenda apilada por día, sin scroll lateral */}
          <div className="animate-fade-up space-y-3 sm:hidden">
            {cells
              .filter((date): date is Date => date !== null)
              .map((date) => {
                const key = ymd(date);
                const dayTasks = byDay[key] ?? [];
                const isToday = key === todayKey;
                if (dayTasks.length === 0 && !isToday) return null;
                return (
                  <div key={key} className="rounded-md border p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                          isToday ? "bg-brand-700 text-white" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {WEEKDAYS[(date.getDay() + 6) % 7]} · {MONTHS[date.getMonth()]}
                      </span>
                    </div>
                    {dayTasks.length === 0 ? (
                      <p className="pl-8 text-xs text-muted-foreground">Sin tareas</p>
                    ) : (
                      <div className="space-y-1.5 pl-8">
                        {dayTasks.map((t) => (
                          <div
                            key={t.id}
                            className={cn(
                              "flex items-center gap-1.5 text-sm",
                              t.status === "completed" && "text-muted-foreground line-through",
                            )}
                          >
                            <span className={cn("size-1.5 shrink-0 rounded-full", DOT[t.priority])} />
                            <span className="truncate">{t.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            {cells.every((date) => !date || (byDay[ymd(date)] ?? []).length === 0) && (
              <div className="rounded-md border p-10 text-center">
                <p className="font-medium">No hay tareas este mes</p>
              </div>
            )}
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
    </div>
  );
}
