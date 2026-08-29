"use client";

import { useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiViewField, UiViewSheet } from "@/components/UiViewSheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import type { Role, User } from "@/lib/session";
import { useSession } from "@/lib/session";

import { useUserList } from "../hooks";
import { serviceUserResetPassword } from "../services/serviceUserResetPassword";
import { serviceUserCreate } from "../services/serviceUserCreate";
import { serviceUserUpdate } from "../services/serviceUserUpdate";

export default function UiUserList() {
  const { users, loading, reload, changeRole, remove } = useUserList();
  const { user: me } = useSession();
  const [deleting, setDeleting] = useState<User | null>(null);
  const [viewing, setViewing] = useState<User | null>(null);
  const [resetting, setResetting] = useState<User | null>(null);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwdError, setPwdError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<User>();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  const [creating, setCreating] = useState(false);
  const [cEmail, setCEmail] = useState("");
  const [cUserName, setCUserName] = useState("");
  const [cPwd, setCPwd] = useState("");
  const [cRole, setCRole] = useState<Role>("user");
  const [cError, setCError] = useState<string | undefined>();
  const [cSaving, setCSaving] = useState(false);

  function openCreate() {
    setCEmail("");
    setCUserName("");
    setCPwd("");
    setCRole("user");
    setCError(undefined);
    setCreating(true);
  }

  async function submitCreate() {
    setCError(undefined);
    if (!/^\S+@\S+\.\S+$/.test(cEmail)) {
      setCError("Correo no válido.");
      return;
    }
    if (cUserName.trim().length < 3) {
      setCError("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (cPwd.length < 8) {
      setCError("La contraseña temporal debe tener al menos 8 caracteres.");
      return;
    }
    setCSaving(true);
    try {
      await serviceUserCreate({
        email: cEmail,
        user_name: cUserName.trim(),
        password: cPwd,
        role: cRole,
      });
      toast.success("Usuario creado. Deberá cambiar la contraseña al entrar.");
      setCreating(false);
      reload();
    } catch (error) {
      setCError(error instanceof ApiError ? error.message : "No se pudo crear el usuario.");
    } finally {
      setCSaving(false);
    }
  }

  const [editing, setEditing] = useState<User | null>(null);
  const [eUserName, setEUserName] = useState("");
  const [eEmail, setEEmail] = useState("");
  const [eRole, setERole] = useState<Role>("user");
  const [eError, setEError] = useState<string | undefined>();
  const [eSaving, setESaving] = useState(false);

  function openEdit(user: User) {
    setEUserName(user.username);
    setEEmail(user.email ?? "");
    setERole(user.role);
    setEError(undefined);
    setEditing(user);
  }

  async function submitEdit() {
    if (!editing) return;
    setEError(undefined);
    if (eUserName.trim().length < 3) {
      setEError("El nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(eEmail)) {
      setEError("Correo no válido.");
      return;
    }
    setESaving(true);
    try {
      await serviceUserUpdate(editing.id, {
        user_name: eUserName.trim(),
        email: eEmail.trim(),
        role: eRole,
      });
      toast.success("Usuario actualizado.");
      setEditing(null);
      reload();
    } catch (error) {
      setEError(error instanceof ApiError ? error.message : "No se pudo actualizar.");
    } finally {
      setESaving(false);
    }
  }

  function openReset(user: User) {
    setPwd("");
    setPwd2("");
    setPwdError(undefined);
    setResetting(user);
  }

  async function submitReset() {
    if (!resetting) return;
    setPwdError(undefined);
    if (pwd.length < 8) {
      setPwdError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (pwd !== pwd2) {
      setPwdError("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    try {
      await serviceUserResetPassword(resetting.id, {
        password: pwd,
        password_confirmation: pwd2,
      });
      toast.success(`Contraseña restablecida para «${resetting.username}».`);
      setResetting(null);
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "No se pudo restablecer la contraseña.";
      setPwdError(message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role === roleFilter) &&
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
        onCreate={openCreate}
        createLabel="Crear usuario"
        onView={() => selected && setViewing(selected)}
        onEdit={() => selected && openEdit(selected)}
        onDelete={() => selected && setDeleting(selected)}
        deleteDisabled={selectedIsMe}
        start={
          <Button
            variant="outline"
            disabled={!hasSelection}
            onClick={() => selected && openReset(selected)}
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
          items={{ all: "Todos los roles", admin: "Administradores", user: "Usuarios" }}
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as "all" | Role)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="user">Usuarios</SelectItem>
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
                        items={{ user: "Usuario", admin: "Administrador" }}
                        value={u.role}
                        disabled={isMe}
                        onValueChange={(v) => changeRole(u.id, v as Role)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
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

      <UiViewSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Detalle del usuario"
        description="Información de la cuenta."
        empty={viewing ? undefined : "No se encontró el usuario."}
      >
        {viewing && (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="bg-brand-100 text-xl font-bold text-brand-700">
                  {viewing.avatar ?? viewing.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{viewing.username}</p>
                <Badge variant={viewing.role === "admin" ? "default" : "secondary"} className="mt-1 text-xs">
                  {viewing.role === "admin" ? "Administrador" : "Usuario"}
                </Badge>
              </div>
            </div>
            <UiViewField label="Correo">
              <p>{viewing.email ?? "—"}</p>
            </UiViewField>
            <UiViewField label="Edad">
              <p>{viewing.age != null ? `${viewing.age} años` : "—"}</p>
            </UiViewField>
            <UiViewField label="Alta">
              <p>{formatDateTime(viewing.created_at)}</p>
            </UiViewField>
          </>
        )}
      </UiViewSheet>

      {/* Edit user (admin) */}
      <Sheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Editar usuario</SheetTitle>
            <SheetDescription>Actualiza el nombre, correo y rol de la cuenta.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="e-username">Nombre de usuario</Label>
              <Input id="e-username" value={eUserName} onChange={(e) => setEUserName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-email">Correo</Label>
              <Input id="e-email" type="email" value={eEmail} onChange={(e) => setEEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                items={{ user: "Usuario", admin: "Administrador" }}
                value={eRole}
                disabled={editing?.id === me?.id}
                onValueChange={(v) => setERole(v as Role)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {eError && <p className="text-sm text-destructive">{eError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditing(null)} disabled={eSaving}>
                Cancelar
              </Button>
              <Button onClick={submitEdit} disabled={eSaving}>
                {eSaving ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create user (admin) */}
      <Sheet open={creating} onOpenChange={setCreating}>
        <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Crear usuario</SheetTitle>
            <SheetDescription>
              Define una contraseña temporal. El usuario deberá cambiarla al iniciar sesión.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="c-email">Correo</Label>
              <Input
                id="c-email"
                type="email"
                autoComplete="off"
                placeholder="Con el que iniciará sesión"
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-username">Nombre de usuario</Label>
              <Input
                id="c-username"
                autoComplete="off"
                placeholder="Nombre visible en el sistema"
                value={cUserName}
                onChange={(e) => setCUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-pwd">Contraseña temporal</Label>
              <Input
                id="c-pwd"
                type="text"
                autoComplete="off"
                value={cPwd}
                onChange={(e) => setCPwd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                items={{ user: "Usuario", admin: "Administrador" }}
                value={cRole}
                onValueChange={(v) => setCRole(v as Role)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {cError && <p className="text-sm text-destructive">{cError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setCreating(false)} disabled={cSaving}>
                Cancelar
              </Button>
              <Button onClick={submitCreate} disabled={cSaving}>
                {cSaving ? "Creando…" : "Crear"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Admin password reset */}
      <Sheet open={resetting !== null} onOpenChange={(open) => !open && setResetting(null)}>
        <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>Restablecer contraseña</SheetTitle>
            <SheetDescription>
              {resetting ? `Define una nueva contraseña para «${resetting.username}».` : undefined}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="reset-pwd">Nueva contraseña</Label>
              <Input
                id="reset-pwd"
                type="password"
                autoComplete="new-password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reset-pwd2">Confirmar contraseña</Label>
              <Input
                id="reset-pwd2"
                type="password"
                autoComplete="new-password"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
              />
            </div>
            {pwdError && <p className="text-sm text-destructive">{pwdError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setResetting(null)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={submitReset} disabled={saving}>
                {saving ? "Guardando…" : "Restablecer"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
