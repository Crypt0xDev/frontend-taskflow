"use client";

import { useMemo, useState } from "react";
import { Trash } from "lucide-react";

import { UiActionToolbar } from "@/components/UiActionToolbar";
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
import { useRowSelection } from "@/hooks/useRowSelection";
import { useSession } from "@/lib/session";

import { useTagList } from "./hooks";
import {
  serviceTagForceDelete,
  serviceTagRestore,
  serviceTagTrashed,
} from "./services";
import type { Tag } from "./type/typeTagBase";
import { UiTagForm } from "./ui/UiTagForm";
import { UiTagView } from "./ui/UiTagView";

export default function UiTagPage() {
  const { tags, loading, error, reload, remove } = useTagList();
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<Tag>();
  const { hasPermission } = useSession();
  const canCreate = hasPermission("tags", "create");
  const canUpdate = hasPermission("tags", "update");
  const canDelete = hasPermission("tags", "delete");

  const [editing, setEditing] = useState<Tag | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [viewing, setViewing] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);

  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState<"all" | "used" | "unused">("all");
  const [trashOpen, setTrashOpen] = useState(false);
  const trash = useTrash<Tag>(trashOpen, serviceTagTrashed, serviceTagRestore, serviceTagForceDelete, {
    restored: "Etiqueta restaurada.",
    deleted: "Etiqueta eliminada definitivamente.",
    restoredAll: "Se restauraron todas las etiquetas.",
    emptied: "Papelera de etiquetas vaciada.",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tags.filter((t) => {
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q);
      const count = t.tasks_count ?? 0;
      const matchesUsage =
        usage === "all" || (usage === "used" ? count > 0 : count === 0);
      return matchesQuery && matchesUsage;
    });
  }, [tags, query, usage]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(tag: Tag) {
    setViewing(null);
    setEditing(tag);
    setFormOpen(true);
  }

  return (
    <div className="space-y-4">
      <UiHeaderModule title="Etiquetas" description="Clasifica tus tareas con etiquetas flexibles." />

      <UiActionToolbar
        hasSelection={hasSelection}
        onCreate={canCreate ? openCreate : undefined}
        onView={() => selected && setViewing(selected)}
        onEdit={canUpdate ? () => selected && openEdit(selected) : undefined}
        onDelete={canDelete ? () => selected && setDeleting(selected) : undefined}
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
          placeholder="Buscar por nombre o descripción…"
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
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : error && tags.length === 0 ? (
        <UiLoadError message="No se pudieron cargar las etiquetas." onRetry={reload} />
      ) : filtered.length === 0 ? (
        <div className="animate-fade-up rounded-md border p-10 text-center">
          <p className="font-medium">
            {tags.length === 0 ? "No tienes etiquetas todavía" : "Sin resultados"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tags.length === 0
              ? "Crea una con el botón «Crear»."
              : "Ninguna etiqueta coincide con la búsqueda o el filtro."}
          </p>
        </div>
      ) : (
        <div className="animate-fade-up space-y-2 sm:space-y-0">
          {/* Móvil: tarjetas apiladas, sin scroll lateral */}
          <div className="space-y-2 sm:hidden">
            {filtered.map((tag) => (
              <button
                type="button"
                key={tag.id}
                onClick={() => setViewing(tag)}
                className="block w-full rounded-md border p-3 text-left transition-colors active:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 shrink-0 rounded-full border"
                    style={{ backgroundColor: tag.color ?? "transparent" }}
                  />
                  <span className="min-w-0 flex-1 truncate font-medium">{tag.name}</span>
                </div>
                {tag.description && (
                  <p className="mt-1 line-clamp-1 pl-5 text-sm text-muted-foreground">
                    {tag.description}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between pl-5 text-xs text-muted-foreground">
                  <span>{tag.tasks_count ?? 0} tareas</span>
                  <span>{formatDateTime(tag.created_at)}</span>
                </div>
              </button>
            ))}
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
                {filtered.map((tag) => (
                  <UiSelectableRow key={tag.id} selected={isSelected(tag)} onSelect={() => toggle(tag)}>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-full border"
                          style={{ backgroundColor: tag.color ?? "transparent" }}
                        />
                        <span>{tag.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden max-w-xs text-muted-foreground sm:table-cell">
                      <span className="line-clamp-1">{tag.description ?? "—"}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tag.tasks_count ?? 0}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {formatDateTime(tag.created_at)}
                    </TableCell>
                  </UiSelectableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <UiTagForm open={formOpen} onOpenChange={setFormOpen} tag={editing} onSaved={reload} />

      <UiTagView
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        tag={viewing}
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
        title="Papelera de etiquetas"
        emptyLabel="No hay etiquetas en la papelera."
        itemLabel={{ one: "etiqueta", many: "etiquetas" }}
        trash={trash}
        renderItem={(t) => (
          <p className="flex items-center gap-2 truncate font-medium">
            {t.color && (
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
            )}
            {t.name}
          </p>
        )}
      />

      <UiConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar etiqueta?"
        description={deleting ? `Se eliminará «${deleting.name}».` : undefined}
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
