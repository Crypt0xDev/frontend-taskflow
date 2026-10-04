"use client";

import { useState } from "react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiLoadError } from "@/components/UiLoadError";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiViewField, UiViewSheet } from "@/components/UiViewSheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRowSelection } from "@/hooks/useRowSelection";
import { useSession } from "@/lib/session";

import { usePermissionList } from "./hooks/usePermissionList";
import { useRoleList } from "./hooks/useRoleList";
import type { Permission, Role } from "./type/typeRoleBase";
import { UiRoleForm } from "./ui/UiRoleForm";

const SYSTEM_ROLES = ["admin", "user"];

function byModule(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.module] ??= []).push(p);
    return acc;
  }, {});
}

export default function UiRolePage() {
  const { roles, loading, error, reload, remove } = useRoleList();
  const { permissions } = usePermissionList();
  const { hasPermission } = useSession();
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<Role>();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [viewing, setViewing] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);

  const canCreate = hasPermission("roles", "create");
  const canUpdate = hasPermission("roles", "update");
  const canDelete = hasPermission("roles", "delete");

  const selectedIsSystem = selected ? SYSTEM_ROLES.includes(selected.name) : false;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(role: Role) {
    setViewing(null);
    setEditing(role);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <UiHeaderModule
        title="Roles y permisos"
        description="Catálogo de acceso: qué puede hacer cada rol."
      />

      <UiActionToolbar
        hasSelection={hasSelection}
        onView={() => selected && setViewing(selected)}
        onEdit={canUpdate ? () => selected && openEdit(selected) : undefined}
        onDelete={canDelete ? () => selected && setDeleting(selected) : undefined}
        onCreate={canCreate ? openCreate : undefined}
        deleteDisabled={selectedIsSystem}
        hideSelectionActionsOnMobile
      />

      {loading ? (
        <div className="space-y-2 rounded-md border p-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : error && roles.length === 0 ? (
        <UiLoadError message="No se pudieron cargar los roles." onRetry={reload} />
      ) : (
        <div className="animate-fade-up space-y-2 sm:space-y-0">
          {/* Móvil: tarjetas apiladas, sin scroll lateral */}
          <div className="space-y-2 sm:hidden">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                onClick={() => setViewing(role)}
                className="block w-full rounded-md border p-3 text-left transition-colors active:bg-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate font-medium capitalize">{role.name}</span>
                  <Badge variant="secondary" className="shrink-0">
                    {role.permissions_count ?? role.permissions.length}
                  </Badge>
                </div>
                {role.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{role.description}</p>
                )}
              </button>
            ))}
          </div>

          {/* Tablet y superior: tabla */}
          <div className="hidden rounded-md border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                  <TableHead>Permisos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <UiSelectableRow key={role.id} selected={isSelected(role)} onSelect={() => toggle(role)}>
                    <TableCell className="font-medium capitalize">{role.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">{role.description ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {role.permissions_count ?? role.permissions.length}
                      </Badge>
                    </TableCell>
                  </UiSelectableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <UiRoleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editing}
        permissions={permissions}
        onSaved={reload}
      />

      <UiViewSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title={viewing ? `Rol: ${viewing.name}` : "Rol"}
        description={viewing?.description ?? undefined}
        empty={viewing ? undefined : "No se encontró el rol."}
        actions={
          viewing
            ? {
                onEdit: canUpdate ? () => openEdit(viewing) : undefined,
                onDelete: canDelete
                  ? () => {
                      setViewing(null);
                      setDeleting(viewing);
                    }
                  : undefined,
                deleteDisabled: SYSTEM_ROLES.includes(viewing.name),
              }
            : undefined
        }
      >
        {viewing && (
          <>
            {Object.entries(byModule(viewing.permissions)).map(([module, perms]) => (
              <UiViewField key={module} label={module}>
                <ul className="mt-1 space-y-1">
                  {perms.map((p) => (
                    <li key={p.id} className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-brand-700 dark:text-brand-400">{p.name}</span>
                      <span className="text-muted-foreground">{p.description}</span>
                    </li>
                  ))}
                </ul>
              </UiViewField>
            ))}
            {viewing.permissions.length === 0 && (
              <p className="text-sm text-muted-foreground">Este rol no tiene permisos.</p>
            )}
          </>
        )}
      </UiViewSheet>

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar rol?"
        description={deleting ? `Se eliminará el rol «${deleting.name}».` : undefined}
        confirmText="Eliminar"
        destructive
        onConfirm={async () => {
          if (deleting) {
            await remove(deleting.id);
            clear();
            reload();
          }
        }}
      />
    </div>
  );
}
