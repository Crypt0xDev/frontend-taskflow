"use client";

import { useMemo, useState } from "react";
import { Trash } from "lucide-react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCategoryOptions } from "@/app/modules/categories/hooks";
import { PAGE_SIZE } from "@/config/constants";

import { useTaskCreate, useTaskDelete, useTaskList, useTaskUpdate } from "./hooks";
import type { Task, TaskPriority, TaskStatus } from "./type/typeTaskBase";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "./type/typeTaskBase";
import type { TaskInput } from "./type/typeTaskInput";
import { UiTaskForm } from "./ui/UiTaskForm";
import { UiTaskList } from "./ui/UiTaskList";
import { UiTaskTrash } from "./ui/UiTaskTrash";
import { UiTaskView } from "./ui/UiTaskView";

export default function UiTaskPage() {
  const { tasks, loading, query, setQuery, reload } = useTaskList();
  const { create } = useTaskCreate();
  const { update } = useTaskUpdate();
  const { remove } = useTaskDelete();
  const categories = useCategoryOptions();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const { selected, hasSelection, toggle: toggleSelect, clear: clearSelect } = useRowSelection<Task>();
  const [trashOpen, setTrashOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = tasks.filter(
    (t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (priorityFilter === "all" || t.priority === priorityFilter) &&
      (categoryFilter === "all" || String(t.category_id) === categoryFilter),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const statusItems = useMemo(
    () => ({
      all: "Todos los estados",
      ...Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label])),
    }),
    [],
  );
  const priorityItems = useMemo(
    () => ({
      all: "Todas las prioridades",
      ...Object.fromEntries(PRIORITY_OPTIONS.map((o) => [o.value, o.label])),
    }),
    [],
  );
  const categoryItems = useMemo(
    () => ({
      all: "Todas las categorías",
      ...Object.fromEntries(categories.map((c) => [String(c.id), c.name])),
    }),
    [categories],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormOpen(true);
  }

  async function handleSubmit(values: TaskInput) {
    const result = editing ? await update(editing.id, values) : await create(values);
    reload();
    return result;
  }

  return (
    <div className="space-y-4">
      <UiHeaderModule
        title="Tareas"
        description={`Gestiona tus tareas y su estado · ${tasks.length} en total.`}
      />

      <UiActionToolbar
        hasSelection={hasSelection}
        onView={() => selected && setViewing(selected)}
        onEdit={() => selected && openEdit(selected)}
        onDelete={() => selected && setDeleting(selected)}
        onCreate={openCreate}
        end={
          <Button variant="outline" onClick={() => setTrashOpen(true)}>
            <Trash className="size-4" />
            Papelera
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por título…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select
          items={statusItems}
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | TaskStatus)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          items={priorityItems}
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as "all" | TaskPriority)}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            {PRIORITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          items={categoryItems}
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v ?? "all")}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <UiTaskList
        tasks={paged}
        loading={loading}
        selectedId={selected?.id ?? null}
        onSelect={toggleSelect}
      />

      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={current === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(pageCount, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <UiTaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
        categories={categories}
        onSubmit={handleSubmit}
      />

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Enviar a la papelera?"
        description={
          deleting ? `La tarea «${deleting.title}» se moverá a la papelera.` : undefined
        }
        confirmText="Enviar a papelera"
        destructive
        onConfirm={async () => {
          if (deleting) {
            await remove(deleting.id);
            clearSelect();
            reload();
          }
        }}
      />

      <UiTaskView
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        task={viewing}
      />

      <UiTaskTrash open={trashOpen} onOpenChange={setTrashOpen} onChanged={reload} />
    </div>
  );
}
