"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { setFormApiErrors } from "@/lib/form";

import { useContactSend } from "../hooks";
import { contactSchema, type ContactValues } from "../schema";

export function UiContactForm() {
  const { send } = useContactSend();
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function handleSubmit(values: ContactValues) {
    try {
      await send(values);
      form.reset();
    } catch (err) {
      if (!setFormApiErrors(form, err)) {
        toast.error(err instanceof ApiError ? err.message : "No se pudo enviar el mensaje.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
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
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-muted-foreground">
          Usamos tu nombre y correo solo para responderte. Más detalles en la{" "}
          <Link href="/privacy" className="font-medium underline underline-offset-4">
            Política de privacidad
          </Link>
          .
        </p>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </form>
    </Form>
  );
}
