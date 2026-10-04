"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { setFormApiErrors } from "@/lib/form";

import { resetPasswordSchema, type ResetPasswordValues } from "../schema";

type Props = {
  defaultEmail: string;
  onSubmit: (values: ResetPasswordValues) => Promise<unknown>;
  onResend: (email: string) => void;
};

export function UiPasswordResetForm({ defaultEmail, onSubmit, onResend }: Props) {
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: defaultEmail, code: "", password: "", password_confirmation: "" },
  });

  async function handleSubmit(values: ResetPasswordValues) {
    try {
      await onSubmit(values);
    } catch (err) {
      if (!setFormApiErrors(form, err)) toast.error(err instanceof ApiError ? err.message : "Error inesperado.");
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Ingresa el código</CardTitle>
        <CardDescription>Revisa tu correo y escribe el código junto a tu nueva contraseña.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="123456"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
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
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Restableciendo…" : "Restablecer contraseña"}
            </Button>
            <button
              type="button"
              onClick={() => onResend(form.getValues("email"))}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Reenviar código
            </button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
