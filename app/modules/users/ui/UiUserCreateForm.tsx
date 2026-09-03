"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiError } from "@/lib/api";
import { apiFieldErrors } from "@/lib/form";
import { useRoleList } from "@/app/modules/roles/hooks/useRoleList";

import { serviceUserCreate } from "../services/serviceUserCreate";
import { userCreateSchema, type UserCreateValues } from "../schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
};

export function UiUserCreateForm({ open, onOpenChange, onCreated }: Props) {
  const { roles } = useRoleList();
  const form = useForm<UserCreateValues>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: { email: "", user_name: "", password: "", role_id: undefined as unknown as number },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ email: "", user_name: "", password: "", role_id: undefined as unknown as number });
  }, [open, form]);

  async function handleSubmit(values: UserCreateValues) {
    try {
      await serviceUserCreate(values);
      toast.success("Usuario creado. Deberá cambiar la contraseña al entrar.");
      onOpenChange(false);
      onCreated();
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          if (name in form.getValues()) {
            form.setError(name as keyof UserCreateValues, { message });
          }
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo crear el usuario.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Crear usuario</SheetTitle>
          <SheetDescription>
            Define una contraseña temporal. El usuario deberá cambiarla al iniciar sesión.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
            <div className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="off"
                        placeholder="Con el que iniciará sesión"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" placeholder="Nombre visible en el sistema" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña temporal</FormLabel>
                    <FormControl>
                      <Input type="text" autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      items={Object.fromEntries(roles.map((r) => [String(r.id), r.name]))}
                      value={field.value != null ? String(field.value) : undefined}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter className="flex-row justify-end gap-2 border-t px-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creando…" : "Crear"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
