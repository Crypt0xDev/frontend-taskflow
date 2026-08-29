"use client";

import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/utils";
import { useSession } from "@/lib/session";

import { useAdminOverview } from "../hooks/useAdminOverview";

export default function UiAdminOverview() {
  const { user } = useSession();
  const { data, loading } = useAdminOverview();

  if (loading || !data) {
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

  const { totals, recentUsers, recentComments } = data;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="font-display text-2xl font-bold tracking-tight">Hola, {user?.username}</h1>
        <p className="text-sm text-muted-foreground">
          Panel administrativo · gestión de usuarios y contenido.
        </p>
      </div>

      {/* KPIs — administrative only */}
      <div className="grid animate-fade-up gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ animationDelay: ".05s" }}>
        <Kpi label="Usuarios" value={totals.users} hint="Cuentas totales" accent />
        <Kpi label="Administradores" value={totals.admins} hint="Con acceso admin" />
        <Kpi label="Usuarios normales" value={totals.users_normal} hint="Cuentas estándar" />
        <Kpi label="Comentarios" value={totals.comments} hint="Total en el sistema" />
      </div>

      <div className="grid animate-fade-up gap-4 lg:grid-cols-2" style={{ animationDelay: ".1s" }}>
        {/* Recent users */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-display">Usuarios recientes</CardTitle>
            <Link href="/admin/users" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-brand-100 text-xs font-bold text-brand-700">
                    {u.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate font-medium">{u.username}</span>
                <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                  {u.role}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent comments */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="font-display">Comentarios recientes</CardTitle>
            <Link href="/admin/comments" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Moderar
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay comentarios todavía.</p>
            ) : (
              recentComments.map((c) => (
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
