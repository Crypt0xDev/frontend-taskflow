"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { UiActionToolbar } from "@/components/UiActionToolbar";
import { useTrash } from "@/hooks/useTrash";
import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { UiHeaderModule } from "@/components/UiHeaderModule";
import { UiSelectableRow } from "@/components/UiSelectableRow";
import { UiTrashSheet } from "@/components/UiTrashSheet";
import { UiViewField, UiViewSheet } from "@/components/UiViewSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiError } from "@/lib/api";
import { cn, formatDateTime } from "@/lib/utils";
import { useRowSelection } from "@/hooks/useRowSelection";

import { useTagList } from "./hooks/useTagList";
import { serviceTagCreate, serviceTagUpdate } from "./services/serviceTag";
import {
  serviceTagForceDelete,
  serviceTagRestore,
  serviceTagTrashed,
} from "./services/serviceTagTrash";
import type { Tag } from "./type/typeTagBase";

const TAG_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6", "#64748b"];

export default function UiTagPage() {
  const { tags, loading, reload, remove } = useTagList();
  const { selected, hasSelection, toggle, clear, isSelected } = useRowSelection<Tag>();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [viewing, setViewing] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<Tag | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [usage, setUsage] = useState<"all" | "used" | "unused">("all");
  const [trashOpen, setTrashOpen] = useState(false);
  const trash = useTrash<Tag>(trashOpen, serviceTagTrashed, serviceTagRestore, serviceTagForceDelete);

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

  useEffect(() => {
    if (!formOpen) return;
    setError(undefined);
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setColor(editing?.color ?? null);
  }, [formOpen, editing]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setFormOpen(true);
  }

  async function submit() {
    setError(undefined);
    if (name.trim().length < 1) {
      setError("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name: name.trim(), description: description.trim() || null, color };
      if (editing) await serviceTagUpdate(editing.id, payload);
      else await serviceTagCreate(payload);
      toast.success(editing ? "Etiqueta actualizada." : "Etiqueta creada.");
      setFormOpen(false);
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <UiHeaderModule title="Etiquetas" description="Clasifica tus tareas con etiquetas flexibles." />

      <UiActionToolbar
        hasSelection={hasSelection}
        onCreate={openCreate}
        onView={() => selected && setViewing(selected)}
        onEdit={() => selected && openEdit(selected)}
        onDelete={() => selected && setDeleting(selected)}
        end={
          <Button variant="outline" onClick={() => setTrashOpen(true)}>
            <Trash className="size-4" />
            Papelera
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por nombre o descripción…"
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
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
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
              {filtered.map((tag) => (
                <UiSelectableRow key={tag.id} selected={isSelected(tag)} onSelect={() => toggle(tag)}>
                  <TableCell className="font-medium">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-3 shrink-0 rounded-full border"
                        style={{ backgroundColor: tag.color ?? "transparent" }}
                      />
                      {tag.name}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs text-muted-foreground">
                    <span className="line-clamp-1">{tag.description ?? "—"}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tag.tasks_count ?? 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(tag.created_at)}
                  </TableCell>
                </UiSelectableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>{editing ? "Editar etiqueta" : "Nueva etiqueta"}</SheetTitle>
            <SheetDescription>Ponle nombre, descripción y un color opcional.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Nombre</Label>
              <Input id="tag-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-desc">Descripción</Label>
              <Textarea
                id="tag-desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={() => setColor(color === c ? null : c)}
                    className={cn(
                      "size-7 rounded-full ring-offset-2 ring-offset-background transition",
                      color === c ? "ring-2 ring-foreground" : "hover:scale-110",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <SheetFooter className="flex-row justify-end gap-2 border-t px-4">
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <UiViewSheet
        open={viewing !== null}
        onOpenChange={(open) => !open && setViewing(null)}
        title="Detalle de la etiqueta"
        description="Información de la etiqueta."
        empty={viewing ? undefined : "No se encontró la etiqueta."}
      >
        {viewing && (
          <>
            <UiViewField label="Nombre">
              <p className="flex items-center gap-2 font-medium">
                {viewing.color && (
                  <span
                    className="size-3 shrink-0 rounded-full border"
                    style={{ backgroundColor: viewing.color }}
                  />
                )}
                {viewing.name}
              </p>
            </UiViewField>
            <UiViewField label="Descripción">
              <p className="whitespace-pre-wrap">{viewing.description ?? "—"}</p>
            </UiViewField>
            <UiViewField label="Color">
              <p>{viewing.color ?? "—"}</p>
            </UiViewField>
            <UiViewField label="Tareas">
              <p>{viewing.tasks_count ?? 0}</p>
            </UiViewField>
          </>
        )}
      </UiViewSheet>

      <UiTrashSheet
        open={trashOpen}
        onOpenChange={setTrashOpen}
        onChanged={reload}
        title="Papelera de etiquetas"
        emptyLabel="No hay etiquetas en la papelera."
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
