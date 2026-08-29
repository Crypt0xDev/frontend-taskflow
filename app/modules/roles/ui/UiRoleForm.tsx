"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

import { serviceRoleCreate } from "../services/serviceRoleCreate";
import { serviceRoleUpdate } from "../services/serviceRoleUpdate";
import type { Permission, Role } from "../type/typeRoleBase";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
  onSaved: () => void;
};

export function UiRoleForm({ open, onOpenChange, role, permissions, onSaved }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(undefined);
    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setSelected(new Set(role?.permissions.map((p) => p.id) ?? []));
  }, [open, role]);

  const grouped = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
      (acc[p.module] ??= []).push(p);
      return acc;
    }, {});
  }, [permissions]);

  function togglePerm(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (name.trim().length < 1) {
      setError("El nombre es obligatorio.");
      return;
    }
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      permission_ids: Array.from(selected),
    };
    setSaving(true);
    try {
      if (role) await serviceRoleUpdate(role.id, payload);
      else await serviceRoleCreate(payload);
      toast.success(role ? "Rol actualizado." : "Rol creado.");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el rol.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{role ? "Editar rol" : "Nuevo rol"}</SheetTitle>
          <SheetDescription>Define el nombre y los permisos del rol.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="role-name">Nombre</Label>
            <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-desc">Descripción</Label>
            <Textarea
              id="role-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Permisos</Label>
            {Object.entries(grouped).map(([module, perms]) => (
              <div key={module} className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground capitalize">{module}</p>
                <div className="space-y-1">
                  {perms.map((p) => {
                    const on = selected.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePerm(p.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-sm transition-colors",
                          on ? "border-brand-500 bg-brand-500/10" : "border-input hover:bg-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-4 shrink-0 place-items-center rounded border",
                            on ? "border-brand-500 bg-brand-500 text-white" : "border-input",
                          )}
                        >
                          {on && <Check className="size-3" />}
                        </span>
                        <span className="font-mono text-xs">{p.name}</span>
                        <span className="truncate text-muted-foreground">{p.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <SheetFooter className="flex-row justify-end gap-2 border-t px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
