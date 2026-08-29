"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/session";
import { STATUS_LABELS, type TaskStatus } from "@/app/modules/tasks/type";

import { useDashboardSummary } from "../hooks";

const STATUS_BAR: Record<TaskStatus, string> = {
  pending: "bg-amber-500",
  in_progress: "bg-blue-500",
  completed: "bg-brand-500",
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function UiUserDashboard() {
  const { user } = useSession();
  const { stats, recent, loading } = useDashboardSummary();

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const byStatus: Record<TaskStatus, number> = {
    pending: stats.pending,
    in_progress: stats.in_progress,
    completed: stats.completed,
  };
  const taskTotal = stats.total || 1;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {greeting()}, {user?.username}
          </h1>
          <p className="text-sm text-muted-foreground">
            Aquí tienes el resumen de tus tareas.
          </p>
        </div>
        <Button render={<Link href="/tasks" />} nativeButton={false}>
          Ir a mis tareas
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid animate-fade-up gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: ".05s" }}>
        <Kpi label="Pendientes" value={stats.pending} hint="Por hacer" />
        <Kpi label="En progreso" value={stats.in_progress} hint="En curso" />
        <Kpi label="Completadas" value={stats.completed} hint={`${stats.pct}% del total`} accent />
        <Kpi label="Categorías" value={stats.categories} hint="Tus temas" />
      </div>

      <div className="grid animate-fade-up gap-4 lg:grid-cols-2" style={{ animationDelay: ".1s" }}>
        {/* Progress + tasks by status */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Progreso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Avance general</span>
                <span className="text-muted-foreground">
                  {stats.completed} de {stats.total} · {stats.pct}%
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${stats.pct}%` }}
                />
              </div>
            </div>

            <p className="border-t pt-3 text-xs font-medium text-muted-foreground">Por estado</p>

            {(Object.keys(byStatus) as TaskStatus[]).map((status) => {
              const count = byStatus[status];
              const pct = Math.round((count / taskTotal) * 100);
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span>{STATUS_LABELS[status]}</span>
                    <span className="text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${STATUS_BAR[status]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent tasks */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-display">Tareas recientes</CardTitle>
            <Link href="/tasks" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no tienes tareas.</p>
            ) : (
              recent.map((task) => (
                <Link
                  key={task.id}
                  href="/tasks"
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <span className={`size-2 shrink-0 rounded-full ${STATUS_BAR[task.status]}`} />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate font-medium ${
                        task.status === "completed" ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.category?.name ?? "Sin categoría"} · {STATUS_LABELS[task.status]}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card className={accent ? "bg-brand-600 text-white ring-0 shadow-brand" : undefined}>
      <CardContent className="pt-2">
        <p className={accent ? "text-sm text-brand-100" : "text-sm text-muted-foreground"}>{label}</p>
        <p className="font-display text-3xl font-extrabold leading-tight">{value}</p>
        {hint && (
          <p className={accent ? "text-xs text-brand-100/80" : "text-xs text-muted-foreground"}>{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}
