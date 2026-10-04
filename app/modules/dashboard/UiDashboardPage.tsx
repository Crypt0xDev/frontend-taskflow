"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Layers, ListTodo, Loader2, Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { STATUS_LABELS, type TaskStatus } from "@/app/modules/tasks/type";

import { useAdminOverview, useDashboardSummary } from "./hooks";

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

export default function DashboardView() {
  const { user, hasPermission } = useSession();
  const canCreateTasks = hasPermission("tasks", "create");
  const { stats, recent, loading: tasksLoading, canViewTasks, canViewCategories } = useDashboardSummary();
  const {
    usersOverview,
    commentsOverview,
    loading: adminLoading,
    canViewUsers,
    canViewComments,
  } = useAdminOverview();

  const byStatus: Record<TaskStatus, number> | null = stats && {
    pending: stats.pending,
    in_progress: stats.in_progress,
    completed: stats.completed,
  };
  const taskTotal = stats?.total || 1;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {greeting()}, {user?.username}
          </h1>
          <p className="text-sm text-muted-foreground">Tu resumen de TaskFlow.</p>
        </div>
        {canViewTasks && canCreateTasks && (
          <Button render={<Link href="/tasks?new=1" />} nativeButton={false}>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        )}
      </div>

      {canViewTasks &&
        (tasksLoading || !stats || !byStatus ? (
          <div className="space-y-4">
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
        ) : (
          <>
            <BentoGrid
              className="animate-fade-up max-w-none auto-rows-auto grid-cols-2 gap-3 md:auto-rows-auto md:grid-cols-3 lg:grid-cols-6"
              style={{ animationDelay: ".05s" }}
            >
              <StatTile
                icon={ListTodo}
                label="Pendientes"
                value={stats.pending}
                hint="Por hacer"
              />
              <StatTile
                icon={Loader2}
                label="En progreso"
                value={stats.in_progress}
                hint="En curso"
              />
              <StatTile
                icon={AlertTriangle}
                label="Vencidas"
                value={stats.overdue}
                hint="Necesitan atención"
                tone={stats.overdue > 0 ? "warn" : undefined}
              />
              <StatTile
                icon={CalendarClock}
                label="Del día"
                value={stats.dueToday}
                hint="Vencen hoy"
              />
              <StatTile
                icon={CheckCircle2}
                label="Completadas"
                value={stats.completed}
                hint={`${stats.pct}% del total`}
              />
              {canViewCategories && (
                <StatTile icon={Layers} label="Categorías" value={stats.categories} hint="Tus temas" />
              )}
            </BentoGrid>

            <div className="grid animate-fade-up gap-4 lg:grid-cols-2" style={{ animationDelay: ".1s" }}>
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

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="font-display">Tareas recientes</CardTitle>
                  <Link href="/tasks" className="text-sm font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800">
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
          </>
        ))}

      {(canViewUsers || canViewComments) &&
        (adminLoading ? (
          <div className="space-y-4">
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
        ) : (
          <>
            {(usersOverview || commentsOverview) && (
              <div className="grid animate-fade-up gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {usersOverview && (
                  <>
                    <Kpi label="Usuarios" value={usersOverview.totals.users} hint="Cuentas totales" accent />
                    <Kpi label="Administradores" value={usersOverview.totals.admins} hint="Con acceso admin" />
                    <Kpi label="Usuarios normales" value={usersOverview.totals.users_normal} hint="Cuentas estándar" />
                  </>
                )}
                {commentsOverview && (
                  <Kpi label="Comentarios" value={commentsOverview.total} hint="Total en el sistema" />
                )}
              </div>
            )}

            <div className="grid animate-fade-up gap-4 lg:grid-cols-2">
              {usersOverview && (
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="font-display">Usuarios recientes</CardTitle>
                    <Link
                      href="/admin/users"
                      className="text-sm font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800"
                    >
                      Ver todos
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {usersOverview.recentUsers.map((u) => (
                      <div key={u.id} className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-brand-100 text-xs font-bold text-brand-700">
                            {u.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1 truncate font-medium">{u.username}</span>
                        <Badge variant={u.role.name === "admin" ? "default" : "secondary"} className="text-xs">
                          {u.role.name}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {commentsOverview && (
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="font-display">Comentarios recientes</CardTitle>
                    <Link
                      href="/admin/comments"
                      className="text-sm font-semibold text-brand-700 dark:text-brand-400 hover:text-brand-800"
                    >
                      Moderar
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {commentsOverview.recentComments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No hay comentarios todavía.</p>
                    ) : (
                      commentsOverview.recentComments.map((c) => (
                        <div key={c.id} className="flex gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                          <Avatar className="size-8 shrink-0">
                            <AvatarFallback className="bg-muted text-xs font-bold">
                              {(c.author?.username ?? "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{c.author?.username ?? "Anónimo"}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(c.created_at)}
                              </span>
                            </div>
                            <p className="line-clamp-2 text-sm text-muted-foreground">{c.body}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ))}
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
    <Card className={accent ? "bg-brand-700 text-white ring-0 shadow-brand" : undefined}>
      <CardContent className="pt-2">
        <p className={accent ? "text-sm text-brand-100" : "text-sm text-muted-foreground"}>{label}</p>
        <p className="font-display text-3xl font-extrabold leading-tight">{value}</p>
        {hint && (
          <p className={accent ? "text-xs text-brand-100" : "text-xs text-muted-foreground"}>{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint?: string;
  tone?: "warn";
}) {
  // Solo se resalta lo que requiere acción (p. ej. tareas vencidas).
  const warnActive = tone === "warn" && value > 0;

  return (
    <BentoGridItem
      className={warnActive ? "space-y-0 border-warm-200 bg-warm-50" : "space-y-0"}
      icon={<Icon className={`size-5 ${warnActive ? "text-warm-600" : "text-ink-400"}`} />}
      title={
        <span
          className={`font-display text-3xl font-extrabold leading-tight ${
            warnActive ? "text-neutral-900" : "text-ink-900"
          }`}
        >
          {value}
        </span>
      }
      description={
        <>
          <span className={`font-semibold ${warnActive ? "text-neutral-700" : "text-ink-600"}`}>{label}</span>
          {hint && <span className={`block ${warnActive ? "text-neutral-600" : "text-ink-400"}`}>{hint}</span>}
        </>
      }
    />
  );
}
