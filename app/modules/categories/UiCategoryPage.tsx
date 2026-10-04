"use client";

import { useMemo, useState } from "react";
import { Trash } from "lucide-react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { useTrash } from "@/hooks/useTrash";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiLoadError } from "@/components/UiLoadError";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiTrashSheet } from "@/components/UiTrashSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { useSession } from "@/lib/session";

import { useCategoryCreate, useCategoryDelete, useCategoryList, useCategoryUpdate, } from "./hooks";
import type { CategoryValues } from "./schema";
import type { Category } from "./type/typeCategoryBase";
import {
  serviceCategoryForceDelete,
  serviceCategoryRestore,
  serviceCategoryTrashed,
} from "./services";
import { UiCategoryForm } from "./ui/UiCategoryForm";
import { UiCategoryView } from "./ui/UiCategoryView";

export default function UiCategoryPage() {
  const { categories, loading, error, reload } = useCategoryList();
  const { create } = useCategoryCreate();
  const { update } = useCategoryUpdate();
  const { remove } = useCategoryDelete();
  const { hasPermission } = useSession();
  const canCreate = hasPermission("categories", "create");
  const canUpdate = hasPermission("categories", "update");
  const canDelete = hasPermission("categories", "delete");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [viewing, setViewing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<Category>();
  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState<"all" | "used" | "unused">("all");
  const [trashOpen, setTrashOpen] = useState(false);
  const trash = useTrash<Category>(
    trashOpen,
    serviceCategoryTrashed,
    serviceCategoryRestore,
    serviceCategoryForceDelete,
    {
      restored: "Categoría restaurada.",
      deleted: "Categoría eliminada definitivamente.",
      restoredAll: "Se restauraron todas las categorías.",
      emptied: "Papelera de categorías vaciada.",
    },
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q);
      const count = c.tasks_count ?? 0;
      const matchesUsage =
        usage === "all" || (usage === "used" ? count > 0 : count === 0);
      return matchesQuery && matchesUsage;
    });
  }, [categories, query, usage]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(category: Category) {
    setViewing(null);
    setEditing(category);
    setFormOpen(true);
  }

  async function handleSubmit(values: CategoryValues) {
    const result = editing ? await update(editing.id, values) : await create(values);
    reload();
    return result;
  }

  return (
    <div className="space-y-4">
      <UiHeaderModule title="Categorías" description="Clasifica tus tareas por temas." />

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

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 sm:max-w-xs"
        />
        <Select
          items={{ all: "Todas", used: "Con tareas", unused: "Sin tareas" }}
          value={usage}
          onValueChange={(v) => setUsage(v as "all" | "used" | "unused")}
        >
          <SelectTrigger aria-label="Filtrar por uso" className="w-32 shrink-0 sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="used">Con tareas</SelectItem>
            <SelectItem value="unused">Sin tareas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-2 rounded-md border p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : error && categories.length === 0 ? (
        <UiLoadError message="No se pudieron cargar las categorías." onRetry={reload} />
      ) : filtered.length === 0 ? (
        <div className="animate-fade-up rounded-md border p-10 text-center">
          <p className="font-medium">
            {categories.length === 0 ? "No tienes categorías todavía" : "Sin resultados"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length === 0
              ? "Crea una con el botón «Crear» para organizar tus tareas."
              : "Ninguna categoría coincide con la búsqueda o el filtro."}
          </p>
        </div>
      ) : (
        <div className="animate-fade-up space-y-2 sm:space-y-0">
          {/* Móvil: tarjetas apiladas, sin scroll lateral */}
          <div className="space-y-2 sm:hidden">
            {filtered.map((category) => {
              const count = category.tasks_count ?? 0;
              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => setViewing(category)}
                  className="block w-full rounded-md border p-3 text-left transition-colors active:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 shrink-0 rounded-full border"
                      style={{ backgroundColor: category.color ?? "transparent" }}
                    />
                    <span className="min-w-0 flex-1 truncate font-medium">{category.name}</span>
                  </div>
                  {category.description && (
                    <p className="mt-1 line-clamp-1 pl-5 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between pl-5 text-xs text-muted-foreground">
                    <span>{count} {count === 1 ? "tarea" : "tareas"}</span>
                    <span>{formatDateTime(category.created_at)}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tablet y superior: tabla */}
          <div className="hidden rounded-md border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                  <TableHead>Tareas</TableHead>
                  <TableHead className="hidden md:table-cell">Creada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((category) => {
                  const count = category.tasks_count ?? 0;
                  return (
                    <UiSelectableRow
                      key={category.id}
                      selected={isSelected(category)}
                      onSelect={() => toggle(category)}
                    >
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          <span
                            className="size-3 shrink-0 rounded-full border"
                            style={{ backgroundColor: category.color ?? "transparent" }}
                          />
                          <span>{category.name}</span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden max-w-xs text-muted-foreground sm:table-cell">
                        <span className="line-clamp-1">{category.description ?? "—"}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {count} {count === 1 ? "tarea" : "tareas"}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {formatDateTime(category.created_at)}
                      </TableCell>
                    </UiSelectableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <UiCategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        onSubmit={handleSubmit}
      />

      <UiCategoryView
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        category={viewing}
        actions={
          viewing
            ? {
                onEdit: canUpdate ? () => openEdit(viewing) : undefined,
                onDelete: canDelete
                  ? () => {
                      setViewing(null);
                      setDeleting(viewing);
                    }
                  : undefined,
              }
            : undefined
        }
      />

      <UiTrashSheet
        open={trashOpen}
        onOpenChange={setTrashOpen}
        onChanged={reload}
        title="Papelera de categorías"
        emptyLabel="No hay categorías en la papelera."
        itemLabel={{ one: "categoría", many: "categorías" }}
        trash={trash}
        renderItem={(c) => <p className="truncate font-medium">{c.name}</p>}
      />

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar categoría?"
        description={
          deleting
            ? `Se eliminará «${deleting.name}». Las tareas que la usaban quedarán sin categoría.`
            : undefined
        }
        confirmText="Eliminar"
        destructive
        onConfirm={async () => {
          if (deleting) {
            await remove(deleting.id);
            clear();
            reload();
          }
        }}
      />
    </div>
  );
}
