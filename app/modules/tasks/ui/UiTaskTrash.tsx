"use client";

import { useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import { UiConfirmDialog } from "@/components/UiConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useTaskTrash } from "../hooks";
import { UiTaskStatusBadge } from "./UiTaskStatusBadge";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
};

export function UiTaskTrash({ open, onOpenChange, onChanged }: Props) {
  const { items, loading, restore, forceRemove, restoreAll, forceRemoveAll } = useTaskTrash(open);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  async function handleRestore(id: number) {
    if (await restore(id)) onChanged();
  }

  async function handleRestoreAll() {
    if (await restoreAll()) onChanged();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto border-l sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Papelera</SheetTitle>
          <SheetDescription>
            Restaura una tarea o elimínala definitivamente.
          </SheetDescription>
        </SheetHeader>

        {/* Bulk actions */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4">
            <Button variant="outline" size="sm" onClick={handleRestoreAll}>
              <RotateCcw className="size-4" />
              Restaurar todo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmEmpty(true)}
            >
              <Trash2 className="size-4" />
              Vaciar papelera
            </Button>
          </div>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            La papelera está vacía.
          </p>
        ) : (
          <ul className="divide-y overflow-y-auto px-4">
            {items.map((task) => (
              <li key={task.id} className="flex items-center justify-between gap-2 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{task.title}</p>
                  <div className="mt-1">
                    <UiTaskStatusBadge status={task.status} />
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleRestore(task.id)}>
                    Restaurar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => forceRemove(task.id)}
                  >
                    Borrar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>

      <UiConfirmDialog
        open={confirmEmpty}
        onOpenChange={setConfirmEmpty}
        title="¿Vaciar la papelera?"
        description={`Se eliminarán definitivamente ${items.length} ${items.length === 1 ? "tarea" : "tareas"
          }. Esta acción no se puede deshacer.`}
        confirmText="Vaciar papelera"
        destructive
        onConfirm={forceRemoveAll}
      />
    </Sheet>
  );
}
