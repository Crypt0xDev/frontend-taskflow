"use client";

import { useMemo, useState } from "react";
import { Trash } from "lucide-react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useRowSelection } from "@/hooks/useRowSelection";
import { useTrash } from "@/hooks/useTrash";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiTrashSheet } from "@/components/UiTrashSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

import { useCategoryCreate, useCategoryDelete, useCategoryList, useCategoryUpdate, } from "./hooks";
import type { CategoryValues } from "./schema";
import type { Category } from "./type/typeCategoryBase";
import {
  serviceCategoryForceDelete,
  serviceCategoryRestore,
  serviceCategoryTrashed,
} from "./services/serviceCategoryTrash";
import { UiCategoryForm } from "./ui/UiCategoryForm";
import { UiCategoryView } from "./ui/UiCategoryView";

export default function UiCategoryPage() {
  const { categories, loading, reload } = useCategoryList();
  const { create } = useCategoryCreate();
  const { update } = useCategoryUpdate();
  const { remove } = useCategoryDelete();

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
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select
          items={{ all: "Todas", used: "Con tareas", unused: "Sin tareas" }}
          value={usage}
          onValueChange={(v) => setUsage(v as "all" | "used" | "unused")}
        >
          <SelectTrigger className="w-40">
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
        <div className="animate-fade-up rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tareas</TableHead>
                <TableHead>Creada</TableHead>
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
                        {category.name}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs text-muted-foreground">
                      <span className="line-clamp-1">{category.description ?? "—"}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {count} {count === 1 ? "tarea" : "tareas"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(category.created_at)}
                    </TableCell>
                  </UiSelectableRow>
                );
              })}
            </TableBody>
          </Table>
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
      />

      <UiTrashSheet
        open={trashOpen}
        onOpenChange={setTrashOpen}
        onChanged={reload}
        title="Papelera de categorías"
        emptyLabel="No hay categorías en la papelera."
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
