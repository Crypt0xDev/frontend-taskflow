"use client";

import { useMemo, useState } from "react";
import { KeyRound } from "lucide-react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiLoadError } from "@/components/UiLoadError";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { UiPaginationControl } from "@/components/UiPaginationControl";
import { useResponsivePageSize } from "@/hooks/useResponsivePageSize";
import { useSession } from "@/lib/session";
import { useRoleList } from "@/app/modules/roles/hooks/useRoleList";

import { useUserList } from "./hooks";
import type { User } from "./type";
import { UiUserCreateForm } from "./ui/UiUserCreateForm";
import { UiUserEditForm } from "./ui/UiUserEditForm";
import { UiUserResetPasswordForm } from "./ui/UiUserResetPasswordForm";
import { UiUserView } from "./ui/UiUserView";

export default function UiUserPage() {
  const { users, loading, error, reload, changeRole, remove } = useUserList();
  const { user: me, hasPermission } = useSession();
  const { roles } = useRoleList();
  const canCreate = hasPermission("users", "create");
  const canUpdate = hasPermission("users", "update");
  const canDelete = hasPermission("users", "delete");
  const [deleting, setDeleting] = useState<User | null>(null);
  const [viewing, setViewing] = useState<User | null>(null);
  const [resetting, setResetting] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection(users);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);
  const [tableRef, pageSize] = useResponsivePageSize<HTMLDivElement>();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role.name === roleFilter) &&
        (!q || u.username.toLowerCase().includes(q)),
    );
  }, [users, query, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const paged = useMemo(
    () => filtered.slice((current - 1) * pageSize, current * pageSize),
    [filtered, current, pageSize],
  );

  const selectedIsMe = selected?.id === me?.id;

  return (
    <div className="space-y-4">
      <UiHeaderModule
        title="Usuarios"
        description={`Gestiona los roles y las cuentas · ${users.length} en total.`}
      />

      <UiActionToolbar
        hasSelection={hasSelection}
        onCreate={canCreate ? () => setCreating(true) : undefined}
        createLabel="Crear usuario"
        onView={() => selected && setViewing(selected)}
        onEdit={canUpdate ? () => selected && setEditing(selected) : undefined}
        onDelete={canDelete ? () => selected && setDeleting(selected) : undefined}
        deleteDisabled={selectedIsMe}
        hideSelectionActionsOnMobile
        start={
          <Button
            variant="outline"
            className="hidden sm:inline-flex"
            disabled={!hasSelection || !canUpdate}
            onClick={() => selected && setResetting(selected)}
          >
            <KeyRound className="size-4" />
            Restablecer contraseña
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por usuario…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="min-w-0 flex-1 sm:max-w-xs"
        />
        <Select
          items={{
            all: "Todos los roles",
            ...Object.fromEntries(roles.map((r) => [r.name, r.name])),
          }}
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filtrar por rol" className="w-36 shrink-0 sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.name}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div ref={tableRef} className="space-y-2 rounded-3xl border border-ink-100 bg-surface p-4 shadow-soft">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : error && users.length === 0 ? (
        <div ref={tableRef}>
          <UiLoadError message="No se pudieron cargar los usuarios." onRetry={reload} />
        </div>
      ) : filtered.length === 0 ? (
        <div ref={tableRef} className="animate-fade-up rounded-3xl border border-dashed border-ink-200 bg-surface p-10 text-center shadow-soft">
          <p className="font-display font-semibold">Sin resultados</p>
          <p className="mt-1 text-sm text-ink-500">
            {query || roleFilter !== "all"
              ? "Ningún usuario coincide con los filtros."
              : "Las cuentas registradas aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div ref={tableRef} className="animate-fade-up space-y-2 sm:space-y-0">
          {/* Móvil: tarjetas apiladas, sin scroll lateral */}
          <div className="space-y-2 sm:hidden">
            {paged.map((u) => {
              const isMe = u.id === me?.id;
              return (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => setViewing(u)}
                  className="block w-full rounded-2xl border border-ink-100 bg-surface p-3 text-left shadow-soft transition-colors active:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="bg-brand-100 text-xs font-bold text-brand-700">
                        {u.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{u.username}</span>
                        {isMe && (
                          <span className="shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">
                            tú
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{u.email ?? "—"}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-ink-500">
                      {new Date(u.created_at).toLocaleDateString("es")}
                    </span>
                    <Badge variant={u.role.name === "admin" ? "default" : "secondary"}>{u.role.name}</Badge>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tablet y superior: tabla */}
          <div className="hidden overflow-hidden rounded-3xl border border-ink-100 bg-surface shadow-soft sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden md:table-cell">Alta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((u) => {
                  const isMe = u.id === me?.id;
                  return (
                    <UiSelectableRow key={u.id} selected={isSelected(u)} onSelect={() => toggle(u)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-brand-100 text-xs font-bold text-brand-700">
                              {u.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {u.username}
                            {isMe && (
                              <span className="ml-2 rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">
                                tú
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.email ?? "—"}</TableCell>
                      {/* Role change must not toggle row selection */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          items={Object.fromEntries(roles.map((r) => [String(r.id), r.name]))}
                          value={String(u.role.id)}
                          disabled={isMe || !canUpdate}
                          onValueChange={(v) => changeRole(u.id, Number(v))}
                        >
                          <SelectTrigger aria-label={`Rol de ${u.username}`} className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((r) => (
                              <SelectItem key={r.id} value={String(r.id)}>
                                {r.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden text-ink-500 md:table-cell">
                        {new Date(u.created_at).toLocaleDateString("es")}
                      </TableCell>
                    </UiSelectableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <UiPaginationControl page={current} pageCount={pageCount} onPageChange={setPage} />

      <UiUserView
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        user={viewing}
        actions={
          viewing
            ? {
                extra: canUpdate ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setViewing(null);
                      setResetting(viewing);
                    }}
                  >
                    <KeyRound className="size-4" />
                    Restablecer contraseña
                  </Button>
                ) : undefined,
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
                deleteDisabled: viewing.id === me?.id,
              }
            : undefined
        }
      />

      <UiUserEditForm
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        user={editing}
        currentUserId={me?.id}
        onUpdated={reload}
      />

      <UiUserCreateForm open={creating} onOpenChange={setCreating} onCreated={reload} />

      <UiUserResetPasswordForm
        open={resetting !== null}
        onOpenChange={(open) => !open && setResetting(null)}
        user={resetting}
      />

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar usuario?"
        description={deleting ? `Se eliminará la cuenta «${deleting.username}».` : undefined}
        confirmText="Eliminar"
        destructive
        onConfirm={async () => {
          if (deleting) {
            await remove(deleting.id);
            clear();
          }
        }}
      />
    </div>
  );
}
