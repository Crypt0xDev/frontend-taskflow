"use client";

import type { ReactNode } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  hasSelection: boolean;
  onCreate?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  createLabel?: string;
  deleteDisabled?: boolean;
  start?: ReactNode;
  end?: ReactNode;
  /** Oculta Visualizar/Editar/Eliminar en móvil cuando la fila se abre al tocarla. */
  hideSelectionActionsOnMobile?: boolean;
};

export function UiActionToolbar({
  hasSelection,
  onCreate,
  onView,
  onEdit,
  onDelete,
  createLabel = "Crear",
  deleteDisabled = false,
  start,
  end,
  hideSelectionActionsOnMobile = false,
}: Props) {
  const selectionAction = hideSelectionActionsOnMobile ? "hidden sm:inline-flex" : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onView && (
        <Button
          variant="outline"
          className={cn("text-blue-600 hover:text-blue-600 dark:text-blue-400", selectionAction)}
          disabled={!hasSelection}
          aria-label="Visualizar"
          onClick={onView}
        >
          <Eye className="size-4" />
          <span className="hidden sm:inline">Visualizar</span>
        </Button>
      )}
      {onEdit && (
        <Button variant="outline" className={selectionAction} disabled={!hasSelection} aria-label="Editar" onClick={onEdit}>
          <Pencil className="size-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="outline"
          className={cn("text-destructive hover:text-destructive", selectionAction)}
          disabled={!hasSelection || deleteDisabled}
          aria-label="Eliminar"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </Button>
      )}
      {start}

      {(onCreate || end) && (
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {end}
          {onCreate && (
            <Button onClick={onCreate}>
              <Plus className="size-4" />
              {createLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
