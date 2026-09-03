"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { apiFieldErrors } from "@/lib/form";
import { cn } from "@/lib/utils";

import { serviceRoleCreate } from "../services/serviceRoleCreate";
import { serviceRoleUpdate } from "../services/serviceRoleUpdate";
import { roleSchema, type RoleValues } from "../schema";
import type { Permission, Role } from "../type/typeRoleBase";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
  onSaved: () => void;
};

export function UiRoleForm({ open, onOpenChange, role, permissions, onSaved }: Props) {
  const form = useForm<RoleValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: null, permission_ids: [] },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: role?.name ?? "",
      description: role?.description ?? null,
      permission_ids: role?.permissions.map((p) => p.id) ?? [],
    });
  }, [open, role, form]);

  const grouped = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, p) => {
      (acc[p.module] ??= []).push(p);
      return acc;
    }, {});
  }, [permissions]);

  async function handleSubmit(values: RoleValues) {
    try {
      if (role) await serviceRoleUpdate(role.id, values);
      else await serviceRoleCreate(values);
      toast.success(role ? "Rol actualizado." : "Rol creado.");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          if (name in form.getValues()) {
            form.setError(name as keyof RoleValues, { message });
          }
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo guardar el rol.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{role ? "Editar rol" : "Nuevo rol"}</SheetTitle>
          <SheetDescription>Define el nombre y los permisos del rol.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            noValidate
            className="flex flex-1 flex-col gap-4 px-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permission_ids"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Permisos</FormLabel>
                  {Object.entries(grouped).map(([module, perms]) => (
                    <div key={module} className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground capitalize">{module}</p>
                      <div className="space-y-1">
                        {perms.map((p) => {
                          const on = field.value.includes(p.id);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  on
                                    ? field.value.filter((id) => id !== p.id)
                                    : [...field.value, p.id],
                                )
                              }
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="flex-row justify-end gap-2 border-t px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando…" : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
