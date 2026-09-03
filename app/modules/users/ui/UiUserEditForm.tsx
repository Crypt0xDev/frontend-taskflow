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
import type { User } from "@/lib/session";
import { useRoleList } from "@/app/modules/roles/hooks/useRoleList";

import { serviceUserUpdate } from "../services/serviceUserUpdate";
import { userEditSchema, type UserEditValues } from "../schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  currentUserId?: number;
  onUpdated: () => void;
};

export function UiUserEditForm({ open, onOpenChange, user, currentUserId, onUpdated }: Props) {
  const { roles } = useRoleList();
  const form = useForm<UserEditValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: { user_name: "", email: "", role_id: undefined as unknown as number },
  });

  useEffect(() => {
    if (!open || !user) return;
    form.reset({ user_name: user.username, email: user.email ?? "", role_id: user.role.id });
  }, [open, user, form]);

  async function handleSubmit(values: UserEditValues) {
    if (!user) return;
    try {
      await serviceUserUpdate(user.id, values);
      toast.success("Usuario actualizado.");
      onOpenChange(false);
      onUpdated();
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          if (name in form.getValues()) {
            form.setError(name as keyof UserEditValues, { message });
          }
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Editar usuario</SheetTitle>
          <SheetDescription>Actualiza el nombre, correo y rol de la cuenta.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
            <div className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                      disabled={user?.id === currentUserId}
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
                {submitting ? "Guardando…" : "Guardar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
