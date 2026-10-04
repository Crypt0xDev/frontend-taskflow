"use client";

import { UiViewField, UiViewSheet, type ViewSheetActions } from "@/components/UiViewSheet";
import { formatDateTime } from "@/lib/utils";

import type { Category } from "../type";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  actions?: ViewSheetActions;
};

export function UiCategoryView({ open, onOpenChange, category, actions }: Props) {
  const count = category?.tasks_count ?? 0;

  return (
    <UiViewSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de la categoría"
      description="Información completa de la categoría."
      empty={category ? undefined : "No se encontró la categoría."}
      actions={actions}
    >
      {category && (
        <>
          <UiViewField label="Nombre">
            <p className="flex items-center gap-2 font-medium">
              {category.color && (
                <span
                  className="size-3 shrink-0 rounded-full border"
                  style={{ backgroundColor: category.color }}
                />
              )}
              {category.name}
            </p>
          </UiViewField>
          <UiViewField label="Descripción">
            <p className="whitespace-pre-wrap">{category.description ?? "—"}</p>
          </UiViewField>
          <UiViewField label="Tareas">
            <p>
              {count} {count === 1 ? "tarea" : "tareas"}
            </p>
          </UiViewField>
          <UiViewField label="Creada">
            <p>{formatDateTime(category.created_at)}</p>
          </UiViewField>
          <UiViewField label="Actualizada">
            <p>{formatDateTime(category.updated_at)}</p>
          </UiViewField>
        </>
      )}
    </UiViewSheet>
  );
}
