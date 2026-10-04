"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Trash } from "lucide-react";

//
import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UiPaginationControl } from "@/components/UiPaginationControl";
import { useCategoryOptions } from "@/app/modules/categories/hooks";
import { useResponsivePageSize } from "@/hooks/useResponsivePageSize";
import { useSession } from "@/lib/session";

// Tipado
import { useTaskCreate, useTaskDelete, useTaskList, useTaskUpdate } from "./hooks";
import type { Task, TaskPriority, TaskStatus } from "./type/typeTaskBase";
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "./type/typeTaskBase";
import type { TaskInput } from "./type/typeTaskInput";

// Componentes
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
  const { hasPermission } = useSession();
  const canCreate = hasPermission("tasks", "create");
  const canUpdate = hasPermission("tasks", "update");
  const canDelete = hasPermission("tasks", "delete");

  // `/tasks?new=1` (desde el dashboard) abre el formulario de creación.
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const wantsNew = canCreate && searchParams.get("new") === "1";
  const [formOpen, setFormOpen] = useState(wantsNew);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const { selected, hasSelection, toggle: toggleSelect, clear: clearSelect } = useRowSelection<Task>();
  const [trashOpen, setTrashOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | TaskPriority>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [tableRef, pageSize] = useResponsivePageSize<HTMLDivElement>();

  // Limpia ?new=1 para que recargar la página no vuelva a abrir el formulario.
  useEffect(() => {
    if (wantsNew) router.replace(pathname);
  }, [wantsNew, router, pathname]);

  const activeFilters = [statusFilter, priorityFilter, categoryFilter].filter((f) => f !== "all").length;

  const filtered = tasks.filter(
    (t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (priorityFilter === "all" || t.priority === priorityFilter) &&
      (categoryFilter === "all" || String(t.category_id) === categoryFilter),
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const paged = filtered.slice((current - 1) * pageSize, current * pageSize);

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
    setViewing(null);
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
        onEdit={canUpdate ? () => selected && openEdit(selected) : undefined}
        onDelete={canDelete ? () => selected && setDeleting(selected) : undefined}
        onCreate={canCreate ? openCreate : undefined}
        hideSelectionActionsOnMobile
        end={
          canDelete ? (
            <Button variant="outline" onClick={() => setTrashOpen(true)}>
              <Trash className="size-4" />
              Papelera
            </Button>
          ) : undefined
        }
      />

      <div className="flex gap-2 sm:hidden">
        <Input
          placeholder="Buscar por título…"
          aria-label="Buscar por título"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="outline"
          aria-expanded={filtersOpen}
          aria-controls="task-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal className="size-4" />
          Filtros{activeFilters > 0 && ` (${activeFilters})`}
        </Button>
      </div>

      <div
        id="task-filters"
        className={`${filtersOpen ? "grid" : "hidden"} grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center`}
      >
        <Input
          placeholder="Buscar por título…"
          aria-label="Buscar por título"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="hidden sm:block sm:max-w-xs"
        />
        <Select
          items={statusItems}
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | TaskStatus)}
        >
          <SelectTrigger aria-label="Filtrar por estado" className="w-full sm:w-40">
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
          <SelectTrigger aria-label="Filtrar por prioridad" className="w-full sm:w-44">
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
          <SelectTrigger aria-label="Filtrar por categoría" className="col-span-2 w-full sm:col-span-1 sm:w-44">
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

      <div ref={tableRef}>
        <UiTaskList
          tasks={paged}
          loading={loading}
          selectedId={selected?.id ?? null}
          onSelect={toggleSelect}
          onOpen={setViewing}
        />
      </div>

      <UiPaginationControl page={current} pageCount={pageCount} onPageChange={setPage} />

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
        onEdit={canUpdate ? openEdit : undefined}
        onDelete={
          canDelete
            ? (task) => {
                setViewing(null);
                setDeleting(task);
              }
            : undefined
        }
      />

      <UiTaskTrash open={trashOpen} onOpenChange={setTrashOpen} onChanged={reload} />
    </div>
  );
}
