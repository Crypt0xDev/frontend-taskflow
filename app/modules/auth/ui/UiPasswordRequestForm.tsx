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

import { forgotPasswordSchema, type ForgotPasswordValues } from "../schema";

type Props = {
  defaultEmail: string;
  onSubmit: (values: ForgotPasswordValues) => Promise<unknown>;
  onHaveCode: (email: string) => void;
};

export function UiPasswordRequestForm({ defaultEmail, onSubmit, onHaveCode }: Props) {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: defaultEmail },
  });

  async function handleSubmit(values: ForgotPasswordValues) {
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
        <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
        <CardDescription>Te enviaremos un código de 6 dígitos a tu correo.</CardDescription>
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
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Enviando…" : "Enviar código"}
            </Button>
            <button
              type="button"
              onClick={() => onHaveCode(form.getValues("email"))}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Ya tengo un código
            </button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
