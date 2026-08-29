"use client";

import { useState } from "react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiViewField, UiViewSheet } from "@/components/UiViewSheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRowSelection } from "@/hooks/useRowSelection";

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
  const { roles, loading, reload, remove } = useRoleList();
  const { permissions } = usePermissionList();
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<Role>();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [viewing, setViewing] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState<Role | null>(null);

  const selectedIsSystem = selected ? SYSTEM_ROLES.includes(selected.name) : false;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(role: Role) {
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
        onEdit={() => selected && openEdit(selected)}
        onDelete={() => selected && setDeleting(selected)}
        onCreate={openCreate}
        deleteDisabled={selectedIsSystem}
      />

      {loading ? (
        <div className="space-y-2 rounded-md border p-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : (
        <div className="animate-fade-up rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Permisos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <UiSelectableRow key={role.id} selected={isSelected(role)} onSelect={() => toggle(role)}>
                  <TableCell className="font-medium capitalize">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground">{role.description ?? "—"}</TableCell>
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
      >
        {viewing && (
          <>
            {Object.entries(byModule(viewing.permissions)).map(([module, perms]) => (
              <UiViewField key={module} label={module}>
                <ul className="mt-1 space-y-1">
                  {perms.map((p) => (
                    <li key={p.id} className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-brand-600">{p.name}</span>
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
