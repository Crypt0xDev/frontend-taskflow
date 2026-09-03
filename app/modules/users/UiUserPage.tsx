"use client";

import { useMemo, useState } from "react";
import { KeyRound } from "lucide-react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useSession } from "@/lib/session";
import { useRoleList } from "@/app/modules/roles/hooks/useRoleList";

import { useUserList } from "./hooks";
import type { User } from "./type";
import { UiUserCreateForm } from "./ui/UiUserCreateForm";
import { UiUserEditForm } from "./ui/UiUserEditForm";
import { UiUserResetPasswordForm } from "./ui/UiUserResetPasswordForm";
import { UiUserViewSheet } from "./ui/UiUserViewSheet";

export default function UiUserPage() {
  const { users, loading, reload, changeRole, remove } = useUserList();
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
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<User>();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role.name === roleFilter) &&
        (!q || u.username.toLowerCase().includes(q)),
    );
  }, [users, query, roleFilter]);

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
        start={
          <Button
            variant="outline"
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
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select
          items={{
            all: "Todos los roles",
            ...Object.fromEntries(roles.map((r) => [r.name, r.name])),
          }}
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v ?? "all")}
        >
          <SelectTrigger className="w-40">
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
        <div className="space-y-2 rounded-3xl border border-ink-100 bg-surface p-4 shadow-soft">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="animate-fade-up rounded-3xl border border-dashed border-ink-200 bg-surface p-10 text-center shadow-soft">
          <p className="font-display font-semibold">Sin resultados</p>
          <p className="mt-1 text-sm text-ink-500">
            {query || roleFilter !== "all"
              ? "Ningún usuario coincide con los filtros."
              : "Las cuentas registradas aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="animate-fade-up overflow-hidden rounded-3xl border border-ink-100 bg-surface shadow-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Alta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
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
                        <SelectTrigger className="w-36">
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
                    <TableCell className="text-ink-500">
                      {new Date(u.created_at).toLocaleDateString("es")}
                    </TableCell>
                  </UiSelectableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <UiUserViewSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        user={viewing}
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
