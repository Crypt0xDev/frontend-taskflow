"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api";
import { apiFieldErrors } from "@/lib/form";
import { cn } from "@/lib/utils";
import type { Category } from "@/app/modules/categories/type";
import { UiCategoryCombobox } from "@/app/modules/categories/ui/UiCategoryCombobox";
import { useTagList } from "@/app/modules/tags/hooks/useTagList";

import { taskSchema, type TaskValues } from "../schema";
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../type";

const EMPTY: TaskValues = {
  title: "",
  description: "",
  status: "pending",
  priority: "media",
  due_date: null,
  category_id: null,
  tag_ids: [],
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  categories: Category[];
  onSubmit: (values: TaskValues) => Promise<unknown>;
};

export function UiTaskForm({ open, onOpenChange, task, categories, onSubmit }: Props) {
  const { tags } = useTagList();
  const form = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      task
        ? {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
          category_id: task.category_id,
          tag_ids: task.tags?.map((t) => t.id) ?? [],
        }
        : EMPTY,
    );
  }, [open, task, form]);

  async function handleSubmit(values: TaskValues) {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fields = apiFieldErrors(error.errors);
        for (const [name, message] of Object.entries(fields)) {
          form.setError(name as keyof TaskValues, { message });
        }
      } else {
        toast.error(error instanceof ApiError ? error.message : "Error inesperado.");
      }
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{task ? "Editar tarea" : "Nueva tarea"}</SheetTitle>
          <SheetDescription>
            {task ? "Actualiza los datos de la tarea." : "Completa los datos de la tarea."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4 px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        items={STATUS_LABELS}
                        value={field.value}
                        onValueChange={(v) => field.onChange(v as TaskStatus)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <UiCategoryCombobox
                        categories={categories}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <Select
                        items={PRIORITY_LABELS}
                        value={field.value}
                        onValueChange={(v) => field.onChange(v as TaskPriority)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vence</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {tags.length > 0 && (
                <FormField
                  control={form.control}
                  name="tag_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiquetas</FormLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => {
                          const on = field.value.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  on
                                    ? field.value.filter((id: number) => id !== tag.id)
                                    : [...field.value, tag.id],
                                )
                              }
                              className={cn(
                                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                                on ? "border-brand-500 bg-brand-500/10" : "border-input hover:bg-muted",
                              )}
                            >
                              <span
                                className="size-2 rounded-full"
                                style={{ backgroundColor: tag.color ?? "var(--muted-foreground)" }}
                              />
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
