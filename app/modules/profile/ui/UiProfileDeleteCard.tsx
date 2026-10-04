"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ApiError } from "@/lib/api";
import { setFormApiErrors } from "@/lib/form";

import { useProfileDelete } from "../hooks/useProfileDelete";
import { deleteAccountSchema, type DeleteAccountValues } from "../schema";

/** Zona de peligro del perfil: eliminación definitiva de la cuenta (con contraseña). */
export function UiProfileDeleteCard() {
  const { remove } = useProfileDelete();
  const [open, setOpen] = useState(false);
  const form = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { current_password: "" },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) form.reset();
  }

  async function handleSubmit(values: DeleteAccountValues) {
    try {
      // Al cerrarse la sesión, el layout de la app redirige a /login (donde se ve el aviso).
      await remove(values);
    } catch (err) {
      if (!setFormApiErrors(form, err)) {
        toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar la cuenta.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Card className="animate-fade-up border-destructive/30">
      <CardHeader>
        <CardTitle className="font-display text-destructive">Eliminar mi cuenta</CardTitle>
        <CardDescription>
          Se borran de forma definitiva tu cuenta, tus tareas, categorías, etiquetas y comentarios. No se puede
          deshacer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Eliminar mi cuenta
        </Button>
      </CardContent>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="overflow-y-auto border-l">
          <SheetHeader className="border-b">
            <SheetTitle className="flex items-center gap-2">
              <TriangleAlert className="size-5 text-destructive" />
              ¿Eliminar tu cuenta?
            </SheetTitle>
            <SheetDescription>
              Esta acción es permanente. Para confirmar, escribe tu contraseña.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
              <div className="px-4">
                <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" autoComplete="current-password" autoFocus {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter className="mt-auto">
                <Button type="submit" variant="destructive" disabled={submitting}>
                  {submitting ? "Eliminando…" : "Eliminar definitivamente"}
                </Button>
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
