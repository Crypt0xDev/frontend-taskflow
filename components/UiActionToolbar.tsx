"use client";

import type { ReactNode } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

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
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onView && (
        <Button
          variant="outline"
          className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
          disabled={!hasSelection}
          onClick={onView}
        >
          <Eye className="size-4" />
          Visualizar
        </Button>
      )}
      {onEdit && (
        <Button variant="outline" disabled={!hasSelection} onClick={onEdit}>
          <Pencil className="size-4" />
          Editar
        </Button>
      )}
      {onDelete && (
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          disabled={!hasSelection || deleteDisabled}
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
          Eliminar
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
