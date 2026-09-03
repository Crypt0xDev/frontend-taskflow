"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ApiError } from "@/lib/api";
import { apiFieldErrors } from "@/lib/form";
import { cn } from "@/lib/utils";

import { serviceTagCreate } from "../services/serviceTagCreate";
import { serviceTagUpdate } from "../services/serviceTagUpdate";
import { tagSchema, type TagValues } from "../schema";
import type { Tag } from "../type/typeTagBase";

const TAG_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#64748b"];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: Tag | null;
  onSaved: () => void;
};

export function UiTagForm({ open, onOpenChange, tag, onSaved }: Props) {
  const form = useForm<TagValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "", description: null, color: null },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: tag?.name ?? "",
      description: tag?.description ?? null,
      color: tag?.color ?? null,
    });
  }, [open, tag, form]);

  async function handleSubmit(values: TagValues) {
    const payload = { ...values, description: values.description?.trim() || null };
    try {
      if (tag) await serviceTagUpdate(tag.id, payload);
      else await serviceTagCreate(payload);
      toast.success(tag ? "Etiqueta actualizada." : "Etiqueta creada.");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          if (name in form.getValues()) {
            form.setError(name as keyof TagValues, { message });
          }
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "No se pudo guardar.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{tag ? "Editar etiqueta" : "Nueva etiqueta"}</SheetTitle>
          <SheetDescription>Ponle nombre, descripción y un color opcional.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col">
            <div className="space-y-4 px-4">
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
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {TAG_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          aria-label={c}
                          onClick={() => field.onChange(field.value === c ? null : c)}
                          className={cn(
                            "size-7 rounded-full ring-offset-2 ring-offset-background transition",
                            field.value === c ? "ring-2 ring-foreground" : "hover:scale-110",
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
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
