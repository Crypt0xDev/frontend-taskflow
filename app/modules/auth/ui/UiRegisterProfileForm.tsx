"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { AVATARS } from "@/config/constants";
import { cn } from "@/lib/utils";

import { registerProfileSchema, type RegisterProfileValues } from "../schema";

export function UiRegisterProfileForm({
  onSubmit,
}: {
  onSubmit: (values: RegisterProfileValues) => Promise<unknown>;
}) {
  const form = useForm<RegisterProfileValues>({
    resolver: zodResolver(registerProfileSchema),
    defaultValues: { birth_date: null, avatar: null },
  });

  async function handleSubmit(values: RegisterProfileValues) {
    try {
      await onSubmit(values);
    } catch (err) {
      form.setError("root", {
        message: err instanceof ApiError ? err.message : "No se pudo guardar el perfil.",
      });
    }
  }

  const submitting = form.formState.isSubmitting;
  const rootError = form.formState.errors.root?.message;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Personaliza tu perfil</CardTitle>
        <CardDescription>Paso 2 de 2 · fecha de nacimiento y avatar (opcional).</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max={new Date().toISOString().slice(0, 10)}
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
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Elige tu avatar</FormLabel>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => field.onChange(field.value === a ? null : a)}
                        aria-pressed={field.value === a}
                        className={cn(
                          "grid aspect-square place-items-center rounded-lg border text-2xl transition-colors hover:bg-muted",
                          field.value === a
                            ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/40"
                            : "border-input",
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            {rootError && <p className="text-sm text-destructive">{rootError}</p>}
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-2">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Guardando…" : "Finalizar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
