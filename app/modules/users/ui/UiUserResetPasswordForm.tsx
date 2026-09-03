"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiError } from "@/lib/api";
import { apiFieldErrors } from "@/lib/form";
import type { User } from "@/lib/session";

import { serviceUserResetPassword } from "../services/serviceUserResetPassword";
import { userResetPasswordSchema, type UserResetPasswordValues } from "../schema";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export function UiUserResetPasswordForm({ open, onOpenChange, user }: Props) {
  const form = useForm<UserResetPasswordValues>({
    resolver: zodResolver(userResetPasswordSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ password: "", password_confirmation: "" });
  }, [open, form]);

  async function handleSubmit(values: UserResetPasswordValues) {
    if (!user) return;
    try {
      await serviceUserResetPassword(user.id, values);
      toast.success(`Contraseña restablecida para «${user.username}».`);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          if (name in form.getValues()) {
            form.setError(name as keyof UserResetPasswordValues, { message });
          }
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo restablecer la contraseña.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Restablecer contraseña</SheetTitle>
          <SheetDescription>
            {user ? `Define una nueva contraseña para «${user.username}».` : undefined}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
            <div className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
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
                {submitting ? "Guardando…" : "Restablecer"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
